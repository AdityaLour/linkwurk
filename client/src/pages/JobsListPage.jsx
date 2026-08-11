import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Skeleton,
  Alert,
  IconButton,
  Drawer,
  Badge,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import JobFilters from "@/features/jobs/components/JobFilters";
import JobListRow from "@/features/jobs/components/JobListRow";
import SearchField from "@/components/SearchField";
import { getAllJobs } from "@/features/jobs/api/jobsApi";
import { getSavedJobs, toggleSaveJob } from "@/features/jobs/api/savedJobsApi";
import { useAuth } from "@/context/AuthContext";

const DARK = "#14431A";
const GREEN = "#1B5E20";
const BORDER = `3px solid ${DARK}`;

export default function JobsListPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    experienceRequired: "",
    skills: [],
    salaryMin: "",
    isRemote: false,
    search: "",
  });
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllJobs(filters);
      setJobs(res.data.jobs);
    } catch (err) {
      setError("Failed to load jobs. Try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchJobs, 400);
    return () => clearTimeout(t);
  }, [filters]);

  useEffect(() => {
    if (user?.role === "candidate") {
      getSavedJobs().then((res) => {
        setSavedJobIds(
          new Set(res.data.savedJobs.map((s) => s.jobId?._id).filter(Boolean)),
        );
      });
    }
  }, [user]);

  const handleToggleSave = async (jobId) => {
    setSavedJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) next.delete(jobId);
      else next.add(jobId);
      return next;
    });
    await toggleSaveJob(jobId);
  };

  const activeFilterCount = [
    filters.location,
    filters.experienceRequired,
    filters.salaryMin,
    filters.isRemote,
    filters.skills?.length > 0,
  ].filter(Boolean).length;

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        backgroundImage:
          "radial-gradient(rgba(27,94,32,0.28) 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        minHeight: "100vh",
        py: 6,
      }}
    >
      <Box sx={{ maxWidth: 1300, mx: "auto", px: 3 }}>
        <Typography
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 800,
            fontSize: { xs: "1.6rem", md: "2rem" },
            color: DARK,
            textTransform: "uppercase",
            mb: 3,
          }}
        >
          Open roles
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 0, border: `2px solid ${DARK}` }}
          >
            {error}
          </Alert>
        )}

        {/* Search + filter trigger — always visible, own row on mobile */}
        <Box
          sx={{ display: "flex", gap: 1.5, mb: 3, alignItems: "flex-start" }}
        >
          <Box sx={{ flex: 1 }}>
            <SearchField
              value={filters.search || ""}
              onChange={(v) => setFilters({ ...filters, search: v })}
              placeholder="Search jobs..."
            />
          </Box>
          <Badge
            badgeContent={activeFilterCount}
            color="warning"
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <IconButton
              onClick={() => setFilterDrawerOpen(true)}
              sx={{
                border: `2px solid ${DARK}`,
                borderRadius: 0,
                color: DARK,
                bgcolor: "#FFFFFF",
                flexShrink: 0,
              }}
            >
              <TuneIcon />
            </IconButton>
          </Badge>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* Desktop sidebar — filters only, search lives above now */}
          <Box
            sx={{
              width: { md: 260 },
              flexShrink: 0,
              display: { xs: "none", md: "block" },
            }}
          >
            <JobFilters filters={filters} onChange={setFilters} hideSearch />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                color: "#2F5A33",
                fontWeight: 500,
                mb: 1.5,
                fontSize: "0.9rem",
              }}
            >
              {loading
                ? "Loading jobs..."
                : `${jobs.length} open position${jobs.length !== 1 ? "s" : ""}`}
            </Typography>

            <Box
              sx={{
                border: BORDER,
                boxShadow: `5px 5px 0px ${GREEN}`,
                bgcolor: "#FFFFFF",
                maxHeight: "70vh",
                overflowY: "auto",
              }}
            >
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    height={72}
                    sx={{ borderBottom: "2px solid #E8F5E9" }}
                  />
                ))
              ) : jobs.length === 0 ? (
                <Typography
                  sx={{ color: "#2F5A33", p: 4, textAlign: "center" }}
                >
                  No jobs match these filters.
                </Typography>
              ) : (
                jobs.map((job) => (
                  <JobListRow
                    key={job._id}
                    job={job}
                    isSaved={savedJobIds.has(job._id)}
                    onToggleSave={
                      user?.role === "candidate"
                        ? () => handleToggleSave(job._id)
                        : undefined
                    }
                  />
                ))
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Mobile filter drawer */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        slotProps={{
          paper: { sx: { width: 300, borderLeft: `3px solid ${DARK}` } },
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                textTransform: "uppercase",
                color: DARK,
                fontSize: "0.9rem",
              }}
            >
              Filters
            </Typography>
            <IconButton
              onClick={() => setFilterDrawerOpen(false)}
              size="small"
              sx={{ color: DARK }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <JobFilters
            filters={filters}
            onChange={setFilters}
            hideSearch
            hideHeading
          />
        </Box>
      </Drawer>
    </Box>
  );
}

import { useState, useEffect } from "react";
import { Box, Typography, Skeleton, Alert } from "@mui/material";
import JobFilters from "@/features/jobs/components/JobFilters";
import JobListRow from "@/features/jobs/components/JobListRow";
import { getAllJobs } from "@/features/jobs/api/jobsApi";

const DARK = "#14431A";
const BORDER = `3px solid ${DARK}`;

export default function JobsListPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    experienceRequired: "",
    skills: [],
    salaryMin: "",
  });

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

  // debounce location typing so it doesn't refetch on every keystroke; other filters refetch immediately
  useEffect(() => {
    const t = setTimeout(fetchJobs, 400);
    return () => clearTimeout(t);
  }, [filters]);

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

        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box sx={{ width: { md: 260 }, flexShrink: 0 }}>
            <JobFilters filters={filters} onChange={setFilters} />
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
                boxShadow: "5px 5px 0px #1B5E20",
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
                jobs.map((job) => <JobListRow key={job._id} job={job} />)
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

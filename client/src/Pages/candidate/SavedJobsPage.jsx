import { useState, useEffect } from "react";
import { Box, Typography, Grid, Skeleton, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import JobCard from "@/features/jobs/components/JobCard";
import { getSavedJobs, toggleSaveJob } from "@/features/jobs/api/savedJobsApi";

const DARK = "#14431A";

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = () => {
    setLoading(true);
    getSavedJobs()
      .then((res) => setSavedJobs(res.data.savedJobs))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const handleUnsave = async (jobId, e) => {
    e.stopPropagation();
    await toggleSaveJob(jobId);
    loadSaved();
  };

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
      <Box sx={{ maxWidth: 1100, mx: "auto", px: 3 }}>
        <Typography
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 800,
            fontSize: { xs: "1.6rem", md: "2rem" },
            color: DARK,
            textTransform: "uppercase",
            mb: 4,
          }}
        >
          Saved jobs
        </Typography>
        {loading ? (
          <Grid container spacing={2.5}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rectangular" height={180} />
              </Grid>
            ))}
          </Grid>
        ) : savedJobs.length === 0 ? (
          <Typography sx={{ color: "#2F5A33" }}>No saved jobs yet.</Typography>
        ) : (
          <Grid container spacing={2.5}>
            {savedJobs.map((saved) => (
              <Grid item xs={12} sm={6} md={4} key={saved._id}>
                <Box sx={{ position: "relative" }}>
                  <IconButton
                    onClick={(e) => handleUnsave(saved.jobId?._id, e)}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      zIndex: 2,
                      bgcolor: "#FFFFFF",
                      border: `2px solid ${DARK}`,
                      borderRadius: 0,
                      "&:hover": { bgcolor: "#1B5E20", color: "#FFFFFF" },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                  <JobCard job={saved.jobId} />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}

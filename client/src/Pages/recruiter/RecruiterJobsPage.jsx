import { useState, useEffect } from "react";
import { Box, Typography, Grid, Skeleton } from "@mui/material";
import LinkWurkButton from "@/components/Button";
import { useNavigate } from "react-router-dom";
import RecruiterJobCard from "@/features/recruiters/components/RecruiterJobCard";
import { getMyJobs, updateJobStatus } from "@/features/jobs/api/jobsApi";

export default function RecruiterJobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = () => {
    setLoading(true);
    getMyJobs()
      .then((res) => setJobs(res.data.jobs))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleToggleStatus = async (jobId) => {
    await updateJobStatus(jobId);
    loadJobs();
  };

  return (
    <Box sx={{ px: { xs: 3, md: 5 }, py: 6, maxWidth: 1100, mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4">Your job postings</Typography>
        <LinkWurkButton
          variant="contained"
          color="primary"
          onClick={() => navigate("/recruiter/jobs/new")}
        >
          Post a job
        </LinkWurkButton>
      </Box>
      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={160} />
            </Grid>
          ))}
        </Grid>
      ) : jobs.length === 0 ? (
        <Typography color="text.secondary">
          You haven't posted any jobs yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {jobs.map((job, i) => (
            <Grid item xs={12} sm={6} md={4} key={job._id}>
              <RecruiterJobCard
                job={job}
                index={i}
                onToggleStatus={handleToggleStatus}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

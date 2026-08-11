import { useState, useEffect } from "react";
import { Box, Typography, Grid, Skeleton } from "@mui/material";
import LinkWurkButton from "@/components/Button";
import { useNavigate } from "react-router-dom";
import RecruiterJobCard from "@/features/recruiters/components/RecruiterJobCard";
import { getMyJobs, updateJobStatus } from "@/features/jobs/api/jobsApi";
import SearchField from "@/components/SearchField";

export default function RecruiterJobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const filteredJobs = jobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Box sx={{ px: { xs: 3, md: 5 }, py: 6, maxWidth: 1100, mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
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

      <Box sx={{ mb: 3, maxWidth: 320 }}>
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Search your jobs..."
        />
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={160} />
            </Grid>
          ))}
        </Grid>
      ) : filteredJobs.length === 0 ? (
        <Typography color="text.secondary">
          {jobs.length === 0
            ? "You haven't posted any jobs yet."
            : "No jobs match your search."}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredJobs.map((job, i) => (
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

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Pagination,
  Skeleton,
  Alert,
} from "@mui/material";
import JobCard from "@/features/jobs/components/JobCard";
import { getAllJobs } from "@/features/jobs/api/jobsApi";

export default function JobsListPage() {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async (page) => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllJobs(page);
      setJobs(res.data.jobs);
      setPagination(res.data.pagination);
    } catch (err) {
      setError("Failed to load jobs. Try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
  }, []);

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", px: 3, py: 6 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Open roles
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        {loading
          ? "Loading jobs..."
          : `${pagination.totalJobs || jobs.length} open positions`}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rounded" height={180} />
              </Grid>
            ))
          : jobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job._id}>
                <JobCard job={job} />
              </Grid>
            ))}
      </Grid>

      {!loading && jobs.length === 0 && !error && (
        <Typography color="text.secondary" sx={{ mt: 6, textAlign: "center" }}>
          No open roles right now. Check back soon.
        </Typography>
      )}

      {!loading && pagination.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage}
            onChange={(e, page) => fetchJobs(page)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}

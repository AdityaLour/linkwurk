import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Skeleton, Button } from "@mui/material";
import JobCard from "@/features/jobs/components/JobCard";
import { getAllJobs } from "@/features/jobs/api/jobsApi";

const DARK = "#14431A";
const BORDER = `3px solid ${DARK}`;

export default function OpenRolesSection() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllJobs()
      .then((res) => setJobs(res.data.jobs.slice(0, 3)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ px: { xs: 3, md: 5 }, py: 5, maxWidth: 1100, mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2.5,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: "1.1rem",
            fontWeight: 700,
            textTransform: "uppercase",
            color: DARK,
          }}
        >
          Open roles right now
        </Typography>
        <Button
          onClick={() => navigate("/jobs")}
          sx={{
            border: `2px solid ${DARK}`,
            borderRadius: 0,
            color: DARK,
            fontWeight: 700,
            textTransform: "uppercase",
            fontSize: "0.75rem",
          }}
        >
          View all
        </Button>
      </Box>
      <Grid container spacing={2.5}>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton
                variant="rectangular"
                height={180}
                sx={{ border: BORDER }}
              />
            </Grid>
          ))
        ) : jobs.length === 0 ? (
          <Grid item xs={12}>
            <Typography sx={{ color: "#2F5A33" }}>
              No open roles right now. Check back soon.
            </Typography>
          </Grid>
        ) : (
          jobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job._id}>
              <JobCard job={job} />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}

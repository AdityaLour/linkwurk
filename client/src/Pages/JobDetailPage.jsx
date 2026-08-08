import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
  Skeleton,
  Alert,
  Divider,
} from "@mui/material";
import { getJobById } from "@/features/jobs/api/jobsApi";
import ApplySection from "@/features/applications/components/ApplySection";
import { formatSalary } from "@/lib/formatSalary";

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getJobById(id)
      .then((res) => setJob(res.data.job))
      .catch(() => setError("Job not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ maxWidth: 720, mx: "auto", px: 3, py: 6 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width="60%" height={30} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={200} />
      </Box>
    );
  }

  if (error || !job) {
    return (
      <Box sx={{ maxWidth: 720, mx: "auto", px: 3, py: 6 }}>
        <Alert severity="error">{error || "Job not found."}</Alert>
      </Box>
    );
  }

  const recruiter = job.recruiterId || {};

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: 3, py: 6 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Avatar
          src={recruiter.companyLogo}
          sx={{ width: 56, height: 56, bgcolor: "secondary.main" }}
        >
          {recruiter.companyName?.[0] || "?"}
        </Avatar>
        <Box>
          <Typography variant="h5">
            {recruiter.companyName || "Company"}
          </Typography>
          {recruiter.companyTagline && (
            <Typography variant="body2" color="text.secondary">
              {recruiter.companyTagline}
            </Typography>
          )}
        </Box>
      </Box>

      <Typography variant="h4" sx={{ mb: 1 }}>
        {job.title}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 1 }}>
        {job.location}
      </Typography>
      <Typography
        sx={{
          fontFamily: '"IBM Plex Mono", monospace',
          color: "success.main",
          mb: 2,
        }}
      >
        {formatSalary(job.salaryMin, job.salaryMax)}
      </Typography>

      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        useFlexGap
        sx={{ mb: 3 }}
      >
        {(job.skillsRequired || []).map((skill) => (
          <Chip key={skill} label={skill} size="small" />
        ))}
        <Chip label={job.experienceRequired} size="small" variant="outlined" />
        {job.numberOfOpenings && (
          <Chip
            label={`${job.numberOfOpenings} openings`}
            size="small"
            variant="outlined"
          />
        )}
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" sx={{ mb: 1 }}>
        About this role
      </Typography>
      <Typography sx={{ whiteSpace: "pre-wrap", mb: 3 }}>
        {job.description}
      </Typography>

      {job.lastApplyDate && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Apply before {new Date(job.lastApplyDate).toLocaleDateString()}
        </Typography>
      )}

      <ApplySection job={job} />
    </Box>
  );
}

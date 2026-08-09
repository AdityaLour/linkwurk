import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Skeleton,
  Alert,
  Divider,
} from "@mui/material";
import { getJobById } from "@/features/jobs/api/jobsApi";
import ApplySection from "@/features/applications/components/ApplySection";
import { formatSalary } from "@/lib/formatSalary";
import { formatExperience } from "@/lib/formatExperience";

const DARK = "#14431A";
const GREEN = "#1B5E20";
const BORDER = `3px solid ${DARK}`;
const SHADOW = `6px 6px 0px ${GREEN}`;

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

  const wrapperSx = {
    bgcolor: "background.default",
    backgroundImage:
      "radial-gradient(rgba(27,94,32,0.28) 1.5px, transparent 1.5px)",
    backgroundSize: "24px 24px",
    minHeight: "100vh",
    py: 6,
  };

  if (loading) {
    return (
      <Box sx={wrapperSx}>
        <Box sx={{ maxWidth: 720, mx: "auto", px: 3 }}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="text" width="60%" height={30} sx={{ mb: 3 }} />
          <Skeleton
            variant="rectangular"
            height={200}
            sx={{ border: BORDER }}
          />
        </Box>
      </Box>
    );
  }

  if (error || !job) {
    return (
      <Box sx={wrapperSx}>
        <Box sx={{ maxWidth: 720, mx: "auto", px: 3 }}>
          <Alert
            severity="error"
            sx={{ borderRadius: 0, border: `2px solid ${DARK}` }}
          >
            {error || "Job not found."}
          </Alert>
        </Box>
      </Box>
    );
  }

  const recruiter = job.recruiterId || {};

  return (
    <Box sx={wrapperSx}>
      <Box sx={{ maxWidth: 720, mx: "auto", px: 3 }}>
        <Box
          sx={{
            border: BORDER,
            boxShadow: SHADOW,
            bgcolor: "#FFFFFF",
            p: { xs: 3, md: 4 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Avatar
              variant="square"
              src={recruiter.companyLogo}
              sx={{
                width: 56,
                height: 56,
                bgcolor: "#66BB6A",
                color: DARK,
                border: `2.5px solid ${DARK}`,
                fontWeight: 700,
              }}
            >
              {recruiter.companyName?.[0] || "?"}
            </Avatar>
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  color: DARK,
                }}
              >
                {recruiter.companyName || "Company"}
              </Typography>
              {recruiter.companyTagline && (
                <Typography sx={{ fontSize: "0.85rem", color: "#7A7267" }}>
                  {recruiter.companyTagline}
                </Typography>
              )}
            </Box>
          </Box>

          <Typography
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 800,
              fontSize: { xs: "1.5rem", md: "1.8rem" },
              color: DARK,
              mb: 1,
              textTransform: "uppercase",
            }}
          >
            {job.title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography sx={{ color: "#2F5A33" }}>{job.location}</Typography>
            {job.isRemote && (
              <Box
                sx={{
                  border: `2px solid ${DARK}`,
                  bgcolor: "#E8F5E9",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: DARK,
                  px: 0.8,
                  py: 0.2,
                }}
              >
                Remote
              </Box>
            )}
          </Box>

          <Typography
            sx={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontWeight: 600,
              color: GREEN,
              mb: 2.5,
            }}
          >
            {formatSalary(job.salaryMin, job.salaryMax)}
          </Typography>

          <Box sx={{ display: "flex", gap: 1.5, mb: 3, flexWrap: "wrap" }}>
            <Box
              sx={{ flex: "1 1 140px", border: `2px solid ${DARK}`, p: 1.2 }}
            >
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#7A7267",
                }}
              >
                Experience
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: DARK,
                }}
              >
                {formatExperience(job.experienceRequired)}
              </Typography>
            </Box>
            <Box
              sx={{ flex: "1 1 140px", border: `2px solid ${DARK}`, p: 1.2 }}
            >
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#7A7267",
                }}
              >
                Openings
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: DARK,
                }}
              >
                {job.numberOfOpenings || 1}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#7A7267",
                mb: 1,
              }}
            >
              Skills required
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {(job.skillsRequired || []).map((skill) => (
                <Box
                  key={skill}
                  sx={{
                    flexShrink: 0,
                    border: `2px solid ${DARK}`,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: DARK,
                    px: 1,
                    py: 0.3,
                    whiteSpace: "nowrap",
                  }}
                >
                  {skill}
                </Box>
              ))}
            </Box>
          </Box>

          <Divider sx={{ borderColor: DARK, mb: 3 }} />

          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              color: DARK,
              mb: 1,
            }}
          >
            About this role
          </Typography>
          <Typography sx={{ whiteSpace: "pre-wrap", color: "#2F5A33", mb: 3 }}>
            {job.description}
          </Typography>

          {job.lastApplyDate && (
            <Typography sx={{ fontSize: "0.85rem", color: "#7A7267", mb: 2 }}>
              Apply before{" "}
              {new Date(job.lastApplyDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Typography>
          )}

          <ApplySection job={job} />
        </Box>
      </Box>
    </Box>
  );
}

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Skeleton, Button } from "@mui/material";
import LinkWurkButton from "@/components/Button";
import RecruiterJobCard from "./RecruiterJobCard";
import useCountUp from "@/hooks/useCountUp";
import { getMyJobs, updateJobStatus } from "@/features/jobs/api/jobsApi";
import { getMyInterviews } from "@/features/interviews/api/interviewsApi";

const BORDER = "3px solid #14431A";
const SHADOW = "5px 5px 0px #1B5E20";
const actionBtnSx = {
  border: "2px solid #14431A",
  borderRadius: 0,
  color: "#14431A",
  fontSize: "0.7rem",
  fontWeight: 700,
  px: 1.3,
};

function StatCard({ label, value, loading, delay, onClick }) {
  const count = useCountUp(value, { duration: 900, delay });
  const [punch, setPunch] = useState(false);
  const prevCount = useRef(0);

  useEffect(() => {
    if (count === value && value > 0 && prevCount.current !== value) {
      setPunch(true);
      const t = setTimeout(() => setPunch(false), 300);
      prevCount.current = value;
      return () => clearTimeout(t);
    }
  }, [count, value]);

  if (loading)
    return (
      <Skeleton variant="rectangular" height={116} sx={{ border: BORDER }} />
    );
  return (
    <Box
      onClick={onClick}
      sx={{
        border: BORDER,
        boxShadow: SHADOW,
        bgcolor: "#FFFFFF",
        p: 2.5,
        cursor: "pointer",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          transform: "translate(-2px, -2px)",
          boxShadow: "7px 7px 0px #1B5E20",
        },
        "&:active": {
          transform: "translate(3px, 3px)",
          boxShadow: "2px 2px 0px #1B5E20",
        },
      }}
    >
      <Typography
        sx={{
          fontSize: "0.8rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.4px",
          color: "#14431A",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: "2.3rem",
          fontWeight: 600,
          color: "#1B5E20",
          mt: 0.5,
          display: "inline-block",
          transform: punch ? "scale(1.15)" : "scale(1)",
          transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {String(count).padStart(2, "0")}
      </Typography>
    </Box>
  );
}

function NextInterviewBanner({ interview, onClick }) {
  if (!interview) return null;
  const application = interview.applicationId || {};
  const candidate = application.candidateId || {};
  const candidateUser = candidate.userId || {};
  const job = application.jobId || {};

  return (
    <Box
      onClick={onClick}
      sx={{
        border: BORDER,
        boxShadow: SHADOW,
        bgcolor: "#FFFFFF",
        p: 2.5,
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1.5,
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          transform: "translate(-2px, -2px)",
          boxShadow: "7px 7px 0px #1B5E20",
        },
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.4px",
            color: "#7A7267",
            mb: 0.3,
          }}
        >
          Next interview
        </Typography>
        <Typography sx={{ fontWeight: 700, color: "#14431A" }}>
          {candidateUser.firstName} {candidateUser.lastName} &mdash; {job.title}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: "0.85rem",
          fontWeight: 600,
          color: "#1B5E20",
        }}
      >
        {new Date(interview.scheduledAt).toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Typography>
    </Box>
  );
}

export default function RecruiterHomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);

  const loadData = () => {
    setLoading(true);
    Promise.allSettled([getMyJobs(), getMyInterviews()]).then(
      ([jobsRes, interviewsRes]) => {
        if (jobsRes.status === "fulfilled") setJobs(jobsRes.value.data.jobs);
        if (interviewsRes.status === "fulfilled")
          setInterviews(interviewsRes.value.data.interviews);
        setLoading(false);
      },
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (jobId) => {
    await updateJobStatus(jobId);
    loadData();
  };

  const activeJobs = jobs.filter((j) => j.status === "open").length;

  const now = new Date();
  const nextInterview =
    interviews
      .filter((i) => i.status === "Scheduled" && new Date(i.scheduledAt) > now)
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))[0] ||
    null;

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        backgroundImage:
          "radial-gradient(rgba(27,94,32,0.28) 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        minHeight: "100vh",
        animation: "driftDots 40s linear infinite",
        "@keyframes driftDots": {
          from: { backgroundPosition: "0px 0px" },
          to: { backgroundPosition: "480px 480px" },
        },
      }}
    >
      <Box
        sx={{ px: { xs: 3, md: 5 }, py: { xs: 5, md: 8 }, textAlign: "center" }}
      >
        <Typography
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 800,
            fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.6rem" },
            color: "#14431A",
            maxWidth: 600,
            mx: "auto",
            lineHeight: 1.15,
            textTransform: "uppercase",
          }}
        >
          Post once, reach the right candidates
        </Typography>
        <Typography
          sx={{
            color: "#2F5A33",
            fontWeight: 500,
            mt: 1.5,
            mb: 3,
            fontSize: { xs: "0.95rem", sm: "1.05rem" },
          }}
        >
          Manage your listings and review applicants in one place.
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <LinkWurkButton
            variant="contained"
            size="large"
            onClick={() => navigate("/recruiter/jobs/new")}
            sx={{
              border: BORDER,
              borderRadius: 0,
              boxShadow: "5px 5px 0px #14431A",
              bgcolor: "#1B5E20",
              color: "#FFFFFF",
              textTransform: "uppercase",
              fontWeight: 700,
              px: 3,
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              "&:hover": {
                bgcolor: "#164d1b",
                transform: "translate(-2px, -2px)",
                boxShadow: "7px 7px 0px #14431A",
              },
              "&:active": {
                transform: "translate(3px, 3px)",
                boxShadow: "2px 2px 0px #14431A",
              },
            }}
          >
            Post a job
          </LinkWurkButton>
          <Button
            onClick={() => navigate("/recruiter/jobs")}
            sx={{
              border: BORDER,
              borderRadius: 0,
              color: "#14431A",
              fontWeight: 700,
              textTransform: "uppercase",
              px: 3,
              bgcolor: "#FFFFFF",
              boxShadow: "5px 5px 0px #1B5E20",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              "&:hover": {
                transform: "translate(-2px, -2px)",
                boxShadow: "7px 7px 0px #1B5E20",
              },
              "&:active": {
                transform: "translate(3px, 3px)",
                boxShadow: "2px 2px 0px #1B5E20",
              },
            }}
          >
            View my jobs
          </Button>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 3, md: 5 }, pb: 4, maxWidth: 1100, mx: "auto" }}>
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6}>
            <StatCard
              label="Active jobs"
              value={activeJobs}
              loading={loading}
              delay={0}
              onClick={() => navigate("/recruiter/jobs")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StatCard
              label="Interviews"
              value={interviews.length}
              loading={loading}
              delay={100}
              onClick={() => navigate("/recruiter/interviews")}
            />
          </Grid>
        </Grid>

        {!loading && (
          <Box sx={{ mt: 2.5 }}>
            <NextInterviewBanner
              interview={nextInterview}
              onClick={() => navigate("/recruiter/interviews")}
            />
          </Box>
        )}
      </Box>

      <Box sx={{ px: { xs: 3, md: 5 }, pb: 6, maxWidth: 1100, mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2.5,
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          <Typography
            sx={{
              fontSize: "1.15rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.3px",
              color: "#14431A",
            }}
          >
            Your job postings
          </Typography>
          {jobs.length > 3 && (
            <Button
              onClick={() => navigate("/recruiter/jobs")}
              sx={{
                ...actionBtnSx,
                fontSize: "0.75rem",
                bgcolor: "#FFFFFF",
                boxShadow: "3px 3px 0px #14431A",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                "&:hover": {
                  bgcolor: "#1B5E20",
                  color: "#FFFFFF",
                  transform: "translate(-1px, -1px)",
                  boxShadow: "4px 4px 0px #14431A",
                },
              }}
            >
              View all
            </Button>
          )}
        </Box>

        {loading ? (
          <Grid container spacing={2.5}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton
                  variant="rectangular"
                  height={210}
                  sx={{ border: BORDER }}
                />
              </Grid>
            ))}
          </Grid>
        ) : jobs.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography sx={{ color: "#2F5A33", fontWeight: 500, mb: 2 }}>
              You haven't posted any jobs yet.
            </Typography>
            <LinkWurkButton
              variant="contained"
              onClick={() => navigate("/recruiter/jobs/new")}
              sx={{
                border: BORDER,
                borderRadius: 0,
                boxShadow: "4px 4px 0px #14431A",
                bgcolor: "#1B5E20",
                color: "#FFFFFF",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Post your first job
            </LinkWurkButton>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {jobs.slice(0, 3).map((job, i) => (
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
    </Box>
  );
}

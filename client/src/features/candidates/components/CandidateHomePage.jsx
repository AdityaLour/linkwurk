import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Skeleton,
  LinearProgress,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import EventIcon from "@mui/icons-material/Event";
import JobCard from "@/features/jobs/components/JobCard";
import ApplicationStatusCarousel from "./ApplicationStatusCarousel";
import useCountUp from "@/hooks/useCountUp";
import { getRecommendedJobs } from "@/features/jobs/api/jobsApi";
import { getMyApplications } from "@/features/applications/api/applicationsApi";
import { getSavedJobs } from "@/features/jobs/api/savedJobsApi";
import { getMyInterviewsAsCandidate } from "@/features/interviews/api/interviewsApi";
import { getMyCandidateProfile } from "../api/candidatesApi";

const DARK = "#14431A";
const GREEN = "#1B5E20";
const BORDER = `3px solid ${DARK}`;
const SHADOW = `5px 5px 0px ${GREEN}`;

function StatCard({ icon, label, value, loading, delay, onClick }) {
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
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        alignItems: "center",
        gap: 2,
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        "&:hover": onClick
          ? {
              transform: "translate(-2px, -2px)",
              boxShadow: `7px 7px 0px ${GREEN}`,
            }
          : {},
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          border: `2px solid ${DARK}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: DARK,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          sx={{
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.4px",
            color: DARK,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: "1.7rem",
            fontWeight: 600,
            color: GREEN,
            display: "inline-block",
            transform: punch ? "scale(1.15)" : "scale(1)",
            transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {String(count).padStart(2, "0")}
        </Typography>
      </Box>
    </Box>
  );
}

export default function CandidateHomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [barValue, setBarValue] = useState(0);

  useEffect(() => {
    Promise.allSettled([
      getMyApplications(),
      getSavedJobs(),
      getMyInterviewsAsCandidate(),
      getRecommendedJobs(),
      getMyCandidateProfile(),
    ]).then(([appsRes, savedRes, interviewsRes, recRes, profileRes]) => {
      if (appsRes.status === "fulfilled")
        setApplications(appsRes.value.data.applications);
      if (savedRes.status === "fulfilled")
        setSavedJobs(savedRes.value.data.savedJobs);
      if (interviewsRes.status === "fulfilled")
        setInterviews(interviewsRes.value.data.interviews);
      if (recRes.status === "fulfilled")
        setRecommendedJobs(recRes.value.data.jobs);
      if (profileRes.status === "fulfilled") {
        const c = profileRes.value.data.candidate;
        const checks = [
          c.skills?.length > 0,
          c.education?.length > 0,
          !!c.resume?.url,
          !!c.summary,
          c.certifications?.length > 0,
        ];
        setProfileCompletion(
          Math.round((checks.filter(Boolean).length / checks.length) * 100),
        );
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setBarValue(profileCompletion), 200);
      return () => clearTimeout(t);
    }
  }, [loading, profileCompletion]);

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        backgroundImage:
          "radial-gradient(rgba(27,94,32,0.28) 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        minHeight: "100vh",
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
            color: DARK,
            maxWidth: 600,
            mx: "auto",
            lineHeight: 1.15,
            textTransform: "uppercase",
          }}
        >
          Where skills meet the right role
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
          Browse open roles matched to your profile.
        </Typography>
        <Button
          onClick={() => navigate("/jobs")}
          sx={{
            border: BORDER,
            borderRadius: 0,
            boxShadow: `5px 5px 0px ${DARK}`,
            bgcolor: GREEN,
            color: "#FFFFFF",
            textTransform: "uppercase",
            fontWeight: 700,
            px: 3,
            py: 1.2,
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
            "&:hover": {
              bgcolor: "#164d1b",
              transform: "translate(-2px, -2px)",
              boxShadow: `7px 7px 0px ${DARK}`,
            },
            "&:active": {
              transform: "translate(3px, 3px)",
              boxShadow: `2px 2px 0px ${DARK}`,
            },
          }}
        >
          Browse jobs
        </Button>
      </Box>

      <Box sx={{ px: { xs: 3, md: 5 }, pb: 3, maxWidth: 1100, mx: "auto" }}>
        {loading ? (
          <Skeleton variant="rectangular" height={64} sx={{ border: BORDER }} />
        ) : (
          profileCompletion < 100 && (
            <Box
              sx={{
                border: BORDER,
                boxShadow: SHADOW,
                bgcolor: "#FFFFFF",
                p: 2.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Typography
                  sx={{ fontWeight: 700, color: DARK, fontSize: "0.9rem" }}
                >
                  Profile {profileCompletion}% complete
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: GREEN,
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/candidate/onboarding/skills")}
                >
                  Complete your profile
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={barValue}
                sx={{
                  height: 8,
                  borderRadius: 0,
                  border: `2px solid ${DARK}`,
                  bgcolor: "#E8F5E9",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "#E3A008",
                    transition: "transform 1s cubic-bezier(0.4,0,0.2,1)",
                  },
                }}
              />
            </Box>
          )
        )}
      </Box>

      <Grid
        container
        spacing={2.5}
        sx={{ px: { xs: 3, md: 5 }, pb: 4, maxWidth: 1100, mx: "auto" }}
      >
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<WorkIcon />}
            label="Applications"
            value={applications.length}
            loading={loading}
            delay={0}
            onClick={() => navigate("/applications")}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<BookmarkIcon />}
            label="Saved jobs"
            value={savedJobs.length}
            loading={loading}
            delay={100}
            onClick={() => navigate("/saved-jobs")}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<EventIcon />}
            label="Interviews"
            value={interviews.length}
            loading={loading}
            delay={200}
            onClick={() => navigate("/candidate/interviews")}
          />
        </Grid>
      </Grid>

      <Box sx={{ px: { xs: 3, md: 5 }, pb: 5, maxWidth: 1100, mx: "auto" }}>
        <Typography
          sx={{
            fontSize: "1.1rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.3px",
            color: DARK,
            mb: 2.5,
          }}
        >
          Recommended for you
        </Typography>
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
          ) : recommendedJobs.length > 0 ? (
            recommendedJobs.slice(0, 3).map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job._id}>
                <JobCard job={job} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography sx={{ color: "#2F5A33" }}>
                Add skills to your profile to see recommendations.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>

      {!loading && (
        <Box sx={{ px: { xs: 3, md: 5 }, pb: 6, maxWidth: 1100, mx: "auto" }}>
          <ApplicationStatusCarousel applications={applications} />
        </Box>
      )}
    </Box>
  );
}

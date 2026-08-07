import { useState, useEffect } from "react";
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
import ApplicationStageTracker from "./ApplicationStageTracker";
import useCountUp from "@/hooks/useCountUp";
import { getRecommendedJobs } from "@/features/jobs/api/jobsApi";
import { getMyApplications } from "@/features/applications/api/applicationsApi";
import { getSavedJobs } from "@/features/jobs/api/savedJobsApi";
import { getMyInterviewsAsCandidate } from "@/features/interviews/api/interviewsApi";
import { getMyCandidateProfile } from "../api/candidatesApi";
import LinkWurkButton from "@/components/Button";

const ACTIVE_STATUSES = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview Scheduled",
];

function StatCard({ icon, label, value, loading, delay }) {
  const count = useCountUp(value, { duration: 900, delay });
  if (loading) return <Skeleton variant="rounded" height={90} />;
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 2.5,
        bgcolor: "background.paper",
        display: "flex",
        alignItems: "center",
        gap: 2,
        opacity: 0,
        animation: "fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) forwards",
        animationDelay: `${delay}ms`,
        transition: "border-color 0.25s ease",
        "&:hover": { borderColor: "secondary.main" },
        "&:hover .stat-icon": {
          bgcolor: "secondary.main",
          color: "primary.contrastText",
          transform: "scale(1.08)",
        },
        "@keyframes fadeUp": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <Box
        className="stat-icon"
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          bgcolor: "action.hover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "primary.main",
          transition: "all 0.25s ease",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography
          sx={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: "1.6rem",
            fontWeight: 500,
          }}
        >
          {count}
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

  const activeApplication = applications.find((a) =>
    ACTIVE_STATUSES.includes(a.status),
  );

  return (
    <Box>
      <Box
        sx={{
          px: { xs: 3, md: 5 },
          py: { xs: 6, md: 9 },
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -80,
            left: "15%",
            width: 220,
            height: 220,
            borderRadius: "50%",
            bgcolor: "secondary.main",
            opacity: 0.14,
            filter: "blur(60px)",
            pointerEvents: "none",
            animation: "float1 9s ease-in-out infinite",
            "@keyframes float1": {
              "0%,100%": { transform: "translate(0,0)" },
              "50%": { transform: "translate(30px,-20px)" },
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -90,
            right: "12%",
            width: 260,
            height: 260,
            borderRadius: "50%",
            bgcolor: "primary.main",
            opacity: 0.08,
            filter: "blur(70px)",
            pointerEvents: "none",
            animation: "float2 11s ease-in-out infinite",
            "@keyframes float2": {
              "0%,100%": { transform: "translate(0,0)" },
              "50%": { transform: "translate(-30px,25px)" },
            },
          }}
        />
        <Typography
          variant="h3"
          sx={{ position: "relative", maxWidth: 560, mx: "auto", mb: 1.5 }}
        >
          Where skills meet the right role
        </Typography>
        <Typography color="text.secondary" sx={{ position: "relative", mb: 3 }}>
          Browse open roles matched to your profile.
        </Typography>

        <LinkWurkButton
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/jobs")}
        >
          Browse jobs
        </LinkWurkButton>
      </Box>

      <Box sx={{ px: { xs: 3, md: 5 }, pb: 3, maxWidth: 1100, mx: "auto" }}>
        {loading ? (
          <Skeleton variant="rounded" height={64} />
        ) : (
          profileCompletion < 100 && (
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2.5,
                bgcolor: "background.paper",
              }}
            >
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Profile {profileCompletion}% complete
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate("/candidate/onboarding/skills")}
                >
                  Complete your profile
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={barValue}
                color="secondary"
                sx={{
                  height: 6,
                  borderRadius: 3,
                  "& .MuiLinearProgress-bar": {
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
        spacing={2}
        sx={{ px: { xs: 3, md: 5 }, pb: 4, maxWidth: 1100, mx: "auto" }}
      >
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<WorkIcon />}
            label="Applications"
            value={applications.length}
            loading={loading}
            delay={0}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<BookmarkIcon />}
            label="Saved jobs"
            value={savedJobs.length}
            loading={loading}
            delay={100}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<EventIcon />}
            label="Interviews"
            value={interviews.length}
            loading={loading}
            delay={200}
          />
        </Grid>
      </Grid>

      <Box sx={{ px: { xs: 3, md: 5 }, pb: 5, maxWidth: 1100, mx: "auto" }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ mb: 2, display: "block" }}
        >
          Recommended for you
        </Typography>
        <Grid container spacing={3}>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rounded" height={180} />
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
              <Typography color="text.secondary">
                Add skills to your profile to see recommendations.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>

      {!loading && activeApplication && (
        <Box sx={{ px: { xs: 3, md: 5 }, pb: 6, maxWidth: 1100, mx: "auto" }}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ mb: 2, display: "block" }}
          >
            Continue where you left off
          </Typography>
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 3,
              bgcolor: "background.paper",
            }}
          >
            <Typography sx={{ fontWeight: 600, mb: 2 }}>
              {activeApplication.jobId?.title} —{" "}
              {activeApplication.jobId?.recruiterId?.companyName}
            </Typography>
            <ApplicationStageTracker currentStatus={activeApplication.status} />
          </Box>
        </Box>
      )}
    </Box>
  );
}

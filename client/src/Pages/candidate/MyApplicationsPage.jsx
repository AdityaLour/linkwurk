import { useState, useEffect } from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import ApplicationStageTracker from "@/features/candidates/components/ApplicationStageTracker";
import { getMyApplications } from "@/features/applications/api/applicationsApi";

const DARK = "#14431A";
const GREEN = "#1B5E20";
const BORDER = `3px solid ${DARK}`;

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications()
      .then((res) => setApplications(res.data.applications))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        backgroundImage:
          "radial-gradient(rgba(27,94,32,0.28) 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        minHeight: "100%",
        py: 6,
      }}
    >
      <Box sx={{ maxWidth: 800, mx: "auto", px: 3 }}>
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
          My applications
        </Typography>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={140}
              sx={{ border: BORDER, mb: 2.5 }}
            />
          ))
        ) : applications.length === 0 ? (
          <Typography sx={{ color: "#2F5A33" }}>
            You haven't applied to any jobs yet.
          </Typography>
        ) : (
          applications.map((app) => (
            <Box
              key={app._id}
              sx={{
                border: BORDER,
                boxShadow: `5px 5px 0px ${GREEN}`,
                bgcolor: "#FFFFFF",
                p: 3,
                mb: 2.5,
              }}
            >
              <Typography sx={{ fontWeight: 700, color: DARK, mb: 2 }}>
                {app.jobId?.title} — {app.jobId?.recruiterId?.companyName}
              </Typography>
              <ApplicationStageTracker currentStatus={app.status} />
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}

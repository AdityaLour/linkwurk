import { useState, useEffect } from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import { getMyInterviewsAsCandidate } from "@/features/interviews/api/interviewsApi";

const DARK = "#14431A";
const GREEN = "#1B5E20";
const BORDER = `3px solid ${DARK}`;

export default function CandidateInterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyInterviewsAsCandidate()
      .then((res) => setInterviews(res.data.interviews))
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
          Interviews
        </Typography>
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={90}
              sx={{ border: BORDER, mb: 2.5 }}
            />
          ))
        ) : interviews.length === 0 ? (
          <Typography sx={{ color: "#2F5A33" }}>
            No interviews scheduled yet.
          </Typography>
        ) : (
          interviews.map((interview) => {
            const job = interview.applicationId?.jobId || {};
            return (
              <Box
                key={interview._id}
                sx={{
                  border: BORDER,
                  boxShadow: `5px 5px 0px ${GREEN}`,
                  bgcolor: "#FFFFFF",
                  p: 3,
                  mb: 2.5,
                }}
              >
                <Typography sx={{ fontWeight: 700, color: DARK }}>
                  {job.title}
                  {job.recruiterId?.companyName
                    ? ` — ${job.recruiterId.companyName}`
                    : ""}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: "0.85rem",
                    color: GREEN,
                    mt: 0.5,
                  }}
                >
                  {new Date(interview.scheduledAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.8rem", color: "#7A7267", mt: 0.5 }}
                >
                  Status: {interview.status}
                </Typography>
                {interview.notes && (
                  <Typography
                    sx={{ fontSize: "0.85rem", color: "#2F5A33", mt: 1 }}
                  >
                    {interview.notes}
                  </Typography>
                )}
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Select,
  MenuItem,
  Skeleton,
  Button,
} from "@mui/material";
import {
  getMyInterviews,
  updateInterview,
} from "@/features/interviews/api/interviewsApi";

const BORDER = "3px solid #14431A";
const SHADOW = "5px 5px 0px #1B5E20";
const STATUS_OPTIONS = ["Scheduled", "Completed", "Passed", "Failed"];

export default function InterviewsPage() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInterviews = () => {
    setLoading(true);
    getMyInterviews()
      .then((res) => setInterviews(res.data.interviews))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const handleStatusChange = async (id, status) => {
    await updateInterview(id, { status });
    loadInterviews();
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100%",
        px: { xs: 3, md: 5 },
        py: 6,
      }}
    >
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        <Button
          variant="text"
          sx={{ mb: 2, color: "#14431A", fontWeight: 700 }}
          onClick={() => navigate("/")}
        >
          &larr; Back to dashboard
        </Button>
        <Typography
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 800,
            fontSize: { xs: "1.5rem", md: "1.9rem" },
            color: "#14431A",
            mb: 3,
            textTransform: "uppercase",
          }}
        >
          Interviews
        </Typography>

        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={90}
              sx={{ border: BORDER, mb: 2 }}
            />
          ))
        ) : interviews.length === 0 ? (
          <Typography sx={{ color: "#4C7A4F" }}>
            No interviews scheduled yet.
          </Typography>
        ) : (
          interviews.map((interview) => {
            const application = interview.applicationId || {};
            const candidate = application.candidateId || {};
            const user = candidate.userId || {};
            const job = application.jobId || {};
            return (
              <Card
                key={interview._id}
                elevation={0}
                sx={{
                  border: BORDER,
                  borderRadius: 0,
                  boxShadow: SHADOW,
                  mb: 2.5,
                  bgcolor: "#FFFFFF",
                }}
              >
                <CardContent
                  sx={{
                    p: 2.5,
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: "#14431A" }}>
                      {user.firstName} {user.lastName} &mdash; {job.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: '"IBM Plex Mono", monospace',
                        fontSize: "0.8rem",
                        color: "#4C7A4F",
                        mt: 0.5,
                      }}
                    >
                      {new Date(interview.scheduledAt).toLocaleString()}
                    </Typography>
                    {interview.notes && (
                      <Typography
                        variant="body2"
                        sx={{ color: "#7A7267", mt: 0.5 }}
                      >
                        {interview.notes}
                      </Typography>
                    )}
                  </Box>
                  <Select
                    size="small"
                    value={interview.status}
                    onChange={(e) =>
                      handleStatusChange(interview._id, e.target.value)
                    }
                    sx={{
                      border: "2px solid #14431A",
                      borderRadius: 0,
                      minWidth: 140,
                      fontWeight: 700,
                      fontSize: "0.8rem",
                    }}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </CardContent>
              </Card>
            );
          })
        )}
      </Box>
    </Box>
  );
}

import {
  Card,
  CardActionArea,
  CardContent,
  Box,
  Typography,
  Avatar,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { formatSalary } from "@/lib/formatSalary";

const DARK = "#14431A";
const GREEN = "#1B5E20";
const BORDER = `3px solid ${DARK}`;
const SHADOW = `5px 5px 0px ${GREEN}`;

export default function JobCard({ job }) {
  const navigate = useNavigate();
  const recruiter = job.recruiterId || {};

  return (
    <Card
      elevation={0}
      sx={{
        border: BORDER,
        borderRadius: 0,
        boxShadow: SHADOW,
        bgcolor: "#FFFFFF",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          transform: "translate(-2px, -2px)",
          boxShadow: `7px 7px 0px ${GREEN}`,
        },
      }}
    >
      <CardActionArea onClick={() => navigate(`/jobs/${job._id}`)}>
        <CardContent sx={{ p: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                variant="square"
                src={recruiter.companyLogo}
                sx={{
                  width: 38,
                  height: 38,
                  bgcolor: "#66BB6A",
                  color: DARK,
                  border: `2px solid ${DARK}`,
                  fontWeight: 700,
                }}
              >
                {recruiter.companyName?.[0] || "?"}
              </Avatar>
              <Box>
                <Typography
                  sx={{ fontSize: "0.82rem", fontWeight: 700, color: DARK }}
                >
                  {recruiter.companyName || "Company"}
                </Typography>
                <Typography sx={{ fontSize: "0.72rem", color: "#7A7267" }}>
                  {job.location}
                </Typography>
              </Box>
            </Box>
            {job.matchPercent != null && (
              <Box
                sx={{
                  bgcolor: "#E3A008",
                  color: DARK,
                  border: `2px solid ${DARK}`,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  px: 0.9,
                  py: 0.3,
                  transform: "rotate(4deg)",
                  whiteSpace: "nowrap",
                }}
              >
                {job.matchPercent}% match
              </Box>
            )}
          </Box>

          <Typography
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: "1.05rem",
              color: DARK,
              mb: 1,
            }}
          >
            {job.title}
          </Typography>

          <Typography
            sx={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: "0.82rem",
              fontWeight: 600,
              color: GREEN,
              mb: 1.5,
            }}
          >
            {formatSalary(job.salaryMin, job.salaryMax)}
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {(job.skillsRequired || []).slice(0, 3).map((skill) => (
              <Box
                key={skill}
                sx={{
                  border: `2px solid ${DARK}`,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: DARK,
                  px: 0.9,
                  py: 0.2,
                }}
              >
                {skill}
              </Box>
            ))}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

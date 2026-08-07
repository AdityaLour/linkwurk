import {
  Card,
  CardActionArea,
  CardContent,
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { formatSalary } from "@/lib/formatSalary";

export default function JobCard({ job }) {
  const navigate = useNavigate();
  const recruiter = job.recruiterId || {};

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        transition:
          "transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s ease, border-color 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 24px rgba(27,94,32,0.14)",
          borderColor: "primary.main",
        },
        "&:hover .job-arrow": { opacity: 1, transform: "translateX(0)" },
        "&:hover .job-avatar": { transform: "scale(1.06)" },
      }}
    >
      <CardActionArea onClick={() => navigate(`/jobs/${job._id}`)}>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                className="job-avatar"
                src={recruiter.companyLogo}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "secondary.main",
                  transition: "transform 0.25s ease",
                }}
              >
                {recruiter.companyName?.[0] || "?"}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {recruiter.companyName || "Company"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {job.location}
                </Typography>
              </Box>
            </Box>
            <ArrowForwardIcon
              className="job-arrow"
              sx={{
                fontSize: 18,
                color: "primary.main",
                opacity: 0,
                transform: "translateX(-6px)",
                transition: "opacity 0.25s ease, transform 0.25s ease",
              }}
            />
          </Box>

          <Typography variant="h6" sx={{ mb: 1, fontSize: "1.1rem" }}>
            {job.title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontFamily: '"IBM Plex Mono", monospace',
              color: "success.main",
              mb: 1.5,
            }}
          >
            {formatSalary(job.salaryMin, job.salaryMax)}
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {(job.skillsRequired || []).slice(0, 3).map((skill) => (
              <Chip
                key={skill}
                label={skill}
                size="small"
                variant="outlined"
                sx={{
                  transition: "background-color 0.2s ease",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              />
            ))}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

import {
  Card,
  CardContent,
  Box,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { formatSalary } from "@/lib/formatSalary";

const BORDER = "3px solid #14431A";
const SHADOW = "5px 5px 0px #1B5E20";
const rotations = [-3, 2, -2, 3];

const actionBtnSx = {
  border: "2px solid #14431A",
  borderRadius: 0,
  color: "#14431A",
  fontSize: "0.72rem",
  fontWeight: 700,
  px: 1.4,
  py: 0.6,
  minWidth: "auto",
  transition: "background-color 0.15s ease, color 0.15s ease",
  "&:hover": { bgcolor: "#1B5E20", color: "#FFFFFF" },
};

export default function RecruiterJobCard({ job, index = 0, onToggleStatus }) {
  const navigate = useNavigate();
  const isOpen = job.status === "open";
  const baseRotation = rotations[index % rotations.length];

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
          boxShadow: "7px 7px 0px #1B5E20",
        },
        "&:hover .status-badge": { animation: "badgeJiggle 0.45s ease-in-out" },
        [`@keyframes badgeJiggle`]: {
          "0%, 100%": { transform: `rotate(${baseRotation}deg)` },
          "25%": { transform: `rotate(${baseRotation + 9}deg)` },
          "50%": { transform: `rotate(${baseRotation - 7}deg)` },
          "75%": { transform: `rotate(${baseRotation + 5}deg)` },
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: "1.15rem",
              color: isOpen ? "#14431A" : "#7A7267",
            }}
          >
            {job.title}
          </Typography>
          <Box
            className="status-badge"
            sx={{
              bgcolor: isOpen ? "#3D8361" : "#D8D3C7",
              color: isOpen ? "#FFFFFF" : "#6B6355",
              fontSize: "0.68rem",
              fontWeight: 700,
              textTransform: "uppercase",
              px: 1.1,
              py: 0.35,
              border: "2px solid #14431A",
              transform: `rotate(${baseRotation}deg)`,
              whiteSpace: "nowrap",
              ml: 1,
            }}
          >
            {isOpen ? "Open" : "Closed"}
          </Box>
        </Box>

        <Typography
          sx={{
            fontSize: "0.88rem",
            color: isOpen ? "#2F5A33" : "#7A7267",
            mb: 0.5,
          }}
        >
          {job.location}
        </Typography>
        <Typography
          sx={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: "0.85rem",
            fontWeight: 600,
            color: isOpen ? "#1B5E20" : "#7A7267",
            mb: job.lastApplyDate ? 0.5 : 2,
          }}
        >
          {formatSalary(job.salaryMin, job.salaryMax)}
        </Typography>

        {job.lastApplyDate && (
          <Typography
            sx={{
              fontSize: "0.78rem",
              color: isOpen ? "#7A7267" : "#A9A296",
              mb: 2,
            }}
          >
            Apply by{" "}
            {new Date(job.lastApplyDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Typography>
        )}

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button
            size="small"
            onClick={() => navigate(`/recruiter/jobs/${job._id}/applicants`)}
            sx={actionBtnSx}
          >
            Applicants
          </Button>
          <Button
            size="small"
            onClick={() => navigate(`/recruiter/jobs/${job._id}/edit`)}
            sx={actionBtnSx}
          >
            Edit
          </Button>
          <Button
            size="small"
            onClick={() => onToggleStatus(job._id)}
            sx={actionBtnSx}
          >
            {isOpen ? "Close" : "Reopen"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

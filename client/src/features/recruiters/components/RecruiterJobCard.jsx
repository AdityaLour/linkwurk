import { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Stack,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { formatSalary } from "@/lib/formatSalary";
import { formatExperience } from "@/lib/formatExperience";

const DARK = "#14431A";
const GREEN = "#1B5E20";
const BORDER = `3px solid ${DARK}`;
const SHADOW = `5px 5px 0px ${GREEN}`;
const rotations = [-3, 2, -2, 3];

const actionBtnSx = {
  border: `2px solid ${DARK}`,
  borderRadius: 0,
  color: DARK,
  fontSize: "0.72rem",
  fontWeight: 700,
  px: 1.4,
  py: 0.6,
  minWidth: "auto",
  transition: "background-color 0.15s ease, color 0.15s ease",
  "&:hover": { bgcolor: GREEN, color: "#FFFFFF" },
};

export default function RecruiterJobCard({ job, index = 0, onToggleStatus }) {
  const navigate = useNavigate();
  const [detailOpen, setDetailOpen] = useState(false);
  const isOpen = job.status === "open";
  const baseRotation = rotations[index % rotations.length];

  const stop = (fn) => (e) => {
    e.stopPropagation();
    fn();
  };

  return (
    <>
      <Card
        elevation={0}
        onClick={() => setDetailOpen(true)}
        sx={{
          border: BORDER,
          borderRadius: 0,
          boxShadow: SHADOW,
          bgcolor: "#FFFFFF",
          cursor: "pointer",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          "&:hover": {
            transform: "translate(-2px, -2px)",
            boxShadow: `7px 7px 0px ${GREEN}`,
          },
          "&:hover .status-badge": {
            animation: "badgeJiggle 0.45s ease-in-out",
          },
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
                color: isOpen ? DARK : "#7A7267",
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
                border: `2px solid ${DARK}`,
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
              color: isOpen ? GREEN : "#7A7267",
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
              onClick={stop(() =>
                navigate(`/recruiter/jobs/${job._id}/applicants`),
              )}
              sx={actionBtnSx}
            >
              Applicants
            </Button>
            <Button
              size="small"
              onClick={stop(() => navigate(`/recruiter/jobs/${job._id}/edit`))}
              sx={actionBtnSx}
            >
              Edit
            </Button>
            <Button
              size="small"
              onClick={stop(() => onToggleStatus(job._id))}
              sx={actionBtnSx}
            >
              {isOpen ? "Close" : "Reopen"}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              border: BORDER,
              borderRadius: 0,
              boxShadow: `6px 6px 0px ${GREEN}`,
            },
          },
        }}
      >
        <DialogContent sx={{ p: 3.5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: "1.4rem",
                color: DARK,
              }}
            >
              {job.title}
            </Typography>
            <IconButton
              onClick={() => setDetailOpen(false)}
              size="small"
              sx={{ color: DARK }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Box
              sx={{
                bgcolor: isOpen ? "#3D8361" : "#D8D3C7",
                color: isOpen ? "#FFFFFF" : "#6B6355",
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                px: 1.2,
                py: 0.4,
                border: `2px solid ${DARK}`,
              }}
            >
              {isOpen ? "Open" : "Closed"}
            </Box>
            <Box
              sx={{
                bgcolor: "#E8F5E9",
                color: DARK,
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                px: 1.2,
                py: 0.4,
                border: `2px solid ${DARK}`,
              }}
            >
              {job.applicationType === "external"
                ? "External applications"
                : "On LinkWurk"}
            </Box>
          </Stack>

          <Typography sx={{ color: "#2F5A33", mb: 0.5 }}>
            {job.location}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontWeight: 600,
              color: GREEN,
              mb: 1,
            }}
          >
            {formatSalary(job.salaryMin, job.salaryMax)}
          </Typography>

          <Typography sx={{ fontSize: "0.85rem", color: "#7A7267", mb: 2 }}>
            {formatExperience(job.experienceRequired)} experience &middot;{" "}
            {job.numberOfOpenings || 1} opening...
            {Number(job.numberOfOpenings) !== 1 ? "s" : ""}
            {job.lastApplyDate && (
              <>
                {" "}
                &middot; Apply by{" "}
                {new Date(job.lastApplyDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </>
            )}
          </Typography>

          {job.skillsRequired?.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: DARK,
                  mb: 1,
                }}
              >
                Skills required
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {job.skillsRequired.map((skill) => (
                  <Box
                    key={skill}
                    sx={{
                      border: `2px solid ${DARK}`,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      px: 1,
                      py: 0.3,
                    }}
                  >
                    {skill}
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          <Divider sx={{ borderColor: DARK, borderWidth: "1px", my: 2 }} />

          <Typography
            sx={{
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              color: DARK,
              mb: 1,
            }}
          >
            Description
          </Typography>
          <Typography
            sx={{
              whiteSpace: "pre-wrap",
              color: "#2F5A33",
              fontSize: "0.92rem",
              mb: 2,
            }}
          >
            {job.description}
          </Typography>

          {job.applicationType === "external" && job.externalApplyUrl && (
            <Typography
              sx={{
                fontSize: "0.8rem",
                color: "#7A7267",
                mb: 2,
                wordBreak: "break-all",
              }}
            >
              External URL: {job.externalApplyUrl}
            </Typography>
          )}

          <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
            <Button
              onClick={() => navigate(`/recruiter/jobs/${job._id}/applicants`)}
              sx={{
                border: `2px solid ${DARK}`,
                borderRadius: 0,
                color: DARK,
                fontWeight: 700,
                "&:hover": { bgcolor: GREEN, color: "#FFFFFF" },
              }}
            >
              View applicants
            </Button>
            <Button
              onClick={() => navigate(`/recruiter/jobs/${job._id}/edit`)}
              sx={{
                border: `2px solid ${DARK}`,
                borderRadius: 0,
                color: DARK,
                fontWeight: 700,
                "&:hover": { bgcolor: GREEN, color: "#FFFFFF" },
              }}
            >
              Edit job
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}

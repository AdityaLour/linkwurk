import { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Chip,
  Select,
  MenuItem,
  Stack,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { updateApplicationStatus } from "../api/applicationsApi";

const VALID_TRANSITIONS = {
  Applied: ["Under Review", "Rejected"],
  "Under Review": ["Shortlisted", "Rejected"],
  Shortlisted: ["Interview Scheduled", "Rejected"],
  "Interview Scheduled": ["Selected", "Rejected"],
  Selected: [],
  Rejected: [],
};

export default function ApplicantCard({
  application,
  onStatusChanged,
  onScheduleInterview,
}) {
  const [updating, setUpdating] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const candidate = application.candidateId || {};
  const user = candidate.userId || {};
  const nextOptions = VALID_TRANSITIONS[application.status] || [];

  const handleStatusChange = async (e) => {
    setUpdating(true);
    try {
      await updateApplicationStatus(application._id, e.target.value);
      onStatusChanged();
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <Card
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            onClick={() => setProfileOpen(true)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
              cursor: "pointer",
              width: "fit-content",
            }}
          >
            <Avatar
              src={candidate.profilePicture}
              sx={{ width: 44, height: 44, bgcolor: "secondary.main" }}
            >
              {user.firstName?.[0] || "?"}
            </Avatar>
            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  textDecoration: "underline",
                  textDecorationColor: "transparent",
                  "&:hover": { textDecorationColor: "currentColor" },
                }}
              >
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            sx={{ mb: 2 }}
          >
            {(candidate.skills || []).slice(0, 5).map((skill) => (
              <Chip key={skill} label={skill} size="small" variant="outlined" />
            ))}
          </Stack>
          {candidate.education?.[0] && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {candidate.education[0].degree} —{" "}
              {candidate.education[0].institution}
            </Typography>
          )}
          {candidate.resume?.url && (
            <Button
              size="small"
              variant="text"
              href={candidate.resume.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ mb: 2, display: "block" }}
            >
              View resume
            </Button>
          )}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 1 }}>
            <Chip
              label={application.status}
              size="small"
              color={
                application.status === "Selected"
                  ? "success"
                  : application.status === "Rejected"
                    ? "default"
                    : "secondary"
              }
            />
            {nextOptions.length > 0 && (
              <Select
                size="small"
                value=""
                displayEmpty
                onChange={handleStatusChange}
                disabled={updating}
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="" disabled>
                  Move to...
                </MenuItem>
                {nextOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            )}
          </Box>
          {application.status === "Shortlisted" && (
            <Button
              size="small"
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => onScheduleInterview(application)}
            >
              Schedule interview
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              border: "3px solid #14431A",
              borderRadius: 0,
              boxShadow: "6px 6px 0px #1B5E20",
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                src={candidate.profilePicture}
                sx={{ width: 56, height: 56, border: "2.5px solid #14431A" }}
              >
                {user.firstName?.[0] || "?"}
              </Avatar>
              <Box>
                <Typography
                  sx={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    color: "#14431A",
                  }}
                >
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={() => setProfileOpen(false)}
              size="small"
              sx={{ color: "#14431A" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {candidate.summary && (
            <Typography sx={{ color: "#2F5A33", mb: 2, fontSize: "0.92rem" }}>
              {candidate.summary}
            </Typography>
          )}

          {candidate.skills?.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#14431A",
                  mb: 1,
                }}
              >
                Skills
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {candidate.skills.map((skill) => (
                  <Box
                    key={skill}
                    sx={{
                      border: "2px solid #14431A",
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

          {candidate.education?.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#14431A",
                  mb: 1,
                }}
              >
                Education
              </Typography>
              {candidate.education.map((edu, i) => (
                <Typography
                  key={i}
                  sx={{ fontSize: "0.88rem", color: "#2F5A33", mb: 0.5 }}
                >
                  {edu.degree}
                  {edu.degree && edu.institution ? " — " : ""}
                  {edu.institution}
                  {(edu.startYear || edu.endYear) &&
                    ` (${edu.startYear || "?"}–${edu.endYear || "?"})`}
                </Typography>
              ))}
            </Box>
          )}

          {candidate.certifications?.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#14431A",
                  mb: 1,
                }}
              >
                Certifications
              </Typography>
              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                {candidate.certifications.map((url, i) => (
                  <Box
                    key={i}
                    component="a"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ display: "block", border: "2px solid #14431A" }}
                  >
                    <Box
                      component="img"
                      src={url}
                      alt={`Certification ${i + 1}`}
                      sx={{
                        width: 64,
                        height: 64,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {candidate.resume?.url && (
            <>
              <Divider sx={{ borderColor: "#14431A", my: 2 }} />
              <Button
                href={candidate.resume.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  border: "2px solid #14431A",
                  borderRadius: 0,
                  color: "#14431A",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#1B5E20", color: "#FFFFFF" },
                }}
              >
                View full resume
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

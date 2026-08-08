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
} from "@mui/material";
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
    <Card
      elevation={0}
      sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar
            src={candidate.profilePicture}
            sx={{ width: 44, height: 44, bgcolor: "secondary.main" }}
          >
            {user.firstName?.[0] || "?"}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 600 }}>
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
  );
}

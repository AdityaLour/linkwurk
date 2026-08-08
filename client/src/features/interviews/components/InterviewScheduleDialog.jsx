import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import { scheduleInterview } from "../api/interviewsApi";

export default function InterviewScheduleDialog({
  open,
  application,
  onClose,
  onScheduled,
}) {
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const now = new Date();
  const nowLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  const handleClose = () => {
    setScheduledAt("");
    setNotes("");
    setError("");
    onClose();
  };

  const handleSubmit = async () => {
    setError("");

    if (!scheduledAt) {
      setError("Please select a date and time");
      return;
    }
    if (new Date(scheduledAt) <= now) {
      setError("Interview time must be in the future");
      return;
    }

    setLoading(true);
    try {
      await scheduleInterview(application._id, scheduledAt, notes);
      onScheduled();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to schedule interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
      <DialogTitle
        sx={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 700,
          color: "#14431A",
        }}
      >
        Schedule interview
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && (
            <Alert
              severity="error"
              sx={{ borderRadius: 0, border: "2px solid #14431A" }}
            >
              {error}
            </Alert>
          )}
          <TextField
            label="Date & time"
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: nowLocal }}
            required
            fullWidth
          />
          <TextField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            minRows={2}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{ color: "#14431A", fontWeight: 700 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !scheduledAt}
          sx={{
            bgcolor: "#1B5E20",
            borderRadius: 0,
            fontWeight: 700,
            "&:hover": { bgcolor: "#164d1b" },
          }}
        >
          Schedule
        </Button>
      </DialogActions>
    </Dialog>
  );
}

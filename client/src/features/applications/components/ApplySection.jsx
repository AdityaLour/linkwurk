import { useState, useEffect } from "react";
import { Box, Button, Typography, Alert } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { applyToJob, getMyApplications } from "../api/applicationsApi";

const APPLY_NOTES = {
  internal:
    "By applying, your profile data will be submitted to the recruiter. Make sure your profile is up to date before applying.",
  external: "Applications for this job are accepted on an external website.",
};

export default function ApplySection({ job }) {
  const { user } = useAuth();
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (user?.role === "candidate" && job.applicationType === "internal") {
      getMyApplications()
        .then((res) => {
          const applied = res.data.applications.some(
            (app) => app.jobId?._id === job._id,
          );
          setAlreadyApplied(applied);
        })
        .finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, [job._id, job.applicationType, user]);

  const handleApply = async () => {
    setError("");
    setApplying(true);
    try {
      await applyToJob(job._id);
      setAlreadyApplied(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (job.applicationType === "external") {
    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {APPLY_NOTES.external}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          href={job.externalApplyUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Apply Now
        </Button>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="info">
          Log in as a candidate to apply for this role.
        </Alert>
      </Box>
    );
  }

  if (user.role !== "candidate") {
    return null;
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        {APPLY_NOTES.internal}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleApply}
        disabled={alreadyApplied || applying || checking}
      >
        {alreadyApplied ? "Applied" : applying ? "Applying..." : "Apply Now"}
      </Button>
    </Box>
  );
}

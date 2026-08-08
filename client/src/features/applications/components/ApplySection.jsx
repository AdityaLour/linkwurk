import { useState, useEffect } from "react";
import { Box, Button, Typography, Alert } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { applyToJob, getMyApplications } from "../api/applicationsApi";

const DARK = "#14431A";
const GREEN = "#1B5E20";

const APPLY_NOTES = {
  internal:
    "By applying, your profile data will be submitted to the recruiter. Make sure your profile is up to date before applying.",
  external: "Applications for this job are accepted on an external website.",
};

const brutalistBtnSx = {
  border: `3px solid ${DARK}`,
  borderRadius: 0,
  boxShadow: `5px 5px 0px ${DARK}`,
  bgcolor: GREEN,
  color: "#FFFFFF",
  textTransform: "uppercase",
  fontWeight: 700,
  transition: "transform 0.15s ease, box-shadow 0.15s ease",
  "&:hover": {
    bgcolor: "#164d1b",
    transform: "translate(-2px, -2px)",
    boxShadow: `7px 7px 0px ${DARK}`,
  },
  "&:active": {
    transform: "translate(3px, 3px)",
    boxShadow: `2px 2px 0px ${DARK}`,
  },
  "&.Mui-disabled": {
    bgcolor: "#A9A296",
    color: "#FFFFFF",
    boxShadow: `5px 5px 0px ${DARK}`,
  },
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
        <Typography sx={{ fontSize: "0.85rem", color: "#7A7267", mb: 1.5 }}>
          {APPLY_NOTES.external}
        </Typography>
        <Button
          size="large"
          href={job.externalApplyUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={brutalistBtnSx}
        >
          Apply Now
        </Button>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert
          severity="info"
          sx={{ borderRadius: 0, border: `2px solid ${DARK}` }}
        >
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
      <Typography sx={{ fontSize: "0.85rem", color: "#7A7267", mb: 1.5 }}>
        {APPLY_NOTES.internal}
      </Typography>
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: 0, border: `2px solid ${DARK}` }}
        >
          {error}
        </Alert>
      )}
      <Button
        size="large"
        onClick={handleApply}
        disabled={alreadyApplied || applying || checking}
        sx={brutalistBtnSx}
      >
        {alreadyApplied ? "Applied" : applying ? "Applying..." : "Apply Now"}
      </Button>
    </Box>
  );
}

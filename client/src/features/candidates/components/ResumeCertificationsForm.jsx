import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Stack, Typography } from "@mui/material";
import OnboardingLayout from "@/components/OnboardingLayout";
import { updateMyCandidateProfile } from "../api/candidatesApi";

export default function ResumeCertificationsForm() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState("");
  const [resume, setResume] = useState(null);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const finish = async () => {
    setLoading(true);
    const data = new FormData();
    data.append("summary", summary);
    if (resume) data.append("resume", resume);
    certifications.forEach((file) => data.append("certifications", file));
    try {
      await updateMyCandidateProfile(data);
    } finally {
      setLoading(false);
      navigate("/");
    }
  };

  return (
    <OnboardingLayout
      title="Resume & certifications"
      subtitle="Optional, but recruiters look for these."
      activeStep={1}
      steps={["Skills & education", "Resume & certifications"]}
    >
      <Stack spacing={3}>
        <TextField
          label="Summary"
          multiline
          minRows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          fullWidth
        />

        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Resume (PDF)
          </Typography>
          <Button variant="outlined" component="label">
            Upload resume
            <input
              type="file"
              hidden
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
            />
          </Button>
          {resume && (
            <Typography variant="caption" sx={{ ml: 2 }}>
              {resume.name}
            </Typography>
          )}
        </Box>

        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Certifications (images)
          </Typography>
          <Button variant="outlined" component="label">
            Upload certifications
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={(e) => setCertifications(Array.from(e.target.files))}
            />
          </Button>
          {certifications.length > 0 && (
            <Typography variant="caption" sx={{ ml: 2 }}>
              {certifications.length} file(s) selected
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/candidate/onboarding/skills")}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={finish}
            disabled={loading}
          >
            Finish
          </Button>
          <Button variant="text" onClick={() => navigate("/")}>
            Skip for now
          </Button>
        </Stack>
      </Stack>
    </OnboardingLayout>
  );
}

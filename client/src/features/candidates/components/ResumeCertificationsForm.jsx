import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Stack, Typography } from "@mui/material";
import OnboardingLayout from "@/components/OnboardingLayout";
import {
  updateMyCandidateProfile,
  getMyCandidateProfile,
} from "../api/candidatesApi";

const DARK = "#14431A";
const GREEN = "#1B5E20";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 0,
    bgcolor: "#FFFFFF",
    "& fieldset": { borderWidth: "2px", borderColor: DARK },
    "&:hover fieldset": { borderColor: GREEN },
    "&.Mui-focused fieldset": { borderWidth: "2px", borderColor: GREEN },
  },
  "& .MuiInputLabel-root": { color: DARK, fontWeight: 600 },
};

const primaryBtnSx = {
  border: `2.5px solid ${DARK}`,
  borderRadius: 0,
  bgcolor: GREEN,
  color: "#FFFFFF",
  fontWeight: 700,
  textTransform: "uppercase",
  boxShadow: `5px 5px 0px ${DARK}`,
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
};

const outlineBtnSx = {
  border: `2px solid ${DARK}`,
  borderRadius: 0,
  color: DARK,
  fontWeight: 700,
  textTransform: "uppercase",
  transition: "background-color 0.15s ease, color 0.15s ease",
  "&:hover": { bgcolor: GREEN, color: "#FFFFFF" },
};

export default function ResumeCertificationsForm() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState("");
  const [resume, setResume] = useState(null);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    getMyCandidateProfile()
      .then((res) => setSummary(res.data.candidate.summary || ""))
      .finally(() => setInitialLoading(false));
  }, []);

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

  if (initialLoading) {
    return (
      <OnboardingLayout
        title="Resume & certifications"
        subtitle="Optional, but recruiters look for these."
        activeStep={1}
        steps={["Skills & education", "Resume & certifications"]}
      >
        <Typography sx={{ color: "#2F5A33" }}>
          Loading your profile...
        </Typography>
      </OnboardingLayout>
    );
  }

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
          sx={fieldSx}
        />

        <Box>
          <Typography
            sx={{
              fontSize: "0.78rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.4px",
              color: DARK,
              mb: 1,
            }}
          >
            Resume (PDF)
          </Typography>
          <Button component="label" sx={outlineBtnSx}>
            Upload resume
            <input
              type="file"
              hidden
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
            />
          </Button>
          {resume && (
            <Typography
              sx={{
                fontSize: "0.8rem",
                color: "#2F5A33",
                ml: 2,
                display: "inline",
              }}
            >
              {resume.name}
            </Typography>
          )}
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: "0.78rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.4px",
              color: DARK,
              mb: 1,
            }}
          >
            Certifications (images)
          </Typography>
          <Button component="label" sx={outlineBtnSx}>
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
            <Typography
              sx={{
                fontSize: "0.8rem",
                color: "#2F5A33",
                ml: 2,
                display: "inline",
              }}
            >
              {certifications.length} file(s) selected
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            onClick={() => navigate("/candidate/onboarding/skills")}
            sx={outlineBtnSx}
          >
            Back
          </Button>
          <Button onClick={finish} disabled={loading} sx={primaryBtnSx}>
            Finish
          </Button>
          <Button
            onClick={() => navigate("/")}
            sx={{ color: GREEN, fontWeight: 700, textTransform: "uppercase" }}
          >
            Skip for now
          </Button>
        </Stack>
      </Stack>
    </OnboardingLayout>
  );
}

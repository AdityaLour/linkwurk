import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  IconButton,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import OnboardingLayout from "@/components/OnboardingLayout";
import SkillsAutocomplete from "./SkillsAutocomplete";
import UniversityAutocomplete from "./UniversityAutocomplete";
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

const emptyEducation = {
  institution: "",
  degree: "",
  startYear: "",
  endYear: "",
};

export default function SkillsEducationForm() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([{ ...emptyEducation }]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    getMyCandidateProfile()
      .then((res) => {
        const candidate = res.data.candidate;
        if (candidate.skills?.length) setSkills(candidate.skills);
        if (candidate.education?.length) setEducation(candidate.education);
      })
      .finally(() => setInitialLoading(false));
  }, []);

  const updateEducationField = (index, field, value) => {
    const next = [...education];
    next[index][field] = value;
    setEducation(next);
  };

  const addEducation = () =>
    setEducation([...education, { ...emptyEducation }]);
  const removeEducation = (index) =>
    setEducation(education.filter((_, i) => i !== index));

  const saveAndContinue = async () => {
    setLoading(true);
    const data = new FormData();
    data.append("skills", JSON.stringify(skills));
    data.append(
      "education",
      JSON.stringify(education.filter((e) => e.institution)),
    );
    try {
      await updateMyCandidateProfile(data);
    } finally {
      setLoading(false);
      navigate("/candidate/onboarding/resume");
    }
  };

  if (initialLoading) {
    return (
      <OnboardingLayout
        title="Skills & education"
        subtitle="Helps us match you to the right jobs."
        activeStep={0}
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
      title="Skills & education"
      subtitle="Helps us match you to the right jobs."
      activeStep={0}
      steps={["Skills & education", "Resume & certifications"]}
    >
      <Stack spacing={4}>
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
            Skills
          </Typography>
          <SkillsAutocomplete value={skills} onChange={setSkills} />
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
            Education
          </Typography>
          <Stack spacing={2}>
            {education.map((entry, i) => (
              <Box key={i} sx={{ border: `2.5px solid ${DARK}`, p: 2 }}>
                <Box sx={{ mb: 1.5 }}>
                  <UniversityAutocomplete
                    value={entry.institution}
                    onChange={(value) =>
                      updateEducationField(i, "institution", value)
                    }
                  />
                </Box>
                <Grid container spacing={1.5} alignItems="center">
                  <Grid item xs={12} sm={5}>
                    <TextField
                      label="Degree"
                      fullWidth
                      size="small"
                      value={entry.degree}
                      onChange={(e) =>
                        updateEducationField(i, "degree", e.target.value)
                      }
                      sx={fieldSx}
                    />
                  </Grid>
                  <Grid item xs={5} sm={3}>
                    <TextField
                      label="Start year"
                      fullWidth
                      size="small"
                      type="number"
                      value={entry.startYear}
                      onChange={(e) =>
                        updateEducationField(i, "startYear", e.target.value)
                      }
                      sx={fieldSx}
                    />
                  </Grid>
                  <Grid item xs={5} sm={3}>
                    <TextField
                      label="End year"
                      fullWidth
                      size="small"
                      type="number"
                      value={entry.endYear}
                      onChange={(e) =>
                        updateEducationField(i, "endYear", e.target.value)
                      }
                      sx={fieldSx}
                    />
                  </Grid>
                  <Grid item xs={2} sm={1}>
                    <IconButton
                      onClick={() => removeEducation(i)}
                      disabled={education.length === 1}
                      sx={{
                        border: `2px solid ${DARK}`,
                        borderRadius: 0,
                        color: DARK,
                        "&.Mui-disabled": {
                          borderColor: "#C8DFC9",
                          color: "#C8DFC9",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Stack>
          <Button
            startIcon={<AddIcon />}
            onClick={addEducation}
            sx={{
              mt: 1.5,
              border: `2px solid ${DARK}`,
              borderRadius: 0,
              color: DARK,
              fontWeight: 700,
              transition: "background-color 0.15s ease, color 0.15s ease",
              "&:hover": { bgcolor: GREEN, color: "#FFFFFF" },
            }}
          >
            Add another
          </Button>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            onClick={saveAndContinue}
            disabled={loading}
            sx={primaryBtnSx}
          >
            Save & continue
          </Button>
          <Button
            onClick={() => navigate("/candidate/onboarding/resume")}
            sx={{ color: GREEN, fontWeight: 700, textTransform: "uppercase" }}
          >
            Skip for now
          </Button>
        </Stack>
      </Stack>
    </OnboardingLayout>
  );
}

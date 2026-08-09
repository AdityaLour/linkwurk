import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import OnboardingLayout from "@/components/OnboardingLayout";
import {
  updateMyRecruiterProfile,
  getMyRecruiterProfile,
} from "../api/recruitersApi";

const DARK = "#14431A";
const GREEN = "#1B5E20";
const EMPLOYEE_RANGES = ["1-10", "11-50", "51-200", "201-500", "500+"];

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 0,
    bgcolor: "#FFFFFF",
    "& fieldset": { borderWidth: "2.5px", borderColor: DARK },
    "&:hover fieldset": { borderColor: GREEN },
    "&.Mui-focused fieldset": { borderWidth: "2.5px", borderColor: GREEN },
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

export default function CompanyBasicsForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    numberOfEmployees: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    getMyRecruiterProfile()
      .then((res) => {
        const r = res.data.recruiter;
        setFormData({
          companyName: r.companyName || "",
          website: r.website || "",
          numberOfEmployees: r.numberOfEmployees || "",
        });
      })
      .finally(() => setInitialLoading(false));
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const saveAndContinue = async () => {
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    try {
      await updateMyRecruiterProfile(data);
    } finally {
      setLoading(false);
      navigate("/recruiter/onboarding/branding");
    }
  };

  if (initialLoading) {
    return (
      <OnboardingLayout
        title="Company basics"
        subtitle="Tell candidates who you are."
        activeStep={0}
        steps={["Company basics", "Branding"]}
      >
        <Typography sx={{ color: "#2F5A33" }}>
          Loading your profile...
        </Typography>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout
      title="Company basics"
      subtitle="Tell candidates who you are."
      activeStep={0}
      steps={["Company basics", "Branding"]}
    >
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          saveAndContinue();
        }}
      >
        <Stack spacing={2.5}>
          <TextField
            name="companyName"
            label="Company name"
            value={formData.companyName}
            onChange={handleChange}
            fullWidth
            sx={fieldSx}
          />
          <TextField
            name="website"
            label="Website"
            value={formData.website}
            onChange={handleChange}
            fullWidth
            sx={fieldSx}
          />
          <TextField
            name="numberOfEmployees"
            label="Company size"
            select
            value={formData.numberOfEmployees}
            onChange={handleChange}
            fullWidth
            sx={fieldSx}
          >
            {EMPLOYEE_RANGES.map((range) => (
              <MenuItem key={range} value={range}>
                {range} employees
              </MenuItem>
            ))}
          </TextField>
          <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
            <Button
              onClick={saveAndContinue}
              disabled={loading}
              sx={primaryBtnSx}
            >
              Save & continue
            </Button>
            <Button
              onClick={() => navigate("/recruiter/onboarding/branding")}
              sx={{ color: GREEN, fontWeight: 700, textTransform: "uppercase" }}
            >
              Skip for now
            </Button>
          </Stack>
        </Stack>
      </Box>
    </OnboardingLayout>
  );
}

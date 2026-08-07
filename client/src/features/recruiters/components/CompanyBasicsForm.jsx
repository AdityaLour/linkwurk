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

const EMPLOYEE_RANGES = ["1-10", "11-50", "51-200", "201-500", "500+"];

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
        <Typography color="text.secondary">Loading your profile...</Typography>
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
          />
          <TextField
            name="website"
            label="Website"
            value={formData.website}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="numberOfEmployees"
            label="Company size"
            select
            value={formData.numberOfEmployees}
            onChange={handleChange}
            fullWidth
          >
            {EMPLOYEE_RANGES.map((range) => (
              <MenuItem key={range} value={range}>
                {range} employees
              </MenuItem>
            ))}
          </TextField>
          <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={saveAndContinue}
              disabled={loading}
            >
              Save & continue
            </Button>
            <Button
              variant="text"
              onClick={() => navigate("/recruiter/onboarding/branding")}
            >
              Skip for now
            </Button>
          </Stack>
        </Stack>
      </Box>
    </OnboardingLayout>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Stack } from "@mui/material";
import OnboardingLayout from "@/components/OnboardingLayout";
import ImageUploadField from "@/components/ImageUploadField";
import { updateMyRecruiterProfile } from "../api/recruitersApi";

export default function CompanyBrandingForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ companyTagline: "", address: "" });
  const [profilePicture, setProfilePicture] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const finish = async () => {
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (profilePicture) data.append("profilePicture", profilePicture);
    if (companyLogo) data.append("companyLogo", companyLogo);
    try {
      await updateMyRecruiterProfile(data);
    } finally {
      setLoading(false);
      navigate("/");
    }
  };

  return (
    <OnboardingLayout
      title="Branding"
      subtitle="Add a face to your listings."
      activeStep={1}
      steps={["Company basics", "Branding"]}
    >
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          finish();
        }}
      >
        <Stack spacing={2.5}>
          <TextField
            name="companyTagline"
            label="Company tagline"
            value={formData.companyTagline}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="address"
            label="Address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
          />

          <ImageUploadField
            label="Profile picture"
            file={profilePicture}
            onChange={setProfilePicture}
            shape="circular"
          />

          <ImageUploadField
            label="Company logo"
            file={companyLogo}
            onChange={setCompanyLogo}
            shape="rounded"
          />

          <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/recruiter/onboarding/company-info")}
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
      </Box>
    </OnboardingLayout>
  );
}

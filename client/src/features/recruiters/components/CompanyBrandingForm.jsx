import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Stack, Typography } from "@mui/material";
import OnboardingLayout from "@/components/OnboardingLayout";
import ImageUploadField from "@/components/ImageUploadField";
import {
  updateMyRecruiterProfile,
  getMyRecruiterProfile,
} from "../api/recruitersApi";

const DARK = "#14431A";
const GREEN = "#1B5E20";

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

const outlineBtnSx = {
  border: `2px solid ${DARK}`,
  borderRadius: 0,
  color: DARK,
  fontWeight: 700,
  textTransform: "uppercase",
  transition: "background-color 0.15s ease, color 0.15s ease",
  "&:hover": { bgcolor: GREEN, color: "#FFFFFF" },
};

export default function CompanyBrandingForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ companyTagline: "", address: "" });
  const [profilePicture, setProfilePicture] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    getMyRecruiterProfile()
      .then((res) => {
        const r = res.data.recruiter;
        setFormData({
          companyTagline: r.companyTagline || "",
          address: r.address || "",
        });
      })
      .finally(() => setInitialLoading(false));
  }, []);

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

  if (initialLoading) {
    return (
      <OnboardingLayout
        title="Branding"
        subtitle="Add a face to your listings."
        activeStep={1}
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
            sx={fieldSx}
          />
          <TextField
            name="address"
            label="Address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            sx={fieldSx}
          />
          <ImageUploadField
            label="Profile picture"
            file={profilePicture}
            onChange={setProfilePicture}
          />
          <ImageUploadField
            label="Company logo"
            file={companyLogo}
            onChange={setCompanyLogo}
          />
          <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
            <Button
              onClick={() => navigate("/recruiter/onboarding/company-info")}
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
      </Box>
    </OnboardingLayout>
  );
}

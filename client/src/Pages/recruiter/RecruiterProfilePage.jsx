import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stack,
  Alert,
  Skeleton,
} from "@mui/material";
import ImageUploadField from "@/components/ImageUploadField";
import {
  getMyRecruiterProfile,
  updateMyRecruiterProfile,
} from "@/features/recruiters/api/recruitersApi";

const DARK = "#14431A";
const GREEN = "#1B5E20";
const BORDER = `3px solid ${DARK}`;
const EMPLOYEE_RANGES = ["1-10", "11-50", "51-200", "201-500", "500+"];

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

export default function RecruiterProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    numberOfEmployees: "",
    companyTagline: "",
    address: "",
  });
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [companyLogoUrl, setCompanyLogoUrl] = useState("");
  const [companyLogoFile, setCompanyLogoFile] = useState(null);

  useEffect(() => {
    getMyRecruiterProfile()
      .then((res) => {
        const r = res.data.recruiter;
        setFormData({
          companyName: r.companyName || "",
          website: r.website || "",
          numberOfEmployees: r.numberOfEmployees || "",
          companyTagline: r.companyTagline || "",
          address: r.address || "",
        });
        setProfilePictureUrl(r.profilePicture || "");
        setCompanyLogoUrl(r.companyLogo || "");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (profilePictureFile) data.append("profilePicture", profilePictureFile);
    if (companyLogoFile) data.append("companyLogo", companyLogoFile);

    try {
      const res = await updateMyRecruiterProfile(data);
      const r = res.data.recruiter;
      setProfilePictureUrl(r.profilePicture || "");
      setCompanyLogoUrl(r.companyLogo || "");
      setProfilePictureFile(null);
      setCompanyLogoFile(null);
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const wrapperSx = {
    bgcolor: "background.default",
    backgroundImage:
      "radial-gradient(rgba(27,94,32,0.28) 1.5px, transparent 1.5px)",
    backgroundSize: "24px 24px",
    minHeight: "100vh",
    py: 6,
  };

  if (loading) {
    return (
      <Box sx={wrapperSx}>
        <Box sx={{ maxWidth: 640, mx: "auto", px: 3 }}>
          <Skeleton
            variant="rectangular"
            height={400}
            sx={{ border: BORDER }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={wrapperSx}>
      <Box sx={{ maxWidth: 640, mx: "auto", px: 3 }}>
        <Typography
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 800,
            fontSize: { xs: "1.6rem", md: "2rem" },
            color: DARK,
            textTransform: "uppercase",
            mb: 4,
          }}
        >
          Company profile
        </Typography>

        <Box
          sx={{
            border: BORDER,
            boxShadow: `6px 6px 0px ${GREEN}`,
            bgcolor: "#FFFFFF",
            p: { xs: 3, md: 4 },
          }}
        >
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2, borderRadius: 0, border: `2px solid ${DARK}` }}
            >
              {error}
            </Alert>
          )}
          {saved && (
            <Alert
              severity="success"
              sx={{ mb: 2, borderRadius: 0, border: `2px solid ${DARK}` }}
            >
              Profile updated.
            </Alert>
          )}

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
              file={profilePictureFile}
              existingUrl={profilePictureUrl}
              onChange={setProfilePictureFile}
            />
            <ImageUploadField
              label="Company logo"
              file={companyLogoFile}
              existingUrl={companyLogoUrl}
              onChange={setCompanyLogoFile}
            />

            <Button
              onClick={handleSave}
              disabled={saving}
              sx={{ ...primaryBtnSx, width: "fit-content" }}
            >
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

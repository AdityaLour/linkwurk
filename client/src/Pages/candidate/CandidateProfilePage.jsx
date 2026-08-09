import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Grid,
  IconButton,
  Skeleton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ImageUploadField from "@/components/ImageUploadField";
import StatusBanner from "@/components/StatusBanner";
import SkillsAutocomplete from "@/features/candidates/components/SkillsAutocomplete";
import UniversityAutocomplete from "@/features/candidates/components/UniversityAutocomplete";
import {
  getMyCandidateProfile,
  updateMyCandidateProfile,
} from "@/features/candidates/api/candidatesApi";

const DARK = "#14431A";
const GREEN = "#1B5E20";
const BORDER = `3px solid ${DARK}`;

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

const emptyEducation = {
  institution: "",
  degree: "",
  startYear: "",
  endYear: "",
};

export default function CandidateProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([{ ...emptyEducation }]);
  const [existingResume, setExistingResume] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [existingCertifications, setExistingCertifications] = useState([]);
  const [newCertifications, setNewCertifications] = useState([]);

  useEffect(() => {
    getMyCandidateProfile()
      .then((res) => {
        const c = res.data.candidate;
        setProfilePictureUrl(c.profilePicture || "");
        setSummary(c.summary || "");
        setSkills(c.skills || []);
        setEducation(
          c.education?.length ? c.education : [{ ...emptyEducation }],
        );
        setExistingResume(c.resume?.url ? c.resume : null);
        setExistingCertifications(c.certifications || []);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (saved) {
      const t = setTimeout(() => setSaved(false), 3000);
      return () => clearTimeout(t);
    }
  }, [saved]);

  const updateEducationField = (index, field, value) => {
    const next = [...education];
    next[index][field] = value;
    setEducation(next);
  };
  const addEducation = () =>
    setEducation([...education, { ...emptyEducation }]);
  const removeEducation = (index) =>
    setEducation(education.filter((_, i) => i !== index));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    const data = new FormData();
    data.append("summary", summary);
    data.append("skills", JSON.stringify(skills));
    data.append(
      "education",
      JSON.stringify(education.filter((e) => e.institution)),
    );
    if (profilePictureFile) data.append("profilePicture", profilePictureFile);
    if (resumeFile) data.append("resume", resumeFile);
    newCertifications.forEach((file) => data.append("certifications", file));

    try {
      const res = await updateMyCandidateProfile(data);
      const c = res.data.candidate;
      setProfilePictureUrl(c.profilePicture || "");
      setExistingResume(c.resume?.url ? c.resume : null);
      setExistingCertifications(c.certifications || []);
      setProfilePictureFile(null);
      setResumeFile(null);
      setNewCertifications([]);
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
        <Box sx={{ maxWidth: 720, mx: "auto", px: 3 }}>
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
      <Box sx={{ maxWidth: 720, mx: "auto", px: 3 }}>
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
          My profile
        </Typography>

        <Box
          sx={{
            border: BORDER,
            boxShadow: `6px 6px 0px ${GREEN}`,
            bgcolor: "#FFFFFF",
            p: { xs: 3, md: 4 },
          }}
        >
          {error && <StatusBanner type="error">{error}</StatusBanner>}
          {saved && (
            <StatusBanner type="success">
              Profile updated successfully.
            </StatusBanner>
          )}

          <Stack spacing={3}>
            <ImageUploadField
              label="Profile picture"
              file={profilePictureFile}
              existingUrl={profilePictureUrl}
              onChange={setProfilePictureFile}
            />

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
                sx={{ mt: 1.5, ...outlineBtnSx }}
              >
                Add another
              </Button>
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
                Resume
              </Typography>
              {existingResume && !resumeFile && (
                <Typography
                  sx={{ fontSize: "0.85rem", color: "#2F5A47", mb: 1 }}
                >
                  Current:{" "}
                  <Box
                    component="a"
                    href={existingResume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: GREEN, fontWeight: 700 }}
                  >
                    {existingResume.fileName || "View resume"}
                  </Box>
                </Typography>
              )}
              <Button component="label" sx={outlineBtnSx}>
                {existingResume ? "Replace resume" : "Upload resume"}
                <input
                  type="file"
                  hidden
                  accept=".pdf"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
              </Button>
              {resumeFile && (
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "#2F5A47",
                    ml: 2,
                    display: "inline",
                  }}
                >
                  {resumeFile.name}
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
                Certifications
              </Typography>
              {existingCertifications.length > 0 && (
                <Stack
                  direction="row"
                  spacing={1.5}
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ mb: 1.5 }}
                >
                  {existingCertifications.map((url, i) => (
                    <Box
                      key={i}
                      component="a"
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ display: "block", border: `2px solid ${DARK}` }}
                    >
                      <Box
                        component="img"
                        src={url}
                        alt={`Certification ${i + 1}`}
                        sx={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              )}
              <Button component="label" sx={outlineBtnSx}>
                Add certifications
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    setNewCertifications(Array.from(e.target.files))
                  }
                />
              </Button>
              {newCertifications.length > 0 && (
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "#2F5A47",
                    ml: 2,
                    display: "inline",
                  }}
                >
                  {newCertifications.length} new file(s) selected
                </Typography>
              )}
            </Box>

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

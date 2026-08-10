import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";
import { updateEmail, updatePassword } from "@/features/auth/api/authApi";
import StatusBanner from "./StatusBanner";
import { useAuth } from "@/context/AuthContext";

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

const outlineBtnSx = {
  border: `2px solid ${DARK}`,
  borderRadius: 0,
  color: DARK,
  fontWeight: 700,
  textTransform: "uppercase",
  transition: "background-color 0.15s ease, color 0.15s ease",
  "&:hover": { bgcolor: GREEN, color: "#FFFFFF" },
};

export default function AccountDetailsSection({ email, onEmailUpdated }) {
  const { refreshUser } = useAuth();
  const [emailEditing, setEmailEditing] = useState(false);
  const [passwordEditing, setPasswordEditing] = useState(false);

  const [emailForm, setEmailForm] = useState({
    currentPassword: "",
    newEmail: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (emailError) {
      const t = setTimeout(() => setEmailError(""), 4000);
      return () => clearTimeout(t);
    }
  }, [emailError]);

  useEffect(() => {
    if (passwordError) {
      const t = setTimeout(() => setPasswordError(""), 4000);
      return () => clearTimeout(t);
    }
  }, [passwordError]);

  const maskEmail = (e) => {
    if (!e) return "";
    const [name, domain] = e.split("@");
    if (!domain) return e;
    const visible = name.slice(0, 2);
    return `${visible}${"*".repeat(Math.max(name.length - 2, 3))}@${domain}`;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setSavingEmail(true);
    try {
      const res = await updateEmail(
        emailForm.currentPassword,
        emailForm.newEmail,
      );
      await refreshUser();
      setEmailSaved(true);
      setEmailEditing(false);
      setEmailForm({ currentPassword: "", newEmail: "" });
      onEmailUpdated?.(res.data.email);
      setTimeout(() => setEmailSaved(false), 3000);
    } catch (err) {
      setEmailError(err.response?.data?.message || "Failed to update email");
    } finally {
      setSavingEmail(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    setSavingPassword(true);
    try {
      await updatePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
      );
      setPasswordSaved(true);
      setPasswordEditing(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Failed to update password",
      );
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <Box
      sx={{
        border: `3px solid ${DARK}`,
        boxShadow: `6px 6px 0px ${GREEN}`,
        bgcolor: "#FFFFFF",
        p: { xs: 3, md: 4 },
        mt: 3,
      }}
    >
      <Typography
        sx={{
          fontSize: "0.78rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.4px",
          color: DARK,
          mb: 2.5,
        }}
      >
        Account details
      </Typography>

      {emailSaved && (
        <StatusBanner type="success">Email updated successfully.</StatusBanner>
      )}
      {passwordSaved && (
        <StatusBanner type="success">
          Password updated successfully.
        </StatusBanner>
      )}

      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "0.72rem",
                color: "#7A7267",
                textTransform: "uppercase",
              }}
            >
              Email
            </Typography>
            <Typography
              sx={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: "0.95rem",
                color: DARK,
              }}
            >
              {maskEmail(email)}
            </Typography>
          </Box>
          {!emailEditing && (
            <Box
              onClick={() => setEmailEditing(true)}
              sx={{
                ...outlineBtnSx,
                cursor: "pointer",
                px: 1.2,
                py: 0.5,
                fontSize: "0.72rem",
              }}
            >
              Change email
            </Box>
          )}
        </Box>

        {emailEditing && (
          <Box component="form" onSubmit={handleEmailSubmit} sx={{ mt: 2 }}>
            {emailError && (
              <StatusBanner type="error">{emailError}</StatusBanner>
            )}
            <Stack spacing={2}>
              <TextField
                label="Current password"
                type="password"
                fullWidth
                sx={fieldSx}
                value={emailForm.currentPassword}
                onChange={(e) =>
                  setEmailForm({
                    ...emailForm,
                    currentPassword: e.target.value,
                  })
                }
                required
              />
              <TextField
                label="New email"
                type="email"
                fullWidth
                sx={fieldSx}
                value={emailForm.newEmail}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, newEmail: e.target.value })
                }
                required
              />
              <Stack direction="row" spacing={1.5}>
                <Button
                  type="submit"
                  disabled={savingEmail}
                  sx={{
                    border: `2.5px solid ${DARK}`,
                    borderRadius: 0,
                    bgcolor: GREEN,
                    color: "#FFFFFF",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    boxShadow: `4px 4px 0px ${DARK}`,
                  }}
                >
                  {savingEmail ? "Saving..." : "Save"}
                </Button>
                <Button
                  onClick={() => {
                    setEmailEditing(false);
                    setEmailError("");
                  }}
                  sx={{
                    color: DARK,
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}
      </Box>

      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "0.72rem",
                color: "#7A7267",
                textTransform: "uppercase",
              }}
            >
              Password
            </Typography>
            <Typography
              sx={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: "0.95rem",
                color: DARK,
              }}
            >
              &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
            </Typography>
          </Box>
          {!passwordEditing && (
            <Box
              onClick={() => setPasswordEditing(true)}
              sx={{
                ...outlineBtnSx,
                cursor: "pointer",
                px: 1.2,
                py: 0.5,
                fontSize: "0.72rem",
              }}
            >
              Change password
            </Box>
          )}
        </Box>

        {passwordEditing && (
          <Box component="form" onSubmit={handlePasswordSubmit} sx={{ mt: 2 }}>
            {passwordError && (
              <StatusBanner type="error">{passwordError}</StatusBanner>
            )}
            <Stack spacing={2}>
              <TextField
                label="Current password"
                type="password"
                fullWidth
                sx={fieldSx}
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                required
              />
              <TextField
                label="New password"
                type="password"
                fullWidth
                sx={fieldSx}
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                required
              />
              <TextField
                label="Confirm new password"
                type="password"
                fullWidth
                sx={fieldSx}
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
              <Stack direction="row" spacing={1.5}>
                <Button
                  type="submit"
                  disabled={savingPassword}
                  sx={{
                    border: `2.5px solid ${DARK}`,
                    borderRadius: 0,
                    bgcolor: GREEN,
                    color: "#FFFFFF",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    boxShadow: `4px 4px 0px ${DARK}`,
                  }}
                >
                  {savingPassword ? "Saving..." : "Save"}
                </Button>
                <Button
                  onClick={() => {
                    setPasswordEditing(false);
                    setPasswordError("");
                  }}
                  sx={{
                    color: DARK,
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}

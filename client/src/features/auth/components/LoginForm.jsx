import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import {
  Alert,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import AuthLayout from "@/components/AuthLayout";
import { login, googleAuth } from "../api/authApi";
import { useAuth } from "@/context/AuthContext";

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

export default function LoginForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showDeactivatedMessage = searchParams.get("deactivated") === "true";
  const { refreshUser } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(formData);
      await refreshUser();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    try {
      await googleAuth({ idToken: credentialResponse.credential });
      await refreshUser();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Google login failed");
    }
  };

  return (
    <AuthLayout tagline="Where skills meet the right role.">
      <Typography
        sx={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 700,
          fontSize: "1.3rem",
          color: DARK,
          mb: 1,
        }}
      >
        Welcome back
      </Typography>
      <Typography sx={{ color: "#2F5A33", mb: 3 }}>
        Sign in to continue.
      </Typography>

      {showDeactivatedMessage && (
        <Alert
          severity="warning"
          sx={{ mb: 2, borderRadius: 0, border: `2px solid ${DARK}` }}
        >
          Your account has been deactivated. Contact support if you believe this
          is a mistake.
        </Alert>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: 0, border: `2px solid ${DARK}` }}
        >
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: "100%", maxWidth: { xs: "100%", sm: 360 } }}
      >
        <Stack spacing={2}>
          <TextField
            name="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            sx={fieldSx}
          />
          <TextField
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
            sx={fieldSx}
          />
          <Button
            type="submit"
            disabled={loading}
            sx={{
              border: `2.5px solid ${DARK}`,
              borderRadius: 0,
              bgcolor: GREEN,
              color: "#FFFFFF",
              fontWeight: 700,
              textTransform: "uppercase",
              py: 1.3,
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
            }}
          >
            {loading ? (
              <CircularProgress size={22} sx={{ color: "#FFFFFF" }} />
            ) : (
              "Sign in"
            )}
          </Button>
        </Stack>
      </Box>

      <Divider
        sx={{
          my: 3,
          width: "100%",
          maxWidth: { xs: "100%", sm: 360 },
          borderColor: DARK,
        }}
      >
        or
      </Divider>

      <Box sx={{ width: "100%", maxWidth: { xs: "100%", sm: 360 } }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google login failed")}
        />
      </Box>

      <Typography sx={{ mt: 3, color: DARK }}>
        Don't have an account?{" "}
        <Typography
          component="span"
          sx={{
            color: GREEN,
            fontWeight: 700,
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => navigate("/role-select")}
        >
          Sign up
        </Typography>
      </Typography>
    </AuthLayout>
  );
}

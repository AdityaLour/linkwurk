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
import { signUp, googleAuth } from "../api/authApi";
import { useAuth } from "@/context/AuthContext";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");
  const { refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!role || !["candidate", "recruiter"].includes(role)) {
    return (
      <AuthLayout
        tagline="Your applications, tracked end to end."
        panelType={role}
        panelVariant="signup"
      >
        <Typography sx={{ mb: 2 }}>Please choose a role first.</Typography>
        <Button variant="contained" onClick={() => navigate("/role-select")}>
          Go back
        </Button>
      </AuthLayout>
    );
  }

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signUp({ ...formData, role, authType: "email" });
      await refreshUser();
      navigate(
        role === "recruiter" ? "/recruiter/onboarding/company-info" : "/",
      );
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    try {
      await googleAuth({ idToken: credentialResponse.credential, role });
      await refreshUser();
      navigate(
        role === "recruiter" ? "/recruiter/onboarding/company-info" : "/",
      );
    } catch (err) {
      setError(err.response?.data?.message || "Google sign-up failed");
    }
  };

  return (
    <AuthLayout
      tagline="Your applications, tracked end to end."
      panelType={role}
      panelVariant="signup"
    >
      {" "}
      <Typography variant="h4" sx={{ mb: 1 }}>
        Sign up as {role}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Create your LinkWurk account.
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 360 }}>
        <Stack spacing={2}>
          <TextField
            name="firstName"
            label="First name"
            value={formData.firstName}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="lastName"
            label="Last name"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign up"
            )}
          </Button>
        </Stack>
      </Box>
      <Divider sx={{ my: 3, maxWidth: 360 }}>or</Divider>
      <Box sx={{ maxWidth: 360 }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google sign-up failed")}
        />
      </Box>
      <Typography sx={{ mt: 3 }}>
        Already have an account?{" "}
        <Typography
          component="span"
          color="secondary.main"
          sx={{ cursor: "pointer", fontWeight: 600 }}
          onClick={() => navigate("/login")}
        >
          Login
        </Typography>
      </Typography>
    </AuthLayout>
  );
}

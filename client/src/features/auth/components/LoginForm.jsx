import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function LoginForm() {
  const navigate = useNavigate();
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
      <Typography variant="h4" sx={{ mb: 1 }}>
        Welcome back
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Sign in to continue.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 360 }}>
        <Stack spacing={2}>
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
              "Sign in"
            )}
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ my: 3, maxWidth: 360 }}>or</Divider>

      <Box sx={{ maxWidth: 360 }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google login failed")}
        />
      </Box>

      <Typography sx={{ mt: 3 }}>
        Don't have an account?{" "}
        <Typography
          component="span"
          color="secondary.main"
          sx={{ cursor: "pointer", fontWeight: 600 }}
          onClick={() => navigate("/role-select")}
        >
          Sign up
        </Typography>
      </Typography>
    </AuthLayout>
  );
}

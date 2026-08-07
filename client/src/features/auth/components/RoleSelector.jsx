import { useNavigate } from "react-router-dom";
import { Button, Stack, Typography } from "@mui/material";
import AuthLayout from "@/components/AuthLayout";

export default function RoleSelector() {
  const navigate = useNavigate();

  const selectRole = (role) => {
    navigate(`/signUp?role=${role}`);
  };

  return (
    <AuthLayout tagline="Where skills meet the right role.">
      <Typography variant="h4" sx={{ mb: 1 }}>
        Continue as
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Choose how you'll use LinkWurk.
      </Typography>
      <Stack
        spacing={2}
        sx={{ width: "100%", maxWidth: { xs: "100%", sm: 320 } }}
      >
        {" "}
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => selectRole("candidate")}
        >
          Candidate
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={() => selectRole("recruiter")}
        >
          Recruiter
        </Button>
      </Stack>
    </AuthLayout>
  );
}

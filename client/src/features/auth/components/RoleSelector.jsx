import { useNavigate } from "react-router-dom";
import { Button, Stack, Typography } from "@mui/material";
import AuthLayout from "@/components/AuthLayout";

const DARK = "#14431A";
const GREEN = "#1B5E20";

export default function RoleSelector() {
  const navigate = useNavigate();
  const selectRole = (role) => navigate(`/signUp?role=${role}`);

  const btnBase = {
    border: `2.5px solid ${DARK}`,
    borderRadius: 0,
    fontWeight: 700,
    textTransform: "uppercase",
    fontSize: "0.85rem",
    py: 1.3,
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
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
        Continue as
      </Typography>
      <Typography sx={{ color: "#2F5A33", mb: 4 }}>
        Choose how you'll use LinkWurk.
      </Typography>
      <Stack
        spacing={2}
        sx={{ width: "100%", maxWidth: { xs: "100%", sm: 320 } }}
      >
        <Button
          onClick={() => selectRole("candidate")}
          sx={{
            ...btnBase,
            bgcolor: GREEN,
            color: "#FFFFFF",
            boxShadow: `5px 5px 0px ${DARK}`,
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
          Candidate
        </Button>
        <Button
          onClick={() => selectRole("recruiter")}
          sx={{
            ...btnBase,
            bgcolor: "#FFFFFF",
            color: DARK,
            boxShadow: `5px 5px 0px ${GREEN}`,
            "&:hover": {
              transform: "translate(-2px, -2px)",
              boxShadow: `7px 7px 0px ${GREEN}`,
            },
            "&:active": {
              transform: "translate(3px, 3px)",
              boxShadow: `2px 2px 0px ${GREEN}`,
            },
          }}
        >
          Recruiter
        </Button>
      </Stack>
    </AuthLayout>
  );
}

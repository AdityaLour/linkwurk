import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import AccountDetailsSection from "@/components/AccountDetailsSection";

const DARK = "#14431A";
const GREEN = "#1B5E20";

export default function AdminProfilePage() {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        backgroundImage:
          "radial-gradient(rgba(27,94,32,0.28) 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        minHeight: "100vh",
        py: 6,
      }}
    >
      <Box sx={{ maxWidth: 720, mx: "auto", px: 3 }}>
        <Typography
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 800,
            fontSize: { xs: "1.6rem", md: "2rem" },
            color: DARK,
            textTransform: "uppercase",
            mb: 1,
          }}
        >
          Admin profile
        </Typography>
        <Box
          sx={{
            display: "inline-block",
            border: `2px solid ${DARK}`,
            bgcolor: "#E3A008",
            color: DARK,
            fontSize: "0.68rem",
            fontWeight: 700,
            textTransform: "uppercase",
            px: 1,
            py: 0.3,
            mb: 4,
          }}
        >
          Administrator
        </Box>

        <AccountDetailsSection email={email} onEmailUpdated={setEmail} />

        <Box
          sx={{
            border: `2px dashed #C8DFC9`,
            p: 3,
            mt: 3,
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#7A7267",
              textTransform: "uppercase",
              mb: 0.5,
            }}
          >
            Add new admin
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", color: "#A9A296" }}>
            Coming soon
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { sendVerificationEmail } from "@/features/auth/api/authApi";

const DARK = "#14431A";

export default function EmailVerificationBanner({ isVerified }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  if (isVerified) return null;

  const handleSend = async () => {
    setSending(true);
    try {
      await sendVerificationEmail();
      setSent(true);
      setCooldown(60);
      const interval = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            clearInterval(interval);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } finally {
      setSending(false);
    }
  };

  return (
    <Box
      sx={{
        border: `2.5px solid ${DARK}`,
        bgcolor: "#FCEFC7",
        p: 2,
        mb: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 1.5,
      }}
    >
      <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: DARK }}>
        {sent
          ? "Verification email sent — check your inbox."
          : "Your email is not verified. Some actions are restricted until you verify."}
      </Typography>
      <Button
        onClick={handleSend}
        disabled={sending || cooldown > 0}
        sx={{
          border: `2px solid ${DARK}`,
          borderRadius: 0,
          color: DARK,
          fontWeight: 700,
          fontSize: "0.75rem",
          whiteSpace: "nowrap",
          "&:hover": { bgcolor: DARK, color: "#FFFFFF" },
        }}
      >
        {cooldown > 0
          ? `Resend in ${cooldown}s`
          : sending
            ? "Sending..."
            : sent
              ? "Resend"
              : "Verify email"}
      </Button>
    </Box>
  );
}

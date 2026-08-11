import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { verifyEmail } from "@/features/auth/api/authApi";

const DARK = "#14431A";
const GREEN = "#1B5E20";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("No verification token found in the link.");
      return;
    }
    verifyEmail(token)
      .then(() => {
        setStatus("success");
        setMessage("Your email has been verified.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "This link is invalid or has expired.",
        );
      });
  }, [searchParams]);

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        backgroundImage:
          "radial-gradient(rgba(27,94,32,0.28) 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
      }}
    >
      <Box
        sx={{
          border: `3px solid ${DARK}`,
          boxShadow: `6px 6px 0px ${GREEN}`,
          bgcolor: "#FFFFFF",
          p: 4,
          maxWidth: 420,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 800,
            fontSize: "1.4rem",
            color: DARK,
            mb: 2,
            textTransform: "uppercase",
          }}
        >
          Email verification
        </Typography>
        {status === "loading" && <CircularProgress sx={{ color: GREEN }} />}
        {status !== "loading" && (
          <>
            <Typography
              sx={{
                color: status === "success" ? GREEN : "#D64550",
                fontWeight: 600,
                mb: 3,
              }}
            >
              {message}
            </Typography>
            <Button
              onClick={() => navigate("/profile")}
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
              Go to profile
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}

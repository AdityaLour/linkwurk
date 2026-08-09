import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const DARK = "#14431A";
const GREEN = "#1B5E20";

export default function HomePage() {
  const navigate = useNavigate();
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
        textAlign: "center",
        px: 3,
      }}
    >
      <Box>
        <Typography
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 800,
            fontSize: { xs: "1.8rem", md: "2.4rem" },
            color: DARK,
            maxWidth: 560,
            mx: "auto",
            mb: 1.5,
            textTransform: "uppercase",
          }}
        >
          Where skills meet the right role
        </Typography>
        <Typography sx={{ color: "#2F5A33", mb: 3 }}>
          Browse open roles, or find the right candidate.
        </Typography>
        <Button
          onClick={() => navigate("/jobs")}
          sx={{
            border: `3px solid ${DARK}`,
            borderRadius: 0,
            bgcolor: GREEN,
            color: "#FFFFFF",
            fontWeight: 700,
            textTransform: "uppercase",
            px: 3,
            py: 1.2,
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
          Browse jobs
        </Button>
      </Box>
    </Box>
  );
}

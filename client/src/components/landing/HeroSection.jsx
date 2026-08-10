import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const DARK = "#14431A";
const GREEN = "#1B5E20";

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <Box sx={{ textAlign: "center", py: { xs: 6, md: 9 }, px: 3 }}>
      <Typography
        sx={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 800,
          fontSize: { xs: "1.9rem", md: "2.6rem" },
          color: DARK,
          textTransform: "uppercase",
          maxWidth: 700,
          mx: "auto",
          lineHeight: 1.15,
        }}
      >
        Where skills meet the right role
      </Typography>
      <Typography sx={{ color: "#2F5A33", mt: 2, mb: 4, fontSize: "1rem" }}>
        Browse open roles, or find the right candidate.
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Box
          onClick={() => navigate("/jobs")}
          sx={{
            cursor: "pointer",
            border: `3px solid ${DARK}`,
            bgcolor: GREEN,
            color: "#FFFFFF",
            fontWeight: 700,
            textTransform: "uppercase",
            px: 3,
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
          Find a job
        </Box>
        <Box
          onClick={() => navigate("/role-select")}
          sx={{
            cursor: "pointer",
            border: `3px solid ${DARK}`,
            bgcolor: "#FFFFFF",
            color: DARK,
            fontWeight: 700,
            textTransform: "uppercase",
            px: 3,
            py: 1.3,
            boxShadow: `5px 5px 0px ${GREEN}`,
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
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
          Hire talent
        </Box>
      </Box>
    </Box>
  );
}

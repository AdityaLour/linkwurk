import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const DARK = "#14431A";
const GREEN = "#1B5E20";

const linkSx = {
  cursor: "pointer",
  color: "#C8DFC9",
  fontSize: "0.85rem",
  fontWeight: 600,
  transition: "color 0.15s ease",
  "&:hover": { color: "#FFFFFF" },
};

export default function Footer() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box
      component="footer"
      sx={{ bgcolor: GREEN, borderTop: `3px solid ${DARK}`, mt: "auto" }}
    >
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          px: { xs: 3, md: 5 },
          py: { xs: 4, md: 5 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1.5fr 1fr 1fr 1fr" },
            gap: 4,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 800,
                fontSize: "1.2rem",
                color: "#FFFFFF",
              }}
            >
              LinkWurk
            </Typography>
            <Typography
              sx={{
                color: "#C8DFC9",
                fontSize: "0.82rem",
                mt: 1,
                maxWidth: 240,
              }}
            >
              Where skills meet the right role.
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#8FBF95",
                mb: 1.5,
              }}
            >
              For candidates
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography sx={linkSx} onClick={() => navigate("/jobs")}>
                Browse jobs
              </Typography>
              {!user && (
                <Typography
                  sx={linkSx}
                  onClick={() => navigate("/role-select")}
                >
                  Sign up
                </Typography>
              )}
            </Box>
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#8FBF95",
                mb: 1.5,
              }}
            >
              For recruiters
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {!user && (
                <Typography
                  sx={linkSx}
                  onClick={() => navigate("/role-select")}
                >
                  Post a job
                </Typography>
              )}
              {!user && (
                <Typography
                  sx={linkSx}
                  onClick={() => navigate("/role-select")}
                >
                  Sign up
                </Typography>
              )}
              {user?.role === "recruiter" && (
                <Typography
                  sx={linkSx}
                  onClick={() => navigate("/recruiter/jobs/new")}
                >
                  Post a job
                </Typography>
              )}
            </Box>
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#8FBF95",
                mb: 1.5,
              }}
            >
              Connect
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box
                component="a"
                href="https://github.com/AdityaLour/linkwurk"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  ...linkSx,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                GitHub
              </Box>
              <Box
                component="a"
                href="https://www.linkedin.com/in/aditya-lour-b7439430a"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  ...linkSx,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                LinkedIn
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.15)",
            mt: 4,
            pt: 3,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography sx={{ color: "#8FBF95", fontSize: "0.75rem" }}>
            &copy; {new Date().getFullYear()} LinkWurk. Built solo as part of an
            internship project.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

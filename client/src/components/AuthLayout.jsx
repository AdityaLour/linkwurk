import { Box, Typography } from "@mui/material";
import StageTracker from "./StageTracker";
import RecruiterPanel from "./RecruiterPanel";
import NeutralPanel from "./NeutralPanel";

const DARK = "#14431A";
const GREEN = "#1B5E20";

export default function AuthLayout({
  children,
  tagline,
  panelType,
  panelVariant = "signup",
}) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 4,
          py: 6,
          position: "relative",
          overflow: "hidden",
          bgcolor: "#EFF7EF",
          backgroundImage:
            "radial-gradient(rgba(27,94,32,0.28) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: 400 },
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 800,
              fontSize: "1.8rem",
              color: DARK,
              mb: { xs: 3, md: 5 },
            }}
          >
            LinkWurk
          </Typography>
          {children}
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: GREEN,
          color: "#FFFFFF",
          px: { md: 4, lg: 6 },
          position: "relative",
          overflow: "hidden",
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.12) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            width: "100%",
            maxWidth: 380,
          }}
        >
          {panelType === "recruiter" ? (
            <RecruiterPanel variant={panelVariant} />
          ) : panelType === "candidate" ? (
            <>
              <Typography
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 700,
                  fontSize: "1.4rem",
                  mb: { md: 4, lg: 6 },
                  maxWidth: 360,
                  mx: "auto",
                }}
              >
                {tagline}
              </Typography>
              <StageTracker />
            </>
          ) : (
            <NeutralPanel tagline={tagline} />
          )}
        </Box>
      </Box>
    </Box>
  );
}

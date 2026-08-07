import { Box, Typography } from "@mui/material";
import StageTracker from "./StageTracker";
import RecruiterPanel from "./RecruiterPanel";
import NeutralPanel from "./NeutralPanel";

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
          px: { xs: 3, sm: 4, md: 6 },
          py: { xs: 4, md: 6 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 320,
            height: 320,
            borderRadius: "50%",
            bgcolor: "secondary.main",
            opacity: 0.1,
            filter: "blur(60px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -100,
            left: -100,
            width: 260,
            height: 260,
            borderRadius: "50%",
            bgcolor: "primary.main",
            opacity: 0.06,
            filter: "blur(60px)",
          }}
        />

        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: 380 },
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography variant="h3" sx={{ mb: { xs: 3, md: 5 } }}>
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
          bgcolor: "primary.main",
          color: "primary.contrastText",
          px: { md: 4, lg: 6 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            bgcolor: "#66BB6A",
            opacity: 0.15,
            top: "10%",
            left: "8%",
            filter: "blur(40px)",
            animation: "float1 8s ease-in-out infinite",
            "@keyframes float1": {
              "0%, 100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-24px)" },
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: "50%",
            bgcolor: "#A5D6A7",
            opacity: 0.12,
            bottom: "6%",
            right: "6%",
            filter: "blur(50px)",
            animation: "float2 10s ease-in-out infinite",
            "@keyframes float2": {
              "0%, 100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(24px)" },
            },
          }}
        />

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
                variant="h4"
                sx={{
                  mb: { md: 4, lg: 6 },
                  maxWidth: 360,
                  mx: "auto",
                  opacity: 0,
                  animation:
                    "fadeSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                  "@keyframes fadeSlideIn": {
                    from: { opacity: 0, transform: "translateY(12px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
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

import { Box, Typography, Stepper, Step, StepLabel } from "@mui/material";

const DARK = "#14431A";
const GREEN = "#1B5E20";

export default function OnboardingLayout({
  children,
  title,
  subtitle,
  activeStep,
  steps,
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        backgroundImage:
          "radial-gradient(rgba(27,94,32,0.28) 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        py: { xs: 4, md: 8 },
        px: 3,
      }}
    >
      <Box sx={{ maxWidth: 560, mx: "auto" }}>
        <Typography
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 800,
            fontSize: "1.8rem",
            color: DARK,
            mb: 4,
            textAlign: "center",
          }}
        >
          LinkWurk
        </Typography>

        <Stepper
          activeStep={activeStep}
          sx={{
            mb: 5,
            "& .MuiStepIcon-root": {
              borderRadius: 0,
              border: `2.5px solid ${DARK}`,
              color: "transparent",
              "& .MuiStepIcon-text": { fill: DARK, fontWeight: 700 },
            },
            "& .MuiStepIcon-root.Mui-active": {
              color: GREEN,
              border: `2.5px solid ${DARK}`,
              "& .MuiStepIcon-text": { fill: "#FFFFFF" },
            },
            "& .MuiStepIcon-root.Mui-completed": {
              color: "#3D8361",
              border: `2.5px solid ${DARK}`,
              "& .MuiStepIcon-text": { fill: "#FFFFFF" },
            },
            "& .MuiStepConnector-line": {
              borderColor: DARK,
              borderTopWidth: 2,
            },
            "& .MuiStepLabel-label": {
              fontWeight: 700,
              color: DARK,
              fontSize: "0.85rem",
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box
          sx={{
            p: { xs: 3, md: 5 },
            border: `3px solid ${DARK}`,
            boxShadow: `6px 6px 0px ${GREEN}`,
            bgcolor: "#FFFFFF",
            opacity: 0,
            animation: "fadeUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
            "@keyframes fadeUp": {
              from: { opacity: 0, transform: "translateY(16px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: "1.3rem",
              color: DARK,
              mb: 1,
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography sx={{ color: "#2F5A33", mb: 4 }}>{subtitle}</Typography>
          )}
          {children}
        </Box>
      </Box>
    </Box>
  );
}

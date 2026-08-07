import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from "@mui/material";

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
        py: { xs: 4, md: 8 },
        px: 3,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -140,
          left: "10%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          bgcolor: "secondary.main",
          opacity: 0.25,
          filter: "blur(70px)",
          pointerEvents: "none",
          animation: "float1 9s ease-in-out infinite",
          "@keyframes float1": {
            "0%, 100%": { transform: "translate(0, 0)" },
            "50%": { transform: "translate(40px, -50px)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -160,
          right: "8%",
          width: 340,
          height: 340,
          borderRadius: "50%",
          bgcolor: "primary.main",
          opacity: 0.18,
          filter: "blur(80px)",
          pointerEvents: "none",
          animation: "float2 11s ease-in-out infinite",
          "@keyframes float2": {
            "0%, 100%": { transform: "translate(0, 0)" },
            "50%": { transform: "translate(-45px, 35px)" },
          },
        }}
      />

      <Box sx={{ maxWidth: 560, mx: "auto", position: "relative", zIndex: 1 }}>
        <Typography variant="h3" sx={{ mb: 4, textAlign: "center" }}>
          LinkWurk
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            opacity: 0,
            animation: "fadeUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
            "@keyframes fadeUp": {
              from: { opacity: 0, transform: "translateY(16px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Typography variant="h4" sx={{ mb: 1 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              {subtitle}
            </Typography>
          )}
          {children}
        </Paper>
      </Box>
    </Box>
  );
}

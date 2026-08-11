import { Box } from "@mui/material";
import HeroSection from "@/components/landing/HeroSection";
import PlatformStatsSection from "@/components/landing/PlatformStatsSection";
import OpenRolesSection from "@/components/landing/OpenRolesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import SkillMatchDemoSection from "@/components/landing/SkillMatchDemoSection";
import ApplicationTrackingDemoSection from "@/components/landing/ApplicationTrackingDemoSection";

export default function HomePage() {
  return (
    <Box
      sx={{
        bgcolor: "background.default",
        backgroundImage:
          "radial-gradient(rgba(27,94,32,0.28) 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        minHeight: "100vh",
        animation: "driftDots 40s linear infinite",
        "@keyframes driftDots": {
          from: { backgroundPosition: "0px 0px" },
          to: { backgroundPosition: "480px 480px" },
        },
      }}
    >
      <HeroSection />
      <PlatformStatsSection />
      <OpenRolesSection />
      <Box sx={{ borderTop: "2px dashed #C8DFC9", mx: { xs: 3, md: 5 } }} />
      <HowItWorksSection />
      <Box sx={{ borderTop: "2px dashed #C8DFC9", mx: { xs: 3, md: 5 } }} />
      <SkillMatchDemoSection />
      <ApplicationTrackingDemoSection />
    </Box>
  );
}

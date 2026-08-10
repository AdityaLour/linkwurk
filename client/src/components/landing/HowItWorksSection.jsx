import { Box, Typography } from "@mui/material";
import useScrollRepeat from "@/hooks/useScrollRepeat";

const DARK = "#14431A";

const travelKeyframes = {
  "0%": { top: 0, opacity: 0 },
  "6%": { opacity: 1 },
  "88%": { opacity: 1 },
  "100%": { top: "92%", opacity: 0 },
};
const stampKeyframes = {
  "0%, 82%": { transform: "scale(0) rotate(-8deg)", opacity: 0 },
  "90%": { transform: "scale(1.15) rotate(-4deg)", opacity: 1 },
  "100%": { transform: "scale(1) rotate(-4deg)", opacity: 1 },
};

function Track({
  title,
  steps,
  dotColor,
  stampLabel,
  stampBg,
  stampColor,
  delay = 0,
  isVisible,
}) {
  const playState = isVisible ? "running" : "paused";
  return (
    <Box>
      <Typography
        sx={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 800,
          fontSize: "0.85rem",
          color: DARK,
          textTransform: "uppercase",
          mb: 2,
        }}
      >
        {title}
      </Typography>
      <Box sx={{ position: "relative", pl: 4.5, minHeight: 190 }}>
        <Box
          sx={{
            position: "absolute",
            left: 13,
            top: 6,
            bottom: 36,
            width: 2,
            bgcolor: "#C8DFC9",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: 9,
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: dotColor,
            boxShadow: `0 0 0 2px ${DARK}`,
            animation: "travel 3.6s ease-in-out infinite",
            animationDelay: `${delay}s`,
            animationPlayState: playState,
            "@keyframes travel": travelKeyframes,
          }}
        />
        {steps.map((step, i) => (
          <Box key={i} sx={{ mb: i === steps.length - 1 ? 2 : 2.5 }}>
            <Typography
              sx={{ fontWeight: 700, color: DARK, fontSize: "0.85rem" }}
            >
              {step.title}
            </Typography>
            <Typography sx={{ fontSize: "0.72rem", color: "#7A7267" }}>
              {step.subtitle}
            </Typography>
          </Box>
        ))}
        <Box
          sx={{
            display: "inline-block",
            border: `2.5px solid ${DARK}`,
            bgcolor: stampBg,
            color: stampColor,
            fontWeight: 700,
            fontSize: "0.7rem",
            textTransform: "uppercase",
            px: 1.5,
            py: 0.6,
            animation: "stampPop 3.6s ease-in-out infinite",
            animationDelay: `${delay}s`,
            animationPlayState: playState,
            "@keyframes stampPop": stampKeyframes,
          }}
        >
          {stampLabel}
        </Box>
      </Box>
    </Box>
  );
}

export default function HowItWorksSection() {
  const { ref, isVisible } = useScrollRepeat();

  return (
    <Box
      ref={ref}
      sx={{ px: { xs: 3, md: 5 }, py: 6, maxWidth: 1000, mx: "auto" }}
    >
      <Typography
        sx={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 800,
          fontSize: { xs: "1.5rem", md: "1.8rem" },
          color: DARK,
          textTransform: "uppercase",
          textAlign: "center",
          mb: 0.5,
        }}
      >
        Built for both sides of hiring
      </Typography>
      <Typography
        sx={{
          color: "#2F5A33",
          fontWeight: 700,
          textAlign: "center",
          mb: 4,
          fontSize: "1rem",
        }}
      >
        Same platform, two paths that actually finish.
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 4,
        }}
      >
        <Track
          title="For candidates"
          dotColor="#E3A008"
          stampLabel="Hired"
          stampBg="#3D8361"
          stampColor="#FFFFFF"
          isVisible={isVisible}
          steps={[
            { title: "Sign up", subtitle: "Create your profile in minutes" },
            {
              title: "Build your profile",
              subtitle: "Skills, education, resume",
            },
            {
              title: "Apply with a match score",
              subtitle: "See why every job fits",
            },
          ]}
        />
        <Track
          title="For recruiters"
          dotColor="#3D8361"
          stampLabel="Position filled"
          stampBg="#E3A008"
          stampColor={DARK}
          delay={1.8}
          isVisible={isVisible}
          steps={[
            { title: "Sign up", subtitle: "Set up your company profile" },
            { title: "Post a job", subtitle: "Live preview as you type" },
            {
              title: "Review and shortlist",
              subtitle: "Move candidates stage by stage",
            },
          ]}
        />
      </Box>
    </Box>
  );
}

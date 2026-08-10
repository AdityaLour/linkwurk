import { Box, Typography } from "@mui/material";
import useScrollRepeat from "@/hooks/useScrollRepeat";

const DARK = "#14431A";
const GREEN = "#3D8361";
const GOLD = "#E3A008";

const STAGES = [
  { label: "Applied", time: "12 days ago" },
  { label: "Under review", time: "9 days ago" },
  { label: "Shortlisted", time: "2 days ago" },
];

function TrackerAnimation({ isVisible }) {
  return (
    <>
      {STAGES.map((stage, i) => (
        <Box
          key={stage.label}
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.75,
            mb: 0.5,
            opacity: 0,
            animation: "fadeUp 0.45s ease forwards",
            animationDelay: `${i * 0.5}s`,
            "@keyframes fadeUp": {
              from: { opacity: 0, transform: "translateY(8px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 13,
                height: 13,
                borderRadius: "50%",
                bgcolor: GREEN,
                border: `2px solid ${DARK}`,
              }}
            />
            <Box sx={{ width: 2, height: 34, bgcolor: GREEN }} />
          </Box>
          <Box>
            <Typography
              sx={{ fontWeight: 700, color: DARK, fontSize: "0.82rem" }}
            >
              {stage.label}
            </Typography>
            <Typography
              sx={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: "0.7rem",
                color: "#7A7267",
              }}
            >
              {stage.time}
            </Typography>
          </Box>
        </Box>
      ))}

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1.75,
          opacity: 0,
          animation: "fadeUp 0.45s ease forwards",
          animationDelay: `${STAGES.length * 0.5}s`,
          "@keyframes fadeUp": {
            from: { opacity: 0, transform: "translateY(8px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <Box
          sx={{
            width: 17,
            height: 17,
            borderRadius: "50%",
            bgcolor: GOLD,
            border: `3px solid ${DARK}`,
            flexShrink: 0,
            mt: -0.25,
            animation: "nodePulse 1.4s ease-in-out infinite",
            animationPlayState: isVisible ? "running" : "paused",
            "@keyframes nodePulse": {
              "0%, 100%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.3)" },
            },
          }}
        />
        <Box>
          <Typography sx={{ fontWeight: 700, color: DARK, fontSize: "0.9rem" }}>
            Interview scheduled
          </Typography>
          <Typography
            sx={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: "0.72rem",
              color: "#1B5E20",
              fontWeight: 600,
            }}
          >
            Tomorrow, 10:00 AM &middot; happening now
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export default function ApplicationTrackingDemoSection() {
  const { ref, isVisible, playKey } = useScrollRepeat();

  return (
    <Box
      ref={ref}
      sx={{ px: { xs: 3, md: 5 }, py: 6, maxWidth: 500, mx: "auto" }}
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
        Always know where you stand
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
        No more wondering if a recruiter ever looked.
      </Typography>

      <Typography
        sx={{ fontWeight: 700, color: DARK, fontSize: "0.85rem", mb: 2 }}
      >
        Frontend Developer &mdash; Nimbus Labs
      </Typography>

      <TrackerAnimation key={playKey} isVisible={isVisible} />
    </Box>
  );
}

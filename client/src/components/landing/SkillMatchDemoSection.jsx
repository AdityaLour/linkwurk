import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import useScrollRepeat from "@/hooks/useScrollRepeat";

const DARK = "#14431A";
const GREEN = "#1B5E20";
const GOLD = "#E3A008";

const MATCH_ROWS = ["React", "JavaScript", "CSS", "Git"];
const EXTRA_LEFT = "Node.js";
const EXTRA_RIGHT = "REST APIs";
const DELAYS = [400, 1100, 1800, 2500];

const pillSx = {
  border: `2.5px solid ${DARK}`,
  bgcolor: GOLD,
  color: DARK,
  fontWeight: 700,
  fontSize: "0.72rem",
  px: 1,
  py: 0.6,
  mb: 1.5,
};

const dimPillSx = {
  border: "2px solid #D8D3C7",
  color: "#A9A296",
  fontWeight: 700,
  fontSize: "0.72rem",
  px: 1,
  py: 0.6,
};

function MatchAnimation() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const timers = DELAYS.map((t, i) =>
      setTimeout(
        () => setPercent(Math.round(((i + 1) / DELAYS.length) * 80)),
        t + 200,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <>
      <Typography
        sx={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontWeight: 700,
          fontSize: "2.6rem",
          color: GREEN,
        }}
      >
        {percent}%
      </Typography>
      <Typography
        sx={{
          fontSize: "0.7rem",
          fontWeight: 700,
          textTransform: "uppercase",
          color: "#7A7267",
          mb: 3,
        }}
      >
        match with Frontend Developer
      </Typography>

      {/* Mobile: stacked, no connecting lines — a side-by-side line concept doesn't translate to one column */}
      <Box
        sx={{
          display: { xs: "block", sm: "none" },
          maxWidth: 260,
          mx: "auto",
          textAlign: "left",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.65rem",
            fontWeight: 700,
            textTransform: "uppercase",
            color: "#7A7267",
            mb: 1,
          }}
        >
          Your skills
        </Typography>
        {MATCH_ROWS.map((label) => (
          <Box key={label} sx={{ ...pillSx, width: "100%" }}>
            {label}
          </Box>
        ))}
        <Box sx={{ ...dimPillSx, width: "100%", mb: 2.5 }}>{EXTRA_LEFT}</Box>

        <Typography
          sx={{
            fontSize: "0.65rem",
            fontWeight: 700,
            textTransform: "uppercase",
            color: "#7A7267",
            mb: 1,
          }}
        >
          This job needs
        </Typography>
        {MATCH_ROWS.map((label) => (
          <Box key={label} sx={{ ...pillSx, width: "100%" }}>
            {label}
          </Box>
        ))}
        <Box sx={{ ...dimPillSx, width: "100%" }}>{EXTRA_RIGHT}</Box>
      </Box>

      {/* Tablet/desktop: side-by-side with connecting lines */}
      <Box
        sx={{
          display: { xs: "none", sm: "block" },
          position: "relative",
          maxWidth: 480,
          mx: "auto",
        }}
      >
        <Box
          component="svg"
          width="100%"
          viewBox="0 0 480 220"
          sx={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
        >
          {DELAYS.map((delay, i) => (
            <line
              key={i}
              x1="170"
              y1={32 + i * 44}
              x2="310"
              y2={32 + i * 44}
              pathLength="1"
              stroke={GOLD}
              strokeWidth="2.5"
              style={{
                strokeDasharray: 1,
                strokeDashoffset: 1,
                animation: `drawLine 0.5s ease forwards`,
                animationDelay: `${delay}ms`,
              }}
            />
          ))}
          <style>{`@keyframes drawLine { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }`}</style>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ textAlign: "left" }}>
            <Typography
              sx={{
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#7A7267",
                mb: 1,
              }}
            >
              Your skills
            </Typography>
            {MATCH_ROWS.map((label) => (
              <Box key={label} sx={{ ...pillSx, width: 150 }}>
                {label}
              </Box>
            ))}
            <Box sx={{ ...dimPillSx, width: 150 }}>{EXTRA_LEFT}</Box>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              sx={{
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#7A7267",
                mb: 1,
              }}
            >
              This job needs
            </Typography>
            {MATCH_ROWS.map((label) => (
              <Box key={label} sx={{ ...pillSx, width: 150, ml: "auto" }}>
                {label}
              </Box>
            ))}
            <Box sx={{ ...dimPillSx, width: 150, ml: "auto" }}>
              {EXTRA_RIGHT}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default function SkillMatchDemoSection() {
  const { ref, playKey } = useScrollRepeat();

  return (
    <Box
      ref={ref}
      sx={{
        px: { xs: 3, md: 5 },
        py: 6,
        maxWidth: 700,
        mx: "auto",
        textAlign: "center",
      }}
    >
      <Typography
        sx={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 800,
          fontSize: { xs: "1.4rem", md: "1.8rem" },
          color: DARK,
          textTransform: "uppercase",
          mb: 0.5,
        }}
      >
        See exactly why you match
      </Typography>
      <Typography
        sx={{
          color: "#2F5A33",
          fontWeight: 700,
          mb: 3,
          fontSize: { xs: "0.9rem", md: "1rem" },
        }}
      >
        Every recommendation shows its work.
      </Typography>
      <MatchAnimation key={playKey} />
    </Box>
  );
}

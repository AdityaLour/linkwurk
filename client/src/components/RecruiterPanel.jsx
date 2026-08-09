import { useState, useEffect } from "react";
import { Box, Typography, Avatar, AvatarGroup } from "@mui/material";
import useCountUp from "@/hooks/useCountUp";

const COPY = {
  signup: {
    tagline: "Post once, reach the right candidates.",
    cardLabel: "Backend Developer",
    stat: 12,
    statLabel: "new applications",
  },
  login: {
    tagline: "Your pipeline, right where you left it.",
    cardLabel: "This week",
    stat: 4,
    statLabel: "candidates awaiting review",
  },
};
const INITIAL_DURATION = 2000;
const INITIAL_DELAY = 500;

export default function RecruiterPanel({ variant = "signup" }) {
  const copy = COPY[variant];
  const initialCount = useCountUp(copy.stat, {
    duration: INITIAL_DURATION,
    delay: INITIAL_DELAY,
  });
  const [liveCount, setLiveCount] = useState(null);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    let tickTimeout;
    const startLiveTicks = setTimeout(() => {
      setLiveCount(copy.stat);
      const scheduleNextTick = () => {
        const nextDelay = 3000 + Math.random() * 1000;
        tickTimeout = setTimeout(() => {
          setLiveCount((prev) => prev + 1);
          setBump(true);
          setTimeout(() => setBump(false), 300);
          scheduleNextTick();
        }, nextDelay);
      };
      scheduleNextTick();
    }, INITIAL_DURATION + INITIAL_DELAY);
    return () => {
      clearTimeout(startLiveTicks);
      clearTimeout(tickTimeout);
    };
  }, [copy.stat]);

  const displayCount = liveCount !== null ? liveCount : initialCount;

  return (
    <Box>
      <Typography
        sx={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 700,
          fontSize: "1.4rem",
          mb: 4,
          maxWidth: 360,
          mx: "auto",
          opacity: 0,
          animation: "fadeSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          "@keyframes fadeSlideIn": {
            from: { opacity: 0, transform: "translateY(12px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        {copy.tagline}
      </Typography>
      <Box
        sx={{
          border: "2.5px solid rgba(255,255,255,0.6)",
          p: 3,
          minWidth: 260,
          opacity: 0,
          animation: "fadeSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          animationDelay: "0.2s",
        }}
      >
        <Typography
          sx={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: "0.85rem",
            opacity: 0.8,
            mb: 1,
          }}
        >
          {copy.cardLabel}
        </Typography>
        <Typography
          sx={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: "2rem",
            fontWeight: 700,
            display: "inline-block",
            transform: bump ? "scale(1.15)" : "scale(1)",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {displayCount}
        </Typography>
        <Typography sx={{ opacity: 0.9, mb: 2 }}>{copy.statLabel}</Typography>
        <AvatarGroup
          max={4}
          sx={{
            justifyContent: "flex-start",
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              fontSize: "0.85rem",
              border: "2px solid #1B5E20",
              borderRadius: 0,
            },
          }}
        >
          {["A", "R", "K", "S"].map((letter, i) => (
            <Avatar
              key={letter}
              variant="square"
              sx={{
                bgcolor: i % 2 === 0 ? "#E3A008" : "#FFFFFF",
                color: "#14431A",
                opacity: 0,
                animation:
                  "avatarIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                animationDelay: `${0.7 + i * 0.1}s`,
                "@keyframes avatarIn": {
                  from: { opacity: 0, transform: "translateX(-8px)" },
                  to: { opacity: 1, transform: "translateX(0)" },
                },
              }}
            >
              {letter}
            </Avatar>
          ))}
        </AvatarGroup>
      </Box>
    </Box>
  );
}

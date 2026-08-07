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
        variant="h4"
        sx={{
          mb: 4,
          maxWidth: 360,
          textAlign: "center",
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
          bgcolor: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 2,
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
            opacity: 0.75,
            mb: 1,
          }}
        >
          {copy.cardLabel}
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontSize: "2rem",
            mb: 1,
            display: "inline-block",
            transform: bump ? "scale(1.15)" : "scale(1)",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {displayCount}
        </Typography>
        <Typography sx={{ opacity: 0.85, mb: 2 }}>{copy.statLabel}</Typography>
        <AvatarGroup
          max={4}
          sx={{
            justifyContent: "flex-start",
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              fontSize: "0.85rem",
              border: "2px solid",
              borderColor: "primary.main",
            },
          }}
        >
          {["A", "R", "K", "S"].map((letter, i) => (
            <Avatar
              key={letter}
              sx={{
                bgcolor: i % 2 === 0 ? "#A5D6A7" : "#66BB6A",
                color: i % 2 === 0 ? "#1B5E20" : "#E8F5E9",
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

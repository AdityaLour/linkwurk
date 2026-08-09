import { useState, useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";

const stages = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview Scheduled",
  "Selected",
];
const SEQUENCE = [0, 1, 2];
const STEP_DELAY = 1600;
const HOLD_DELAY = 3200;
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const DOT_BOX = 20;

export default function StageTracker() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let stepIndex = 0;
    let timeoutId;
    const advance = () => {
      stepIndex++;
      if (stepIndex < SEQUENCE.length) {
        setActiveIndex(SEQUENCE[stepIndex]);
        timeoutId = setTimeout(advance, STEP_DELAY);
      } else {
        timeoutId = setTimeout(() => {
          stepIndex = 0;
          setActiveIndex(SEQUENCE[0]);
          timeoutId = setTimeout(advance, STEP_DELAY);
        }, HOLD_DELAY);
      }
    };
    timeoutId = setTimeout(advance, STEP_DELAY);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <Stack spacing={0} sx={{ alignItems: "flex-start", textAlign: "left" }}>
      {stages.map((stage, i) => {
        const isPast = i < activeIndex;
        const isActive = i === activeIndex;
        const isLast = i === stages.length - 1;
        return (
          <Box
            key={stage}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              transition: `all 0.6s ${EASE}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mr: 2,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: DOT_BOX,
                  height: DOT_BOX,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isActive && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: -4,
                      border: "2px solid rgba(255,255,255,0.7)",
                      animation:
                        "pulse 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                      "@keyframes pulse": {
                        "0%": { transform: "scale(0.75)", opacity: 0.7 },
                        "70%": { opacity: 0.15 },
                        "100%": { transform: "scale(1.7)", opacity: 0 },
                      },
                    }}
                  />
                )}
                <Box
                  sx={{
                    width: isActive ? 15 : 11,
                    height: isActive ? 15 : 11,
                    bgcolor: isPast || isActive ? "#FFFFFF" : "transparent",
                    border: "2.5px solid #FFFFFF",
                    transition: `all 0.6s ${EASE}`,
                  }}
                />
              </Box>
              {!isLast && (
                <Box
                  sx={{
                    width: 2,
                    height: 40,
                    bgcolor: "#FFFFFF",
                    opacity: isPast ? 0.9 : 0.35,
                    transition: `all 0.6s ${EASE}`,
                  }}
                />
              )}
            </Box>
            <Typography
              sx={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: "0.95rem",
                fontWeight: isActive ? 700 : 400,
                opacity: isActive ? 1 : 0.7,
                pt: "2px",
                transition: `all 0.6s ${EASE}`,
              }}
            >
              {stage}
            </Typography>
          </Box>
        );
      })}
    </Stack>
  );
}

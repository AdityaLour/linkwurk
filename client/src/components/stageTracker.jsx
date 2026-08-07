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
const DOT_BOX = 20; // fixed container size — never changes, this is what keeps the line still

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
              {/* fixed-size outer box — the line below aligns to THIS, which never resizes */}
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
                      borderRadius: "50%",
                      border: "2px solid #A5D6A7",
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
                {/* the inner dot — THIS is what grows/shrinks, safely, since the outer box stays fixed */}
                <Box
                  sx={{
                    width: isActive ? 16 : 12,
                    height: isActive ? 16 : 12,
                    borderRadius: "50%",
                    bgcolor: isPast || isActive ? "#A5D6A7" : "transparent",
                    border: "2px solid",
                    borderColor: isActive ? "#E8F5E9" : "#66BB6A",
                    transition: `all 0.6s ${EASE}`,
                  }}
                />
              </Box>
              {!isLast && (
                <Box
                  sx={{
                    width: 2,
                    height: 40,
                    bgcolor: isPast ? "#A5D6A7" : "#66BB6A",
                    opacity: isPast ? 1 : 0.4,
                    transition: `all 0.6s ${EASE}`,
                  }}
                />
              )}
            </Box>
            <Typography
              sx={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: "0.95rem",
                fontWeight: isActive ? 600 : 400,
                opacity: isActive ? 1 : 0.75,
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

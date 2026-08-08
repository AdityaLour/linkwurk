import { Box, Typography } from "@mui/material";

const DARK = "#14431A";
const GREEN = "#1B5E20";
const STAGES = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview Scheduled",
  "Selected",
];

export default function ApplicationStageTracker({ currentStatus }) {
  const activeIndex = STAGES.indexOf(currentStatus);

  return (
    <Box>
      {STAGES.map((stage, i) => {
        const isPast = i < activeIndex;
        const isActive = i === activeIndex;
        const isLast = i === STAGES.length - 1;
        return (
          <Box key={stage} sx={{ display: "flex", alignItems: "flex-start" }}>
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
                  width: isActive ? 16 : 12,
                  height: isActive ? 16 : 12,
                  bgcolor: isPast || isActive ? "#3D8361" : "transparent",
                  border: `2.5px solid ${DARK}`,
                }}
              />
              {!isLast && (
                <Box
                  sx={{
                    width: 2,
                    height: 32,
                    bgcolor: isPast ? GREEN : "#C8DFC9",
                  }}
                />
              )}
            </Box>
            <Typography
              sx={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: "0.9rem",
                fontWeight: isActive ? 700 : 400,
                color: isActive ? DARK : "#7A7267",
                pt: "2px",
              }}
            >
              {stage}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

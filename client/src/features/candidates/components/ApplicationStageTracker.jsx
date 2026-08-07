import { Box, Typography } from "@mui/material";

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
                  borderRadius: "50%",
                  bgcolor: isPast || isActive ? "success.main" : "transparent",
                  border: "2px solid",
                  borderColor: isActive ? "primary.main" : "success.main",
                }}
              />
              {!isLast && (
                <Box
                  sx={{
                    width: 2,
                    height: 32,
                    bgcolor: isPast ? "success.main" : "divider",
                  }}
                />
              )}
            </Box>
            <Typography
              sx={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: "0.9rem",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "text.primary" : "text.secondary",
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

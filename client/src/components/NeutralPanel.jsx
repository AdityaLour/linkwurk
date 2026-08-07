import { Box, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";

export default function NeutralPanel({
  tagline = "Where skills meet the right role.",
}) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography
        variant="h4"
        sx={{
          mb: 6,
          maxWidth: 360,
          opacity: 0,
          animation: "fadeSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          "@keyframes fadeSlideIn": {
            from: { opacity: 0, transform: "translateY(12px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        {tagline}
      </Typography>

      <Box sx={{ position: "relative", width: 280, height: 90, mx: "auto" }}>
        <Box
          sx={{
            position: "absolute",
            top: 28,
            left: 40,
            right: 40,
            height: 2,
            bgcolor: "rgba(255,255,255,0.2)",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: 28,
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: "#A5D6A7",
            transform: "translateY(-50%)",
            boxShadow: "0 0 10px 3px rgba(165,214,167,0.7)",
            animation: "travel 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
            "@keyframes travel": {
              "0%": { left: 40, opacity: 0 },
              "12%": { opacity: 1 },
              "88%": { opacity: 1 },
              "100%": { left: "calc(100% - 44px)", opacity: 0 },
            },
          }}
        />

        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 80,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.08)",
              border: "2px solid rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PersonIcon sx={{ fontSize: 28 }} />{" "}
          </Box>
          <Typography
            sx={{
              mt: 1,
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: "0.75rem",
              opacity: 0.8,
            }}
          >
            Candidate
          </Typography>
        </Box>

        {/* recruiter node */}
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 80,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.08)",
              border: "2px solid rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BusinessCenterOutlinedIcon sx={{ fontSize: 26 }} />
          </Box>
          <Typography
            sx={{
              mt: 1,
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: "0.75rem",
              opacity: 0.8,
            }}
          >
            Recruiter
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

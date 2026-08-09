import { Box, Typography } from "@mui/material";

const DARK = "#14431A";

const VARIANTS = {
  success: { bgcolor: "#E3A008", color: DARK },
  error: { bgcolor: "#D64550", color: "#FFFFFF" },
};

export default function StatusBanner({ type = "success", children }) {
  const variant = VARIANTS[type] || VARIANTS.success;
  return (
    <Box
      sx={{
        position: "fixed",
        top: { xs: 76, md: 84 },
        left: "50%",
        zIndex: 1400,
        width: { xs: "calc(100% - 32px)", sm: "auto" },
        maxWidth: 480,
        bgcolor: variant.bgcolor,
        color: variant.color,
        border: `2.5px solid ${DARK}`,
        boxShadow: `4px 4px 0px ${DARK}`,
        px: 2.5,
        py: 1.5,
        animation: "bannerIn 0.3s ease forwards",
        "@keyframes bannerIn": {
          from: { opacity: 0, transform: "translateX(-50%) translateY(-12px)" },
          to: { opacity: 1, transform: "translateX(-50%) translateY(0)" },
        },
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
        {children}
      </Typography>
    </Box>
  );
}

import { Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function LinkWurkButton({
  children,
  showArrow = true,
  sx,
  ...props
}) {
  return (
    <Button
      {...props}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        "& .arrow-icon": {
          width: 0,
          opacity: 0,
          overflow: "hidden",
          marginLeft: 0,
          transition:
            "width 0.3s ease, opacity 0.3s ease, margin-left 0.3s ease",
        },
        "&:hover .arrow-icon": showArrow
          ? { width: "24px", opacity: 1, marginLeft: "10px" }
          : {},
        ...sx,
      }}
    >
      {children}
      {showArrow && (
        <ArrowForwardIcon className="arrow-icon" sx={{ fontSize: 24 }} />
      )}
    </Button>
  );
}

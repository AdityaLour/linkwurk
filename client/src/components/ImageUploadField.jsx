import { useState, useEffect } from "react";
import { Box, Button, Typography, Avatar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DARK = "#14431A";
const GREEN = "#1B5E20";

export default function ImageUploadField({ label, file, onChange }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <Box>
      <Typography
        sx={{
          fontSize: "0.78rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.4px",
          color: DARK,
          mb: 1,
        }}
      >
        {label}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {previewUrl ? (
          <Box sx={{ position: "relative" }}>
            <Avatar
              variant="square"
              src={previewUrl}
              sx={{ width: 72, height: 72, border: `2.5px solid ${DARK}` }}
            />
            <IconButton
              size="small"
              onClick={() => onChange(null)}
              sx={{
                position: "absolute",
                top: -10,
                right: -10,
                bgcolor: "#FFFFFF",
                border: `2px solid ${DARK}`,
                borderRadius: 0,
                width: 24,
                height: 24,
                "&:hover": { bgcolor: "#E8F5E9" },
              }}
            >
              <CloseIcon sx={{ fontSize: 14, color: DARK }} />
            </IconButton>
          </Box>
        ) : (
          <Avatar
            variant="square"
            sx={{
              width: 72,
              height: 72,
              bgcolor: "#E8F5E9",
              border: `2.5px solid ${DARK}`,
            }}
          />
        )}
        <Button
          component="label"
          size="small"
          sx={{
            border: `2px solid ${DARK}`,
            borderRadius: 0,
            color: DARK,
            fontWeight: 700,
            transition: "background-color 0.15s ease, color 0.15s ease",
            "&:hover": { bgcolor: GREEN, color: "#FFFFFF" },
          }}
        >
          {file ? "Change" : "Upload"}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => onChange(e.target.files[0])}
          />
        </Button>
      </Box>
    </Box>
  );
}

import { useState, useEffect } from "react";
import { Box, Button, Typography, Avatar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

export default function ImageUploadField({
  label,
  file,
  onChange,
  shape = "circular",
}) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url); // cleanup — prevents a memory leak if the user swaps images repeatedly
  }, [file]);

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {previewUrl ? (
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={previewUrl}
              variant={shape === "circular" ? "circular" : "rounded"}
              sx={{ width: 72, height: 72 }}
            />
            <IconButton
              size="small"
              onClick={() => onChange(null)}
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                width: 22,
                height: 22,
                "&:hover": { bgcolor: "background.paper" },
              }}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        ) : (
          <Avatar
            variant={shape === "circular" ? "circular" : "rounded"}
            sx={{ width: 72, height: 72, bgcolor: "action.hover" }}
          />
        )}

        <Button variant="outlined" component="label" size="small">
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

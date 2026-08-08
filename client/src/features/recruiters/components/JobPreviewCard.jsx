import { Box, Typography, Stack, Chip } from "@mui/material";
import { formatSalary } from "@/lib/formatSalary";

const BORDER = "3px solid #14431A";
const SHADOW = "6px 6px 0px #1B5E20";

export default function JobPreviewCard({ formData }) {
  const hasTitle = formData.title?.trim();
  const salaryText = formData.isUnpaid
    ? "Unpaid"
    : formatSalary(formData.salaryMin, formData.salaryMax);

  return (
    <Box sx={{ position: { md: "sticky" }, top: { md: 24 } }}>
      <Typography
        sx={{
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.4px",
          color: "#14431A",
          mb: 1.5,
        }}
      >
        Live preview
      </Typography>

      <Box
        sx={{
          border: BORDER,
          boxShadow: SHADOW,
          bgcolor: "#FFFFFF",
          p: 2.5,
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -12,
            right: -10,
            bgcolor: "#E3A008",
            color: "#14431A",
            border: "2px solid #14431A",
            fontSize: "0.65rem",
            fontWeight: 700,
            textTransform: "uppercase",
            px: 1,
            py: 0.3,
            transform: "rotate(6deg)",
          }}
        >
          Preview
        </Box>

        <Typography
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: "1.15rem",
            color: hasTitle ? "#14431A" : "#A9A296",
            mb: 1,
          }}
        >
          {hasTitle || "Untitled position"}
        </Typography>

        <Typography sx={{ fontSize: "0.88rem", color: "#2F5A33", mb: 0.5 }}>
          {formData.location?.trim() || "Location not set"}
        </Typography>

        <Typography
          sx={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#1B5E20",
            mb: 1.5,
          }}
        >
          {salaryText}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          sx={{ mb: 1.5 }}
        >
          {(formData.skillsRequired || []).slice(0, 4).map((skill) => (
            <Chip
              key={skill}
              label={skill}
              size="small"
              sx={{
                borderRadius: 0,
                border: "2px solid #14431A",
                bgcolor: "transparent",
                fontWeight: 600,
              }}
            />
          ))}
        </Stack>

        <Typography
          sx={{
            fontSize: "0.78rem",
            color: "#7A7267",
            mb: formData.lastApplyDate ? 0.5 : 0,
          }}
        >
          {formData.experienceRequired} experience &middot;{" "}
          {formData.numberOfOpenings || 1} opening
          {Number(formData.numberOfOpenings) !== 1 ? "s" : ""}
        </Typography>

        {formData.lastApplyDate && (
          <Typography sx={{ fontSize: "0.78rem", color: "#7A7267" }}>
            Apply by{" "}
            {new Date(formData.lastApplyDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

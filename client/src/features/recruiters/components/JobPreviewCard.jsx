import { Box, Typography } from "@mui/material";
import { formatSalary } from "@/lib/formatSalary";
import { formatExperience } from "@/lib/formatExperience";

const DARK = "#14431A";
const GREEN = "#1B5E20";
const BORDER = `3px solid ${DARK}`;
const SHADOW = `6px 6px 0px ${GREEN}`;

export default function JobPreviewCard({ formData }) {
  const hasTitle = formData.title?.trim();
  const salaryText = formData.isUnpaid
    ? "Unpaid"
    : formatSalary(formData.salaryMin, formData.salaryMax);

  return (
    <Box sx={{ position: { md: "sticky" }, top: { md: 24 }, pt: 1.5, pr: 1.5 }}>
      <Typography
        sx={{
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.4px",
          color: DARK,
          mb: 1.5,
        }}
      >
        Live preview
      </Typography>

      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            top: -12,
            right: -10,
            zIndex: 2,
            bgcolor: "#E3A008",
            color: DARK,
            border: `2px solid ${DARK}`,
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

        <Box
          sx={{ border: BORDER, boxShadow: SHADOW, bgcolor: "#FFFFFF", p: 2.5 }}
        >
          <Typography
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: "1.15rem",
              color: hasTitle ? DARK : "#A9A296",
              mb: 1,
              wordBreak: "break-word",
            }}
          >
            {hasTitle || "Untitled position"}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 0.5,
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.88rem",
                color: "#2F5A33",
                wordBreak: "break-word",
              }}
            >
              {formData.location?.trim() || "Location not set"}
            </Typography>
            {formData.isRemote && (
              <Box
                sx={{
                  border: `2px solid ${DARK}`,
                  bgcolor: "#E8F5E9",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: DARK,
                  px: 0.7,
                  py: 0.15,
                }}
              >
                Remote
              </Box>
            )}
          </Box>

          <Typography
            sx={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: "0.85rem",
              fontWeight: 600,
              color: GREEN,
              mb: 1.5,
            }}
          >
            {salaryText}
          </Typography>

          <Box sx={{ display: "flex", gap: 1.2, mb: 1.5 }}>
            <Box
              sx={{ flex: 1, minWidth: 0, border: `2px solid ${DARK}`, p: 1 }}
            >
              <Typography
                sx={{
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#7A7267",
                }}
              >
                Experience
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: DARK,
                }}
              >
                {formatExperience(formData.experienceRequired)}
              </Typography>
            </Box>
            <Box
              sx={{ flex: 1, minWidth: 0, border: `2px solid ${DARK}`, p: 1 }}
            >
              <Typography
                sx={{
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#7A7267",
                }}
              >
                Openings
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: DARK,
                }}
              >
                {formData.numberOfOpenings || 1}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: formData.lastApplyDate ? 1.5 : 0 }}>
            <Typography
              sx={{
                fontSize: "0.62rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#7A7267",
                mb: 0.8,
              }}
            >
              Skills
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {(formData.skillsRequired || []).length === 0 ? (
                <Typography sx={{ fontSize: "0.8rem", color: "#A9A296" }}>
                  No skills added yet
                </Typography>
              ) : (
                formData.skillsRequired.map((skill) => (
                  <Box
                    key={skill}
                    sx={{
                      flexShrink: 0,
                      border: `2px solid ${DARK}`,
                      fontWeight: 600,
                      fontSize: "0.72rem",
                      color: DARK,
                      px: 0.9,
                      py: 0.3,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {skill}
                  </Box>
                ))
              )}
            </Box>
          </Box>

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
    </Box>
  );
}

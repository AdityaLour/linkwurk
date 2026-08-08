import { TextField, MenuItem, Typography, Box } from "@mui/material";
import SkillsAutocomplete from "@/features/candidates/components/SkillsAutocomplete";

const DARK = "#14431A";
const EXPERIENCE_OPTIONS = ["Fresher", "0-1", "1-3", "3-5", "5-10", "10+"];

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 0,
    bgcolor: "#FFFFFF",
    "& fieldset": { borderWidth: "2px", borderColor: DARK },
    "&:hover fieldset": { borderColor: "#1B5E20" },
  },
  "& .MuiInputLabel-root": {
    color: DARK,
    fontWeight: 600,
    fontSize: "0.85rem",
  },
};

export default function JobFilters({ filters, onChange }) {
  return (
    <Box
      sx={{
        border: `3px solid ${DARK}`,
        boxShadow: "4px 4px 0px #1B5E20",
        bgcolor: "#FFFFFF",
        p: 2.5,
      }}
    >
      <Typography
        sx={{
          fontSize: "0.8rem",
          fontWeight: 700,
          textTransform: "uppercase",
          color: DARK,
          mb: 2,
        }}
      >
        Filters
      </Typography>

      <TextField
        label="Location"
        value={filters.location}
        onChange={(e) => onChange({ ...filters, location: e.target.value })}
        fullWidth
        size="small"
        sx={{ ...fieldSx, mb: 2.5 }}
      />

      <TextField
        label="Experience"
        select
        value={filters.experienceRequired}
        onChange={(e) =>
          onChange({ ...filters, experienceRequired: e.target.value })
        }
        fullWidth
        size="small"
        sx={{ ...fieldSx, mb: 2.5 }}
      >
        <MenuItem value="">Any</MenuItem>
        {EXPERIENCE_OPTIONS.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Minimum salary"
        type="number"
        value={filters.salaryMin}
        onChange={(e) => onChange({ ...filters, salaryMin: e.target.value })}
        fullWidth
        size="small"
        placeholder="e.g. 500000"
        sx={{ ...fieldSx, mb: 2.5 }}
      />

      <Typography
        sx={{ fontSize: "0.75rem", fontWeight: 700, color: DARK, mb: 1 }}
      >
        Skills
      </Typography>
      <SkillsAutocomplete
        value={filters.skills}
        onChange={(newValue) => onChange({ ...filters, skills: newValue })}
      />
    </Box>
  );
}

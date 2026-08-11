import {
  TextField,
  MenuItem,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import SkillsAutocomplete from "@/features/candidates/components/SkillsAutocomplete";
import SearchField from "@/components/SearchField";
import { formatExperience } from "@/lib/formatExperience";

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

export default function JobFilters({
  filters,
  onChange,
  hideSearch,
  hideHeading,
}) {
  return (
    <Box
      sx={{
        border: `3px solid ${DARK}`,
        boxShadow: "4px 4px 0px #1B5E20",
        bgcolor: "#FFFFFF",
        p: 2.5,
      }}
    >
      {!hideHeading && (
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
      )}

      {!hideSearch && (
        <Box sx={{ mb: 2.5 }}>
          <SearchField
            value={filters.search || ""}
            onChange={(v) => onChange({ ...filters, search: v })}
            placeholder="Search jobs..."
          />
        </Box>
      )}

      <TextField
        label="Location"
        value={filters.location}
        onChange={(e) => onChange({ ...filters, location: e.target.value })}
        fullWidth
        size="small"
        disabled={filters.isRemote}
        sx={{ ...fieldSx, mb: 1 }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={!!filters.isRemote}
            onChange={(e) =>
              onChange({ ...filters, isRemote: e.target.checked })
            }
            size="small"
            sx={{ color: DARK, "&.Mui-checked": { color: "#1B5E20" } }}
          />
        }
        label={
          <Typography
            sx={{ fontSize: "0.85rem", fontWeight: 600, color: DARK }}
          >
            Remote only
          </Typography>
        }
        sx={{ mb: 2 }}
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
            {formatExperience(opt)}
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

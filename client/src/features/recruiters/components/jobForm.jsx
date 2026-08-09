import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Stack,
  MenuItem,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Alert,
} from "@mui/material";
import { createJob, updateJob, getJobById } from "@/features/jobs/api/jobsApi";
import SkillsAutocomplete from "@/features/candidates/components/SkillsAutocomplete";
import { formatExperience } from "@/lib/formatExperience";

const EXPERIENCE_OPTIONS = ["Fresher", "0-1", "1-3", "3-5", "5-10", "10+"];
const DESCRIPTION_LIMIT = 2000;
const BORDER = "3px solid #14431A";

const emptyForm = {
  title: "",
  location: "",
  isRemote: false,
  salaryMin: "",
  salaryMax: "",
  skillsRequired: [],
  experienceRequired: "Fresher",
  description: "",
  numberOfOpenings: 1,
  lastApplyDate: "",
  applicationType: "internal",
  externalApplyUrl: "",
  isUnpaid: false,
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 0,
    bgcolor: "#FFFFFF",
    "& fieldset": { borderWidth: "2.5px", borderColor: "#14431A" },
    "&:hover fieldset": { borderColor: "#1B5E20" },
    "&.Mui-focused fieldset": { borderWidth: "2.5px", borderColor: "#1B5E20" },
  },
  "& .MuiInputLabel-root": { color: "#14431A", fontWeight: 600 },
  "& .MuiFormHelperText-root": { fontWeight: 500 },
};

const noAutofillHighlight = {
  "& input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 1000px #FFFFFF inset",
    WebkitTextFillColor: "#14431A",
  },
};

const dateVisibilitySx = {
  '& input[data-has-value="false"]::-webkit-datetime-edit-text': {
    color: "transparent",
  },
  '& input[data-has-value="false"]::-webkit-datetime-edit-month-field': {
    color: "transparent",
  },
  '& input[data-has-value="false"]::-webkit-datetime-edit-day-field': {
    color: "transparent",
  },
  '& input[data-has-value="false"]::-webkit-datetime-edit-year-field': {
    color: "transparent",
  },
  '& input[data-has-value="false"]:focus::-webkit-datetime-edit-month-field': {
    color: "#14431A",
  },
  '& input[data-has-value="false"]:focus::-webkit-datetime-edit-day-field': {
    color: "#14431A",
  },
  '& input[data-has-value="false"]:focus::-webkit-datetime-edit-year-field': {
    color: "#14431A",
  },
  '& input[data-has-value="false"]:focus::-webkit-datetime-edit-text': {
    color: "#14431A",
  },
};

const sectionLabelSx = {
  fontSize: "0.78rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.4px",
  color: "#14431A",
  mb: 1,
};

const brutalistButtonSx = {
  border: BORDER,
  borderRadius: 0,
  boxShadow: "5px 5px 0px #14431A",
  bgcolor: "#1B5E20",
  color: "#FFFFFF",
  textTransform: "uppercase",
  fontWeight: 700,
  transition: "transform 0.15s ease, box-shadow 0.15s ease",
  "&:hover": {
    bgcolor: "#164d1b",
    transform: "translate(-2px, -2px)",
    boxShadow: "7px 7px 0px #14431A",
  },
  "&:active": {
    transform: "translate(3px, 3px)",
    boxShadow: "2px 2px 0px #14431A",
  },
  "&.Mui-disabled": {
    bgcolor: "#A9A296",
    color: "#FFFFFF",
    boxShadow: "5px 5px 0px #14431A",
  },
};

export default function JobForm({ jobId, onFormDataChange }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!jobId);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (jobId) {
      getJobById(jobId)
        .then((res) => {
          const j = res.data.job;
          setFormData({
            title: j.title || "",
            location: j.isRemote ? "" : j.location || "",
            isRemote: j.isRemote || false,
            salaryMin: j.salaryMin ?? "",
            salaryMax: j.salaryMax === 0 ? "" : (j.salaryMax ?? ""),
            skillsRequired: j.skillsRequired || [],
            experienceRequired: j.experienceRequired || "Fresher",
            description: j.description || "",
            numberOfOpenings: j.numberOfOpenings || 1,
            lastApplyDate: j.lastApplyDate ? j.lastApplyDate.slice(0, 10) : "",
            applicationType: j.applicationType || "internal",
            externalApplyUrl: j.externalApplyUrl || "",
            isUnpaid: j.salaryMax === 0,
          });
        })
        .finally(() => setInitialLoading(false));
    }
  }, [jobId]);

  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange(formData);
    }
  }, [formData, onFormDataChange]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleOpeningsChange = (e) => {
    const val = e.target.value;
    if (val === "" || Number(val) >= 1) {
      setFormData({ ...formData, numberOfOpenings: val });
    }
  };

  const handleDescriptionChange = (e) => {
    const val = e.target.value.slice(0, DESCRIPTION_LIMIT);
    setFormData({ ...formData, description: val });
  };

  const isPastDate = formData.lastApplyDate && formData.lastApplyDate < today;
  const isDescriptionOverLimit =
    formData.description.length > DESCRIPTION_LIMIT;
  const isSalaryRangeInvalid =
    !formData.isUnpaid &&
    formData.salaryMin !== "" &&
    formData.salaryMax !== "" &&
    Number(formData.salaryMax) <= Number(formData.salaryMin);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.isRemote && !formData.location.trim()) {
      setError("Please enter a location, or mark this as a remote position");
      return;
    }
    if (!formData.numberOfOpenings || Number(formData.numberOfOpenings) < 1) {
      setError("Number of openings must be at least 1");
      return;
    }
    if (isPastDate) {
      setError("Application deadline cannot be in the past");
      return;
    }
    if (isDescriptionOverLimit) {
      setError("Job description is too long");
      return;
    }
    if (!formData.isUnpaid) {
      if (formData.salaryMin === "" || formData.salaryMax === "") {
        setError(
          "Please enter both minimum and maximum salary, or mark this as unpaid",
        );
        return;
      }
      if (Number(formData.salaryMax) <= Number(formData.salaryMin)) {
        setError("Maximum salary must be greater than minimum salary");
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        location: formData.isRemote ? "Remote" : formData.location,
        salaryMin: formData.isUnpaid ? 0 : Number(formData.salaryMin),
        salaryMax: formData.isUnpaid ? 0 : Number(formData.salaryMax),
        numberOfOpenings: Number(formData.numberOfOpenings) || 1,
        lastApplyDate: formData.lastApplyDate || null,
      };
      delete payload.isUnpaid;
      if (jobId) await updateJob(jobId, payload);
      else await createJob(payload);
      navigate("/recruiter/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save job");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading)
    return <Typography sx={{ color: "#2F5A33" }}>Loading job...</Typography>;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        border: BORDER,
        boxShadow: "6px 6px 0px #1B5E20",
        bgcolor: "#FFFFFF",
        p: { xs: 2.5, md: 4 },
      }}
    >
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: 0, border: "2px solid #14431A" }}
        >
          {error}
        </Alert>
      )}
      <Stack spacing={3}>
        <TextField
          name="title"
          label="Job title"
          value={formData.title}
          onChange={handleChange}
          required
          fullWidth
          autoComplete="off"
          sx={[fieldSx, noAutofillHighlight]}
        />

        <TextField
          name="location"
          label="Location"
          value={formData.isRemote ? "" : formData.location}
          onChange={handleChange}
          required={!formData.isRemote}
          disabled={formData.isRemote}
          fullWidth
          autoComplete="off"
          helperText={
            formData.isRemote ? "Not needed for remote positions" : " "
          }
          sx={[fieldSx, noAutofillHighlight]}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.isRemote}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isRemote: e.target.checked,
                  location: e.target.checked ? "" : formData.location,
                })
              }
              sx={{ color: "#14431A", "&.Mui-checked": { color: "#1B5E20" } }}
            />
          }
          label="This is a remote position"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.isUnpaid}
              onChange={(e) =>
                setFormData({ ...formData, isUnpaid: e.target.checked })
              }
              sx={{ color: "#14431A", "&.Mui-checked": { color: "#1B5E20" } }}
            />
          }
          label="This is an unpaid position"
        />

        <Stack direction="row" spacing={2}>
          <TextField
            name="salaryMin"
            label="Salary min"
            type="number"
            value={formData.salaryMin}
            onChange={handleChange}
            fullWidth
            required={!formData.isUnpaid}
            disabled={formData.isUnpaid}
            inputProps={{ min: 0 }}
            sx={fieldSx}
          />
          <TextField
            name="salaryMax"
            label="Salary max"
            type="number"
            value={formData.salaryMax}
            onChange={handleChange}
            fullWidth
            required={!formData.isUnpaid}
            disabled={formData.isUnpaid}
            inputProps={{ min: 0 }}
            error={isSalaryRangeInvalid}
            helperText={
              isSalaryRangeInvalid ? "Must be greater than minimum salary" : " "
            }
            sx={fieldSx}
          />
        </Stack>

        <TextField
          name="experienceRequired"
          label="Experience required"
          select
          value={formData.experienceRequired}
          onChange={handleChange}
          fullWidth
          sx={fieldSx}
        >
          {EXPERIENCE_OPTIONS.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {formatExperience(opt)}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ width: "100%" }}>
          <Typography sx={sectionLabelSx}>Number of openings</Typography>
          <TextField
            name="numberOfOpenings"
            type="number"
            value={formData.numberOfOpenings}
            onChange={handleOpeningsChange}
            fullWidth
            inputProps={{ min: 1 }}
            helperText="Must be at least 1"
            sx={fieldSx}
          />
        </Box>

        <Box>
          <Typography sx={sectionLabelSx}>Skills required</Typography>
          <SkillsAutocomplete
            value={formData.skillsRequired}
            onChange={(newValue) =>
              setFormData({ ...formData, skillsRequired: newValue })
            }
          />
        </Box>

        <TextField
          name="description"
          label="Job description"
          value={formData.description}
          onChange={handleDescriptionChange}
          required
          multiline
          minRows={4}
          fullWidth
          inputProps={{ maxLength: DESCRIPTION_LIMIT }}
          error={isDescriptionOverLimit}
          helperText={`${formData.description.length}/${DESCRIPTION_LIMIT} characters`}
          sx={fieldSx}
        />

        <Box sx={{ width: "100%" }}>
          <Typography sx={sectionLabelSx}>Application deadline</Typography>
          <TextField
            name="lastApplyDate"
            type="date"
            value={formData.lastApplyDate}
            onChange={handleChange}
            fullWidth
            inputProps={{
              min: today,
              "data-has-value": formData.lastApplyDate ? "true" : "false",
            }}
            error={isPastDate}
            helperText={isPastDate ? "Cannot be in the past" : " "}
            sx={[fieldSx, dateVisibilitySx]}
          />
        </Box>

        <Box>
          <Typography sx={sectionLabelSx}>
            How should applications be accepted?
          </Typography>
          <RadioGroup
            row
            value={formData.applicationType}
            onChange={(e) =>
              setFormData({ ...formData, applicationType: e.target.value })
            }
          >
            <FormControlLabel
              value="internal"
              control={
                <Radio
                  sx={{
                    color: "#14431A",
                    "&.Mui-checked": { color: "#1B5E20" },
                  }}
                />
              }
              label="On LinkWurk"
            />
            <FormControlLabel
              value="external"
              control={
                <Radio
                  sx={{
                    color: "#14431A",
                    "&.Mui-checked": { color: "#1B5E20" },
                  }}
                />
              }
              label="External website"
            />
          </RadioGroup>
        </Box>

        {formData.applicationType === "external" && (
          <TextField
            name="externalApplyUrl"
            label="External application URL"
            value={formData.externalApplyUrl}
            onChange={handleChange}
            required
            fullWidth
            sx={fieldSx}
          />
        )}

        <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
          <Button
            type="submit"
            size="large"
            disabled={
              loading ||
              isPastDate ||
              isDescriptionOverLimit ||
              isSalaryRangeInvalid
            }
            sx={brutalistButtonSx}
          >
            {jobId ? "Save changes" : "Post job"}
          </Button>
          <Button
            onClick={() => navigate("/recruiter/jobs")}
            sx={{
              border: "2px solid #14431A",
              borderRadius: 0,
              color: "#14431A",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

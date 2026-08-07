import { useState } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { searchSkills } from "../api/skillsApi";

export default function SkillsAutocomplete({ value, onChange }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = async (e, newInput) => {
    setInputValue(newInput);
    if (!newInput) {
      setOptions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await searchSkills(newInput);
      setOptions(res.data.skills);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Autocomplete
      multiple
      freeSolo
      options={options}
      value={value}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={(e, newValue) => onChange(newValue)}
      loading={loading}
      filterOptions={(x) => x}
      renderInput={(params) => {
        const { InputProps = {}, ...rest } = params;
        return (
          <TextField
            {...rest}
            InputProps={{
              ...InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={18} />}
                  {InputProps.endAdornment}
                </>
              ),
            }}
            placeholder="Start typing a skill..."
          />
        );
      }}
    />
  );
}

import { useState } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import api from "@/lib/api";

export default function UniversityAutocomplete({ value, onChange }) {
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
      const res = await api.get(
        `/api/universities/search?q=${encodeURIComponent(newInput)}`,
      );
      setOptions(res.data.universities.map((u) => u.name));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Autocomplete
      freeSolo
      options={options}
      value={value}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={(e, newValue) => onChange(newValue || "")}
      loading={loading}
      filterOptions={(x) => x}
      slotProps={{
        popper: {
          placement: "bottom-start",
          modifiers: [
            { name: "flip", enabled: false },
            { name: "preventOverflow", enabled: false },
          ],
        },
        listbox: {
          style: { maxHeight: 220 },
        },
      }}
      renderOption={(props, option) => (
        <li
          {...props}
          key={option}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "block",
          }}
        >
          {option}
        </li>
      )}
      renderInput={(params) => {
        const { InputProps = {}, ...rest } = params;
        return (
          <TextField
            {...rest}
            label="Institution"
            size="small"
            fullWidth
            InputProps={{
              ...InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={16} />}
                  {InputProps.endAdornment}
                </>
              ),
            }}
            placeholder="Start typing a university..."
          />
        );
      }}
    />
  );
}

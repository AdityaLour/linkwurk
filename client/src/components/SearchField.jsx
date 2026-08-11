import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const DARK = '#14431A';
const GREEN = '#1B5E20';

export default function SearchField({ value, onChange, placeholder = 'Search...' }) {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      fullWidth
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: DARK, fontSize: 20 }} />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 0, bgcolor: '#FFFFFF',
          '& fieldset': { borderWidth: '2px', borderColor: DARK },
          '&:hover fieldset': { borderColor: GREEN },
          '&.Mui-focused fieldset': { borderWidth: '2px', borderColor: GREEN },
        },
      }}
    />
  );
}
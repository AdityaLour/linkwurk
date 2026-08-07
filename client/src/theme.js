import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#E8F5E9',
            paper: '#FFFFFF',
        },
        primary: {
            main: '#1B5E20',
            contrastText: '#E8F5E9',
        },
        secondary: {
            main: '#66BB6A',
            contrastText: '#1B5E20',
        },
        success: {
            main: '#66BB6A',
        },
        text: {
            primary: '#1B5E20',
            secondary: '#4C7A4F',
        },
        divider: '#A5D6A7',
    },
    typography: {
        fontFamily: '"IBM Plex Sans", sans-serif',
        h1: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
        h2: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
        h3: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
        h4: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
        borderRadius: 8,
    },
});

export default theme;
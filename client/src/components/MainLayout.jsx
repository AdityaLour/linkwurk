import { Box } from "@mui/material";
import Navbar from "./Navbar";

export default function MainLayout({ children }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar />
      {children}
    </Box>
  );
}

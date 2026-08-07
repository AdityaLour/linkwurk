import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <Box sx={{ px: { xs: 3, md: 5 }, py: { xs: 8, md: 12 } }}>
      <Typography variant="h3" sx={{ maxWidth: 520, mb: 1 }}>
        Where skills meet the right role
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Browse open roles, or find the right candidate.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate("/jobs")}
      >
        Browse jobs
      </Button>
    </Box>
  );
}

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Popover,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [bellAnchor, setBellAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ringing, setRinging] = useState(false);

  const handleBellClick = (e) => {
    setBellAnchor(e.currentTarget);
    setRinging(true);
    setTimeout(() => setRinging(false), 600);
  };

  const handleLogout = async () => {
    await api.post("/api/auth/logout");
    setUser(null);
    setAnchorEl(null);
    navigate("/");
  };

  const candidateLinks = [
    { label: "Browse jobs", to: "/jobs" },
    { label: "Saved jobs", to: "/saved-jobs" },
    { label: "My applications", to: "/applications" },
  ];
  const recruiterLinks = [
    { label: "My jobs", to: "/recruiter/jobs" },
    { label: "Post a job", to: "/recruiter/jobs/new" },
  ];
  const links = user?.role === "recruiter" ? recruiterLinks : candidateLinks;

  return (
    <AppBar
      position="static"
      elevation={0}
      color="transparent"
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 4 } }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 700,
            color: "primary.main",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          LinkWurk
        </Typography>

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 3.5,
          }}
        >
          {links.map((link) => (
            <Typography
              key={link.to}
              onClick={() => navigate(link.to)}
              sx={{
                fontSize: "0.95rem",
                fontWeight: 500,
                color: "text.secondary",
                cursor: "pointer",
                position: "relative",
                pb: "4px",
                transition: "color 0.2s ease",
                "&:hover": { color: "primary.main" },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  height: "2px",
                  width: 0,
                  bgcolor: "primary.main",
                  transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
                },
                "&:hover::after": { width: "100%" },
              }}
            >
              {link.label}
            </Typography>
          ))}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {user ? (
            <>
              <Box sx={{ position: "relative" }}>
                {ringing && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      border: "2px solid",
                      borderColor: "secondary.main",
                      animation: "ripple 0.6s ease-out",
                      "@keyframes ripple": {
                        from: { transform: "scale(0.6)", opacity: 0.8 },
                        to: { transform: "scale(2.2)", opacity: 0 },
                      },
                    }}
                  />
                )}
                <IconButton
                  onClick={handleBellClick}
                  sx={{
                    opacity: 0.6,
                    transformOrigin: "50% 20%",
                    animation: ringing ? "bellRing 0.6s ease-in-out" : "none",
                    "@keyframes bellRing": {
                      "0%, 100%": { transform: "rotate(0deg)" },
                      "15%": { transform: "rotate(16deg)" },
                      "30%": { transform: "rotate(-13deg)" },
                      "45%": { transform: "rotate(10deg)" },
                      "60%": { transform: "rotate(-7deg)" },
                      "75%": { transform: "rotate(4deg)" },
                      "85%": { transform: "rotate(-2deg)" },
                    },
                  }}
                >
                  <NotificationsNoneIcon />
                </IconButton>
              </Box>
              <Popover
                open={Boolean(bellAnchor)}
                anchorEl={bellAnchor}
                onClose={() => setBellAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              >
                <Box sx={{ p: 2, maxWidth: 240 }}>
                  <Typography variant="body2" color="text.secondary">
                    Notifications are coming soon. We'll let you know the moment
                    applications change status.
                  </Typography>
                </Box>
              </Popover>

              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "secondary.main",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                {user.firstName?.[0]?.toUpperCase() || "?"}
              </Avatar>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                autoFocus={false}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>

              <IconButton
                sx={{ display: { xs: "flex", md: "none" } }}
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Button variant="text" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/role-select")}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <List sx={{ width: 220, pt: 4 }}>
          {links.map((link) => (
            <ListItemButton
              key={link.to}
              onClick={() => {
                navigate(link.to);
                setDrawerOpen(false);
              }}
            >
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
}

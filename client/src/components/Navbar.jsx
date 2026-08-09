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

const DARK = "#14431A";
const GREEN = "#1B5E20";

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

  const navLinkSx = {
    fontWeight: 700,
    fontSize: "0.8rem",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
    color: "#2F5A33",
    cursor: "pointer",
    px: 1.2,
    py: 0.6,
    border: "2px solid transparent",
    transition:
      "border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease, color 0.15s ease",
    "&:hover": {
      color: DARK,
      borderColor: DARK,
      bgcolor: "#FFFFFF",
      boxShadow: `3px 3px 0px ${GREEN}`,
      transform: "translate(-1px, -1px)",
    },
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ bgcolor: "#FFFFFF", borderBottom: `3px solid ${DARK}` }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 4 } }}>
        <Typography
          onClick={() => navigate("/")}
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 800,
            fontSize: "1.3rem",
            color: DARK,
            cursor: "pointer",
            display: "inline-block",
            transition: "transform 0.15s ease",
            "&:hover": { transform: "translate(-1px, -1px)" },
          }}
        >
          LinkWurk
        </Typography>

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 1.5,
          }}
        >
          {links.map((link) => (
            <Typography
              key={link.to}
              onClick={() => navigate(link.to)}
              sx={navLinkSx}
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
                      border: `2px solid ${GREEN}`,
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
                    border: `2px solid ${DARK}`,
                    borderRadius: 0,
                    width: 38,
                    height: 38,
                    color: DARK,
                    boxShadow: `2px 2px 0px ${GREEN}`,
                    transformOrigin: "50% 20%",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    "&:hover": {
                      boxShadow: `3px 3px 0px ${GREEN}`,
                      transform: "translate(-1px, -1px)",
                    },
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
                  <NotificationsNoneIcon fontSize="small" />
                </IconButton>
              </Box>

              <Popover
                open={Boolean(bellAnchor)}
                anchorEl={bellAnchor}
                onClose={() => setBellAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                slotProps={{
                  paper: {
                    sx: {
                      border: `2.5px solid ${DARK}`,
                      borderRadius: 0,
                      boxShadow: `4px 4px 0px ${GREEN}`,
                      mt: 1,
                    },
                  },
                }}
              >
                <Box sx={{ p: 2, maxWidth: 240 }}>
                  <Typography variant="body2" sx={{ color: "#2F5A33" }}>
                    Notifications are coming soon. We'll let you know the moment
                    applications change status.
                  </Typography>
                </Box>
              </Popover>

              <Avatar
                variant="square"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "#66BB6A",
                  color: DARK,
                  border: `2.5px solid ${DARK}`,
                  boxShadow: `2px 2px 0px ${GREEN}`,
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  "&:hover": {
                    boxShadow: `3px 3px 0px ${GREEN}`,
                    transform: "translate(-1px, -1px)",
                  },
                }}
              >
                {user.firstName?.[0]?.toUpperCase() || "?"}
              </Avatar>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                autoFocus={false}
                slotProps={{
                  paper: {
                    sx: {
                      border: `2.5px solid ${DARK}`,
                      borderRadius: 0,
                      boxShadow: `4px 4px 0px ${GREEN}`,
                      mt: 1,
                    },
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    setAnchorEl(null);
                  }}
                  sx={{
                    fontWeight: 700,
                    textTransform: "uppercase",
                    fontSize: "0.8rem",
                    color: DARK,
                  }}
                >
                  My Profile
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    fontWeight: 700,
                    textTransform: "uppercase",
                    fontSize: "0.8rem",
                    color: DARK,
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>

              <IconButton
                sx={{
                  display: { xs: "flex", md: "none" },
                  border: `2px solid ${DARK}`,
                  borderRadius: 0,
                  color: DARK,
                }}
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <>
              <Button
                onClick={() => navigate("/login")}
                sx={{
                  border: `2px solid ${DARK}`,
                  borderRadius: 0,
                  color: DARK,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.8rem",
                  px: 2,
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  "&:hover": {
                    bgcolor: "#FFFFFF",
                    boxShadow: `3px 3px 0px ${GREEN}`,
                    transform: "translate(-1px, -1px)",
                  },
                }}
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/role-select")}
                sx={{
                  border: `2px solid ${DARK}`,
                  borderRadius: 0,
                  bgcolor: GREEN,
                  color: "#FFFFFF",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.8rem",
                  px: 2,
                  boxShadow: `3px 3px 0px ${DARK}`,
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  "&:hover": {
                    bgcolor: "#164d1b",
                    boxShadow: `4px 4px 0px ${DARK}`,
                    transform: "translate(-1px, -1px)",
                  },
                }}
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
        slotProps={{ paper: { sx: { borderLeft: `3px solid ${DARK}` } } }}
      >
        <List sx={{ width: 220, pt: 4 }}>
          {links.map((link) => (
            <ListItemButton
              key={link.to}
              onClick={() => {
                navigate(link.to);
                setDrawerOpen(false);
              }}
              sx={{ "&:hover": { bgcolor: "#E8F5E9" } }}
            >
              <ListItemText
                primary={link.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontWeight: 700,
                      color: DARK,
                      textTransform: "uppercase",
                      fontSize: "0.82rem",
                    },
                  },
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
}

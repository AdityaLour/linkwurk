import { useState, useEffect } from "react";
import { Box, Typography, Skeleton, Chip } from "@mui/material";
import {
  getAllUsers,
  toggleUserStatus,
  verifyUserEmail,
} from "@/features/admin/api/adminApi";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import SearchField from "@/components/SearchField";

const DARK = "#14431A";
const GREEN = "#1B5E20";
const BORDER = `3px solid ${DARK}`;
const SHADOW = `5px 5px 0px ${GREEN}`;

const FILTERS = [
  { key: "", label: "All" },
  { key: "candidate", label: "Candidates" },
  { key: "recruiter", label: "Recruiters" },
];

const actionBtnSx = {
  cursor: "pointer",
  border: `2px solid ${DARK}`,
  px: 1.1,
  py: 0.4,
  fontSize: "0.68rem",
  fontWeight: 700,
  textTransform: "uppercase",
  transition: "background-color 0.15s ease, color 0.15s ease",
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const loadUsers = async (role, searchTerm) => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllUsers(role || undefined, searchTerm || undefined);
      setUsers(res.data.users);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => loadUsers(filter, search), 350);
    return () => clearTimeout(t);
  }, [filter, search]);

  const handleToggleStatus = async (userId) => {
    setBusyId(userId);
    try {
      const res = await toggleUserStatus(userId);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isActive: res.data.user.isActive } : u,
        ),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    } finally {
      setBusyId(null);
    }
  };

  const handleVerifyEmail = async (userId) => {
    setBusyId(userId);
    try {
      await verifyUserEmail(userId);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isEmailVerified: true } : u,
        ),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify email");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        backgroundImage:
          "radial-gradient(rgba(27,94,32,0.28) 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        minHeight: "100vh",
        py: 6,
      }}
    >
      <Box sx={{ maxWidth: 1000, mx: "auto", px: 3 }}>
        <Typography
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 800,
            fontSize: { xs: "1.6rem", md: "2rem" },
            color: DARK,
            textTransform: "uppercase",
            mb: 3,
          }}
        >
          Manage users
        </Typography>

        <Box sx={{ mb: 2, maxWidth: 320 }}>
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Search by name or email..."
          />
        </Box>

        <Box sx={{ display: "flex", gap: 0.8, mb: 3, flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <Box
              key={f.key}
              onClick={() => setFilter(f.key)}
              sx={{
                ...actionBtnSx,
                bgcolor: filter === f.key ? GREEN : "#FFFFFF",
                color: filter === f.key ? "#FFFFFF" : DARK,
                "&:hover": { bgcolor: filter === f.key ? GREEN : "#E8F5E9" },
              }}
            >
              {f.label}
            </Box>
          ))}
        </Box>

        {error && (
          <Box
            sx={{
              border: `2px solid ${DARK}`,
              bgcolor: "#F8D7DA",
              color: DARK,
              p: 1.5,
              mb: 2,
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            {error}
          </Box>
        )}

        <Box sx={{ border: BORDER, boxShadow: SHADOW, bgcolor: "#FFFFFF" }}>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={76}
                sx={{ borderBottom: "2px solid #E8F5E9" }}
              />
            ))
          ) : users.length === 0 ? (
            <Typography sx={{ p: 4, textAlign: "center", color: "#2F5A33" }}>
              No users found.
            </Typography>
          ) : (
            users.map((u, i) => (
              <Box
                key={u._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1.5,
                  flexWrap: "wrap",
                  px: 2.5,
                  py: 2,
                  borderBottom:
                    i < users.length - 1 ? "2px solid #E8F5E9" : "none",
                  opacity: u.isActive ? 1 : 0.55,
                }}
              >
                <Box sx={{ minWidth: 0, flex: "1 1 220px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography
                      sx={{ fontWeight: 700, color: DARK, fontSize: "0.9rem" }}
                    >
                      {u.firstName} {u.lastName}
                    </Typography>
                    <Box
                      sx={{
                        border: `2px solid ${DARK}`,
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: DARK,
                        px: 0.6,
                        py: 0.15,
                      }}
                    >
                      {u.role}
                    </Box>
                    {!u.isActive && (
                      <Box
                        sx={{
                          bgcolor: "#D64550",
                          color: "#FFFFFF",
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          px: 0.6,
                          py: 0.15,
                        }}
                      >
                        Deactivated
                      </Box>
                    )}
                  </Box>
                  <Typography sx={{ fontSize: "0.78rem", color: "#7A7267" }}>
                    {u.email}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.68rem",
                      color: "#A9A296",
                      fontFamily: '"IBM Plex Mono", monospace',
                    }}
                  >
                    Joined {formatRelativeTime(u.createdAt)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap" }}>
                  {!u.isEmailVerified && (
                    <Box
                      onClick={() =>
                        busyId !== u._id && handleVerifyEmail(u._id)
                      }
                      sx={{
                        ...actionBtnSx,
                        bgcolor: "#FFFFFF",
                        color: DARK,
                        "&:hover": { bgcolor: "#E8F5E9" },
                        opacity: busyId === u._id ? 0.5 : 1,
                      }}
                    >
                      Verify email
                    </Box>
                  )}
                  {u.role !== "admin" && (
                    <Box
                      onClick={() =>
                        busyId !== u._id && handleToggleStatus(u._id)
                      }
                      sx={{
                        ...actionBtnSx,
                        bgcolor: u.isActive ? "#FFFFFF" : GREEN,
                        color: u.isActive ? "#D64550" : "#FFFFFF",
                        borderColor: u.isActive ? "#D64550" : DARK,
                        "&:hover": { bgcolor: u.isActive ? "#F8D7DA" : GREEN },
                        opacity: busyId === u._id ? 0.5 : 1,
                      }}
                    >
                      {u.isActive ? "Deactivate" : "Reactivate"}
                    </Box>
                  )}
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
}

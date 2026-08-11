import { useState, useEffect } from "react";
import { Box, Typography, Skeleton, Avatar } from "@mui/material";
import {
  getAllRecruitersWithStats,
  toggleUserStatus,
  verifyUserEmail,
} from "@/features/admin/api/adminApi";
import RecruiterDetailDialog from "@/features/admin/components/RecruiterDetailDialog";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import SearchField from "@/components/SearchField";

const DARK = "#14431A";
const GREEN = "#1B5E20";
const BORDER = `3px solid ${DARK}`;
const SHADOW = `5px 5px 0px ${GREEN}`;

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

export default function ManageRecruitersPage() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [selectedRecruiterId, setSelectedRecruiterId] = useState(null);
  const [search, setSearch] = useState("");

  const loadRecruiters = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllRecruitersWithStats();
      setRecruiters(res.data.recruiters);
    } catch (err) {
      setError("Failed to load recruiters.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecruiters();
  }, []);

  const handleToggleStatus = async (e, userId) => {
    e.stopPropagation();
    setBusyId(userId);
    try {
      const res = await toggleUserStatus(userId);
      setRecruiters((prev) =>
        prev.map((r) =>
          r.userId?._id === userId
            ? {
                ...r,
                userId: { ...r.userId, isActive: res.data.user.isActive },
              }
            : r,
        ),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update recruiter");
    } finally {
      setBusyId(null);
    }
  };

  const handleVerifyEmail = async (e, userId) => {
    e.stopPropagation();
    setBusyId(userId);
    try {
      await verifyUserEmail(userId);
      setRecruiters((prev) =>
        prev.map((r) =>
          r.userId?._id === userId
            ? { ...r, userId: { ...r.userId, isEmailVerified: true } }
            : r,
        ),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify email");
    } finally {
      setBusyId(null);
    }
  };

  const filteredRecruiters = recruiters.filter((r) => {
    const q = search.toLowerCase();
    if (!q) return true;
    const u = r.userId || {};
    return (
      r.companyName?.toLowerCase().includes(q) ||
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

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
          Manage recruiters
        </Typography>

        <Box sx={{ mb: 2, maxWidth: 320 }}>
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Search by company or name..."
          />
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
                height={90}
                sx={{ borderBottom: "2px solid #E8F5E9" }}
              />
            ))
          ) : filteredRecruiters.length === 0 ? (
            <Typography sx={{ p: 4, textAlign: "center", color: "#2F5A33" }}>
              {recruiters.length === 0
                ? "No recruiters found."
                : "No recruiters match your search."}
            </Typography>
          ) : (
            filteredRecruiters.map((r, i) => {
              const u = r.userId || {};
              return (
                <Box
                  key={r._id}
                  onClick={() => setSelectedRecruiterId(r._id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1.5,
                    flexWrap: "wrap",
                    px: 2.5,
                    py: 2,
                    borderBottom:
                      i < filteredRecruiters.length - 1
                        ? "2px solid #E8F5E9"
                        : "none",
                    opacity: u.isActive === false ? 0.55 : 1,
                    cursor: "pointer",
                    transition: "background-color 0.15s ease",
                    "&:hover": { bgcolor: "#F3FAF3" },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      minWidth: 0,
                      flex: "1 1 260px",
                    }}
                  >
                    <Avatar
                      variant="square"
                      src={r.companyLogo}
                      sx={{
                        width: 42,
                        height: 42,
                        bgcolor: "#66BB6A",
                        color: DARK,
                        border: `2px solid ${DARK}`,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {r.companyName?.[0] || "?"}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: DARK,
                            fontSize: "0.9rem",
                          }}
                        >
                          {r.companyName || "Unnamed company"}
                        </Typography>
                        {u.isActive === false && (
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
                      <Typography
                        sx={{ fontSize: "0.78rem", color: "#7A7267" }}
                      >
                        {u.firstName} {u.lastName} &middot; {u.email}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.68rem",
                          color: "#A9A296",
                          fontFamily: '"IBM Plex Mono", monospace',
                        }}
                      >
                        {r.jobCount} job{r.jobCount !== 1 ? "s" : ""} posted
                        &middot; joined{" "}
                        {u.createdAt ? formatRelativeTime(u.createdAt) : "—"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap" }}>
                    {!u.isEmailVerified && (
                      <Box
                        onClick={(e) =>
                          busyId !== u._id && handleVerifyEmail(e, u._id)
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
                    <Box
                      onClick={(e) =>
                        busyId !== u._id && handleToggleStatus(e, u._id)
                      }
                      sx={{
                        ...actionBtnSx,
                        bgcolor: u.isActive === false ? GREEN : "#FFFFFF",
                        color: u.isActive === false ? "#FFFFFF" : "#D64550",
                        borderColor: u.isActive === false ? DARK : "#D64550",
                        "&:hover": {
                          bgcolor: u.isActive === false ? GREEN : "#F8D7DA",
                        },
                        opacity: busyId === u._id ? 0.5 : 1,
                      }}
                    >
                      {u.isActive === false ? "Reactivate" : "Deactivate"}
                    </Box>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      </Box>

      <RecruiterDetailDialog
        recruiterId={selectedRecruiterId}
        open={Boolean(selectedRecruiterId)}
        onClose={() => setSelectedRecruiterId(null)}
      />
    </Box>
  );
}

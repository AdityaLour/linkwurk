import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Avatar,
  IconButton,
  Skeleton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getRecruiterDetail } from "../api/adminApi";
import { formatRelativeTime } from "@/lib/formatRelativeTime";

const DARK = "#14431A";
const GREEN = "#1B5E20";

export default function RecruiterDetailDialog({ recruiterId, open, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && recruiterId) {
      setLoading(true);
      getRecruiterDetail(recruiterId)
        .then((res) => setData(res.data))
        .finally(() => setLoading(false));
    }
  }, [open, recruiterId]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            border: `3px solid ${DARK}`,
            borderRadius: 0,
            boxShadow: `6px 6px 0px ${GREEN}`,
          },
        },
      }}
    >
      <DialogContent sx={{ p: 3.5 }}>
        {loading || !data ? (
          <Skeleton variant="rectangular" height={300} />
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  variant="square"
                  src={data.recruiter.companyLogo}
                  sx={{
                    width: 52,
                    height: 52,
                    border: `2.5px solid ${DARK}`,
                    bgcolor: "#66BB6A",
                    color: DARK,
                    fontWeight: 700,
                  }}
                >
                  {data.recruiter.companyName?.[0] || "?"}
                </Avatar>
                <Box>
                  <Typography
                    sx={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontWeight: 700,
                      fontSize: "1.15rem",
                      color: DARK,
                    }}
                  >
                    {data.recruiter.companyName || "Unnamed company"}
                  </Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: "#7A7267" }}>
                    {data.recruiter.userId?.firstName}{" "}
                    {data.recruiter.userId?.lastName} &middot;{" "}
                    {data.recruiter.userId?.email}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={onClose} size="small" sx={{ color: DARK }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Typography
              sx={{
                fontSize: "0.7rem",
                color: "#A9A296",
                fontFamily: '"IBM Plex Mono", monospace',
                mb: 2,
              }}
            >
              Recruiter ID: {data.recruiter._id}
            </Typography>

            <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
              <Box sx={{ flex: 1, border: `2px solid ${DARK}`, p: 1.2 }}>
                <Typography
                  sx={{
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "#7A7267",
                  }}
                >
                  Active jobs
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: "1.4rem",
                    fontWeight: 600,
                    color: "#3D8361",
                  }}
                >
                  {data.activeCount}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, border: `2px solid ${DARK}`, p: 1.2 }}>
                <Typography
                  sx={{
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "#7A7267",
                  }}
                >
                  Closed jobs
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: "1.4rem",
                    fontWeight: 600,
                    color: "#7A7267",
                  }}
                >
                  {data.closedCount}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, border: `2px solid ${DARK}`, p: 1.2 }}>
                <Typography
                  sx={{
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "#7A7267",
                  }}
                >
                  Total posted
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: "1.4rem",
                    fontWeight: 600,
                    color: DARK,
                  }}
                >
                  {data.jobs.length}
                </Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: DARK,
                mb: 1,
              }}
            >
              Job postings
            </Typography>
            {data.jobs.length === 0 ? (
              <Typography sx={{ color: "#7A7267", fontSize: "0.85rem" }}>
                No jobs posted yet.
              </Typography>
            ) : (
              data.jobs.map((job, i) => (
                <Box
                  key={job._id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1,
                    borderBottom:
                      i < data.jobs.length - 1 ? "2px solid #E8F5E9" : "none",
                    gap: 1.5,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    sx={{ fontSize: "0.85rem", color: DARK, fontWeight: 600 }}
                  >
                    {job.title}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        bgcolor: job.status === "open" ? "#3D8361" : "#D8D3C7",
                        color: job.status === "open" ? "#FFFFFF" : "#6B6355",
                        border: `2px solid ${DARK}`,
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        px: 0.6,
                        py: 0.15,
                      }}
                    >
                      {job.status}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "0.68rem",
                        color: "#A9A296",
                        fontFamily: '"IBM Plex Mono", monospace',
                      }}
                    >
                      {formatRelativeTime(job.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              ))
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

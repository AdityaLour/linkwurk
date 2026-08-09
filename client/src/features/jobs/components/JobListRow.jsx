import { Box, Typography, Stack, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useNavigate } from "react-router-dom";
import { formatSalary } from "@/lib/formatSalary";

const DARK = "#14431A";
const GREEN = "#1B5E20";

export default function JobListRow({ job, isSaved, onToggleSave }) {
  const navigate = useNavigate();
  const recruiter = job.recruiterId || {};

  const handleSaveClick = (e) => {
    e.stopPropagation();
    onToggleSave?.();
  };

  return (
    <Box
      onClick={() => navigate(`/jobs/${job._id}`)}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        px: 2.5,
        py: 3,
        minHeight: 92,
        borderBottom: "2px solid #E8F5E9",
        cursor: "pointer",
        transition: "background-color 0.15s ease",
        "&:hover": { bgcolor: "#F3FAF3" },
        "&:hover .row-arrow": { opacity: 1, transform: "translateX(0)" },
        "&:last-of-type": { borderBottom: "none" },
        flexWrap: "wrap",
      }}
    >
      <Box sx={{ minWidth: 180, flex: "1 1 220px" }}>
        <Typography
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: "1.1rem",
            color: DARK,
          }}
        >
          {job.title}
        </Typography>
        <Typography sx={{ fontSize: "0.82rem", color: "#7A7267", mt: 0.3 }}>
          {recruiter.companyName || "Company"}
        </Typography>
      </Box>

      <Typography sx={{ fontSize: "0.9rem", color: "#2F5A33", minWidth: 100 }}>
        {job.location}
      </Typography>

      <Typography
        sx={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: "0.9rem",
          fontWeight: 600,
          color: GREEN,
          minWidth: 130,
        }}
      >
        {formatSalary(job.salaryMin, job.salaryMax)}
      </Typography>

      <Stack
        direction="row"
        spacing={0.8}
        flexWrap="wrap"
        useFlexGap
        sx={{ flex: "1 1 200px" }}
      >
        {(job.skillsRequired || []).slice(0, 3).map((skill) => (
          <Box
            key={skill}
            sx={{
              border: `2px solid ${DARK}`,
              fontSize: "0.72rem",
              fontWeight: 600,
              color: DARK,
              px: 0.9,
              py: 0.25,
            }}
          >
            {skill}
          </Box>
        ))}
      </Stack>

      {onToggleSave && (
        <IconButton
          onClick={handleSaveClick}
          size="small"
          sx={{
            border: `2px solid ${DARK}`,
            borderRadius: 0,
            flexShrink: 0,
            "&:hover": { bgcolor: GREEN, "& svg": { color: "#FFFFFF" } },
          }}
        >
          {isSaved ? (
            <BookmarkIcon fontSize="small" sx={{ color: GREEN }} />
          ) : (
            <BookmarkBorderIcon fontSize="small" sx={{ color: DARK }} />
          )}
        </IconButton>
      )}

      <ArrowForwardIcon
        className="row-arrow"
        sx={{
          color: DARK,
          opacity: 0,
          transform: "translateX(-8px)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
          flexShrink: 0,
        }}
      />
    </Box>
  );
}

import { useState, useRef } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";
import ApplicationStageTracker from "./ApplicationStageTracker";

const DARK = "#14431A";
const GREEN = "#1B5E20";
const BORDER = `3px solid ${DARK}`;
const SHADOW = `5px 5px 0px ${GREEN}`;

export default function ApplicationStatusCarousel({ applications }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(applications.length > 2);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * (el.clientWidth / 2), behavior: "smooth" });
    setTimeout(updateScrollButtons, 350);
  };

  if (!applications || applications.length === 0) return null;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: "1.1rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.3px",
            color: DARK,
          }}
        >
          Your application status
        </Typography>
        {applications.length > 2 && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              onClick={() => scroll(-1)}
              disabled={!canScrollLeft}
              sx={{
                border: `2px solid ${DARK}`,
                borderRadius: 0,
                color: DARK,
                "&.Mui-disabled": { borderColor: "#C8DFC9", color: "#C8DFC9" },
              }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => scroll(1)}
              disabled={!canScrollRight}
              sx={{
                border: `2px solid ${DARK}`,
                borderRadius: 0,
                color: DARK,
                "&.Mui-disabled": { borderColor: "#C8DFC9", color: "#C8DFC9" },
              }}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>

      <Box
        ref={scrollRef}
        onScroll={updateScrollButtons}
        sx={{
          display: "flex",
          gap: 2.5,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          pb: 1,
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {applications.map((app) => (
          <Box
            key={app._id}
            onClick={() => navigate(`/jobs/${app.jobId?._id}`)}
            sx={{
              flex: { xs: "0 0 88%", sm: "0 0 calc(50% - 10px)" },
              scrollSnapAlign: "start",
              border: BORDER,
              boxShadow: SHADOW,
              bgcolor: "#FFFFFF",
              p: 3,
              cursor: "pointer",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              "&:hover": {
                transform: "translate(-2px, -2px)",
                boxShadow: `7px 7px 0px ${GREEN}`,
              },
            }}
          >
            <Typography sx={{ fontWeight: 700, color: DARK, mb: 2 }}>
              {app.jobId?.title} — {app.jobId?.recruiterId?.companyName}
            </Typography>
            <ApplicationStageTracker currentStatus={app.status} />
          </Box>
        ))}
      </Box>

      {applications.length > 2 && (
        <Button
          onClick={() => navigate("/applications")}
          sx={{
            mt: 2,
            border: `2px solid ${DARK}`,
            borderRadius: 0,
            color: DARK,
            fontWeight: 700,
            textTransform: "uppercase",
            fontSize: "0.8rem",
          }}
        >
          View all applications
        </Button>
      )}
    </Box>
  );
}

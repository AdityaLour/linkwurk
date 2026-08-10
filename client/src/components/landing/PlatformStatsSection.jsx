import { useState, useEffect } from "react";
import { Box, Typography, Grid, Skeleton } from "@mui/material";
import useCountUp from "@/hooks/useCountUp";
import useScrollRepeat from "@/hooks/useScrollRepeat";
import { getPublicStats } from "@/features/public/api/publicApi";

const DARK = "#14431A";
const GREEN = "#1B5E20";
const BORDER = `3px solid ${DARK}`;
const SHADOW = `5px 5px 0px ${GREEN}`;

function StatCard({ label, value, delay }) {
  const count = useCountUp(value, { duration: 900, delay });
  return (
    <Box
      sx={{
        border: BORDER,
        boxShadow: SHADOW,
        bgcolor: "#FFFFFF",
        p: 2.5,
        textAlign: "center",
      }}
    >
      <Typography
        sx={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontWeight: 700,
          fontSize: "2rem",
          color: GREEN,
        }}
      >
        {count}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.72rem",
          fontWeight: 700,
          textTransform: "uppercase",
          color: "#7A7267",
          mt: 0.5,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

export default function PlatformStatsSection() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    candidates: 0,
    recruiters: 0,
    jobsPosted: 0,
  });
  const { ref, playKey } = useScrollRepeat();

  useEffect(() => {
    getPublicStats()
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box
      ref={ref}
      sx={{ px: { xs: 3, md: 5 }, py: 5, maxWidth: 900, mx: "auto" }}
    >
      {loading ? (
        <Grid container spacing={2.5}>
          {[0, 1, 2].map((i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Skeleton
                variant="rectangular"
                height={100}
                sx={{ border: BORDER }}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2.5} key={playKey}>
          <Grid item xs={12} sm={4}>
            <StatCard label="Candidates" value={stats.candidates} delay={0} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard label="Recruiters" value={stats.recruiters} delay={150} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard
              label="Jobs posted"
              value={stats.jobsPosted}
              delay={300}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

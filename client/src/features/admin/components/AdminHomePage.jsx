import { useState, useEffect } from "react";
import { Box, Typography, Skeleton, Grid } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import WorkIcon from "@mui/icons-material/Work";
import useCountUp from "@/hooks/useCountUp";
import { getPlatformStats } from "../api/adminApi";
import { formatRelativeTime } from "@/lib/formatRelativeTime";

const DARK = "#14431A";
const GREEN = "#1B5E20";
const BORDER = `3px solid ${DARK}`;
const SHADOW = `6px 6px 0px ${GREEN}`;

function Section({ title, accent, children }) {
  return (
    <Box sx={{ mb: 5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
        <Box
          sx={{
            width: 14,
            height: 14,
            bgcolor: accent,
            border: `2px solid ${DARK}`,
          }}
        />
        <Typography
          sx={{
            fontSize: "0.85rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            color: DARK,
          }}
        >
          {title}
        </Typography>
      </Box>
      <Box sx={{ border: "2px dashed #C8DFC9", p: { xs: 2, md: 3 } }}>
        {children}
      </Box>
    </Box>
  );
}

function GraphCard({ label, icon, color, periods, timelines, loading }) {
  const [selected, setSelected] = useState("week");
  const activePeriod = periods.find((p) => p.key === selected) || periods[0];
  const count = useCountUp(activePeriod.value, { duration: 700 });

  if (loading)
    return (
      <Skeleton variant="rectangular" height={300} sx={{ border: BORDER }} />
    );

  const chartData = timelines[selected] || [];
  const max = Math.max(...chartData.map((d) => d.count), 1);
  const showEveryLabel = chartData.length <= 12;

  return (
    <Box
      sx={{
        border: BORDER,
        boxShadow: SHADOW,
        bgcolor: "#FFFFFF",
        p: { xs: 2.5, md: 3.5 },
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          transform: "translate(-2px, -2px)",
          boxShadow: `9px 9px 0px ${GREEN}`,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2.5,
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              border: `2px solid ${DARK}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: DARK,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.3px",
              color: DARK,
            }}
          >
            {label}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 0.6, flexWrap: "wrap" }}>
          {periods.map((p) => (
            <Box
              key={p.key}
              onClick={() => setSelected(p.key)}
              sx={{
                cursor: "pointer",
                border: `2px solid ${DARK}`,
                px: 1.1,
                py: 0.4,
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                bgcolor: selected === p.key ? GREEN : "#FFFFFF",
                color: selected === p.key ? "#FFFFFF" : DARK,
                transition: "background-color 0.15s ease, color 0.15s ease",
                "&:hover": { bgcolor: selected === p.key ? GREEN : "#E8F5E9" },
              }}
            >
              {p.label}
            </Box>
          ))}
        </Box>
      </Box>

      <Typography
        sx={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: { xs: "2.6rem", md: "3.2rem" },
          fontWeight: 600,
          color: GREEN,
          lineHeight: 1,
          mb: 0.5,
        }}
      >
        {String(count).padStart(2, "0")}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.75rem",
          color: "#7A7267",
          mb: 3,
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {activePeriod.label}
      </Typography>

      <Box
        key={selected}
        sx={{
          display: "flex",
          alignItems: "flex-end",
          gap: chartData.length > 16 ? "2px" : "6px",
          height: 145,
        }}
      >
        {chartData.map((d, i) => (
          <Box
            key={`${d.label}-${i}`}
            sx={{
              flex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "center",
              "@media (hover: hover)": {
                "&:hover .bar-value-label": { opacity: 1 },
              },
            }}
          >
            <Typography
              className="bar-value-label"
              sx={{
                fontSize: "0.58rem",
                fontWeight: 700,
                color: DARK,
                fontFamily: '"IBM Plex Mono", monospace',
                mb: 0.3,
                lineHeight: 1,
                whiteSpace: "nowrap",
                "@media (hover: hover)": {
                  opacity: 0,
                  transition: "opacity 0.15s ease",
                },
                "@media (hover: none)": { opacity: 1 },
              }}
            >
              {d.count}
            </Typography>
            <Box
              sx={{
                width: "100%",
                height: `${Math.max((d.count / max) * 100, 4)}%`,
                bgcolor: d.count === 0 ? "#E8F5E9" : color,
                border: `1.5px solid ${DARK}`,
                transformOrigin: "bottom",
                animation:
                  "growUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) backwards",
                animationDelay: `${i * 0.02}s`,
                "@keyframes growUp": {
                  from: { transform: "scaleY(0)" },
                  to: { transform: "scaleY(1)" },
                },
              }}
            />
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: chartData.length > 16 ? "2px" : "6px",
          mt: 1,
        }}
      >
        {chartData.map((d, i) => (
          <Typography
            key={`${d.label}-label-${i}`}
            sx={{
              flex: 1,
              fontSize: "0.6rem",
              color: "#7A7267",
              textAlign: "center",
              visibility: showEveryLabel || i % 4 === 0 ? "visible" : "hidden",
            }}
          >
            {d.label}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

function RateBar({ label, value, max, loading }) {
  if (loading)
    return (
      <Skeleton
        variant="rectangular"
        height={80}
        sx={{ border: BORDER, mt: 2 }}
      />
    );
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <Box
      sx={{ border: `2px solid ${DARK}`, bgcolor: "#FFFFFF", p: 2.5, mt: 2 }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          mb: 1.5,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.8rem",
            fontWeight: 700,
            textTransform: "uppercase",
            color: DARK,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: "1.4rem",
            fontWeight: 600,
            color: GREEN,
          }}
        >
          {pct}%
        </Typography>
      </Box>
      <Box sx={{ display: "flex", height: 16, border: `2px solid ${DARK}` }}>
        <Box
          sx={{
            width: `${pct}%`,
            bgcolor: "#3D8361",
            transition: "width 0.6s ease",
          }}
        />
        <Box sx={{ flex: 1, bgcolor: "#E8F5E9" }} />
      </Box>
      <Typography sx={{ fontSize: "0.7rem", color: "#7A7267", mt: 1 }}>
        {value} of {max} jobs currently open
      </Typography>
    </Box>
  );
}

function RecentUsersCard({ users, loading }) {
  if (loading)
    return (
      <Skeleton variant="rectangular" height={260} sx={{ border: BORDER }} />
    );
  return (
    <Box sx={{ border: BORDER, boxShadow: SHADOW, bgcolor: "#FFFFFF", p: 2.5 }}>
      <Typography
        sx={{
          fontSize: "0.85rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.3px",
          color: DARK,
          mb: 2,
        }}
      >
        Recently joined
      </Typography>
      {users.length === 0 ? (
        <Typography sx={{ color: "#7A7267", fontSize: "0.85rem" }}>
          No users yet.
        </Typography>
      ) : (
        users.map((u, i) => (
          <Box
            key={u._id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1.2,
              borderBottom: i < users.length - 1 ? "2px solid #E8F5E9" : "none",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{ fontSize: "0.85rem", fontWeight: 600, color: DARK }}
              >
                {u.firstName} {u.lastName}
              </Typography>
              <Typography sx={{ fontSize: "0.72rem", color: "#7A7267" }}>
                {u.email}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  border: `2px solid ${DARK}`,
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: DARK,
                  px: 0.7,
                  py: 0.2,
                }}
              >
                {u.role}
              </Box>
              <Typography
                sx={{
                  fontSize: "0.68rem",
                  color: "#7A7267",
                  fontFamily: '"IBM Plex Mono", monospace',
                }}
              >
                {formatRelativeTime(u.createdAt)}
              </Typography>
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
}

function RecentJobsCard({ jobs, loading }) {
  if (loading)
    return (
      <Skeleton variant="rectangular" height={260} sx={{ border: BORDER }} />
    );
  return (
    <Box sx={{ border: BORDER, boxShadow: SHADOW, bgcolor: "#FFFFFF", p: 2.5 }}>
      <Typography
        sx={{
          fontSize: "0.85rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.3px",
          color: DARK,
          mb: 2,
        }}
      >
        Recently posted jobs
      </Typography>
      {jobs.length === 0 ? (
        <Typography sx={{ color: "#7A7267", fontSize: "0.85rem" }}>
          No jobs yet.
        </Typography>
      ) : (
        jobs.map((job, i) => (
          <Box
            key={job._id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1.2,
              borderBottom: i < jobs.length - 1 ? "2px solid #E8F5E9" : "none",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{ fontSize: "0.85rem", fontWeight: 600, color: DARK }}
              >
                {job.title}
              </Typography>
              <Typography sx={{ fontSize: "0.72rem", color: "#7A7267" }}>
                {job.recruiterId?.companyName || "Company"}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  bgcolor: job.status === "open" ? "#3D8361" : "#D8D3C7",
                  color: job.status === "open" ? "#FFFFFF" : "#6B6355",
                  border: `2px solid ${DARK}`,
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  px: 0.7,
                  py: 0.2,
                }}
              >
                {job.status}
              </Box>
              <Typography
                sx={{
                  fontSize: "0.68rem",
                  color: "#7A7267",
                  fontFamily: '"IBM Plex Mono", monospace',
                }}
              >
                {formatRelativeTime(job.createdAt)}
              </Typography>
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
}

const emptyEntity = {
  today: 0,
  week: 0,
  month: 0,
  pastYear: 0,
  thisYear: 0,
  total: 0,
  timelines: { today: [], week: [], month: [], pastYear: [], thisYear: [] },
};
const emptyStats = {
  candidates: emptyEntity,
  recruiters: emptyEntity,
  jobs: { ...emptyEntity, active: 0 },
  recentUsers: [],
  recentJobs: [],
};

export default function AdminHomePage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(emptyStats);

  useEffect(() => {
    getPlatformStats()
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  const periodsFor = (obj) => [
    { key: "today", label: "Today", value: obj.today },
    { key: "week", label: "This week", value: obj.week },
    { key: "month", label: "This month", value: obj.month },
    { key: "pastYear", label: "Past year", value: obj.pastYear },
    { key: "thisYear", label: "This year", value: obj.thisYear },
  ];

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        backgroundImage:
          "radial-gradient(rgba(27,94,32,0.28) 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{ px: { xs: 3, md: 5 }, py: { xs: 5, md: 8 }, textAlign: "center" }}
      >
        <Typography
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 800,
            fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.6rem" },
            color: DARK,
            textTransform: "uppercase",
          }}
        >
          Platform overview
        </Typography>
        <Typography sx={{ color: "#2F5A33", fontWeight: 500, mt: 1.5 }}>
          A snapshot of everything happening on LinkWurk.
        </Typography>
      </Box>

      <Box sx={{ px: { xs: 3, md: 5 }, pb: 6, maxWidth: 1000, mx: "auto" }}>
        <Section title="Recent activity" accent="#E3A008">
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <RecentUsersCard users={stats.recentUsers} loading={loading} />
            </Grid>
            <Grid item xs={12} md={6}>
              <RecentJobsCard jobs={stats.recentJobs} loading={loading} />
            </Grid>
          </Grid>
        </Section>

        <Section title="Candidates" accent="#66BB6A">
          <GraphCard
            label="Candidates"
            icon={<PeopleIcon />}
            color="#66BB6A"
            periods={periodsFor(stats.candidates)}
            timelines={stats.candidates.timelines}
            loading={loading}
          />
        </Section>

        <Section title="Recruiters" accent="#3D8361">
          <GraphCard
            label="Recruiters"
            icon={<BusinessCenterIcon />}
            color="#3D8361"
            periods={periodsFor(stats.recruiters)}
            timelines={stats.recruiters.timelines}
            loading={loading}
          />
        </Section>

        <Section title="Jobs">
          <GraphCard
            label="Jobs posted"
            icon={<WorkIcon />}
            color="#E3A008"
            periods={periodsFor(stats.jobs)}
            timelines={stats.jobs.timelines}
            loading={loading}
          />
          <RateBar
            label="Active job rate"
            value={stats.jobs.active}
            max={stats.jobs.total}
            loading={loading}
          />
        </Section>
      </Box>
    </Box>
  );
}

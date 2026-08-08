import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Skeleton, Button } from "@mui/material";
import ApplicantCard from "@/features/applications/components/ApplicantCard";
import InterviewScheduleDialog from "@/features/interviews/components/InterviewScheduleDialog";
import { getApplicantsForJob } from "@/features/applications/api/applicationsApi";

export default function ApplicantsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const loadApplicants = () => {
    setLoading(true);
    getApplicantsForJob(id)
      .then((res) => setApplications(res.data.applications))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadApplicants();
  }, [id]);

  const openScheduleDialog = (application) => {
    setSelectedApplication(application);
    setDialogOpen(true);
  };

  return (
    <Box sx={{ px: { xs: 3, md: 5 }, py: 6, maxWidth: 1100, mx: "auto" }}>
      <Button
        variant="text"
        sx={{ mb: 2 }}
        onClick={() => navigate("/recruiter/jobs")}
      >
        &larr; Back to jobs
      </Button>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Applicants
      </Typography>
      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <Skeleton variant="rounded" height={220} />
            </Grid>
          ))}
        </Grid>
      ) : applications.length === 0 ? (
        <Typography color="text.secondary">No applicants yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {applications.map((app) => (
            <Grid item xs={12} sm={6} key={app._id}>
              <ApplicantCard
                application={app}
                onStatusChanged={loadApplicants}
                onScheduleInterview={openScheduleDialog}
              />
            </Grid>
          ))}
        </Grid>
      )}
      <InterviewScheduleDialog
        open={dialogOpen}
        application={selectedApplication}
        onClose={() => setDialogOpen(false)}
        onScheduled={loadApplicants}
      />
    </Box>
  );
}

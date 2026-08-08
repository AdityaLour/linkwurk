import { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import JobForm from "@/features/recruiters/components/JobForm";
import JobPreviewCard from "@/features/recruiters/components/JobPreviewCard";

export default function JobFormPage() {
  const { id } = useParams();
  const [previewData, setPreviewData] = useState({
    title: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    isUnpaid: false,
    skillsRequired: [],
    experienceRequired: "Fresher",
    numberOfOpenings: 1,
    lastApplyDate: "",
  });

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        backgroundImage:
          "radial-gradient(rgba(27,94,32,0.28) 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        minHeight: "100%",
        px: { xs: 3, md: 5 },
        py: 6,
      }}
    >
      <Box sx={{ maxWidth: 1300, mx: "auto" }}>
        <Typography
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 800,
            fontSize: { xs: "1.6rem", md: "2rem" },
            color: "#14431A",
            textTransform: "uppercase",
            mb: 4,
          }}
        >
          {id ? "Edit job" : "Post a job"}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 4,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box sx={{ flex: { md: "1 1 65%" }, minWidth: 0 }}>
            <JobForm jobId={id} onFormDataChange={setPreviewData} />
          </Box>
          <Box
            sx={{
              flex: { md: "1 1 35%" },
              minWidth: 0,
              display: { xs: "none", md: "block" },
            }}
          >
            <JobPreviewCard formData={previewData} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

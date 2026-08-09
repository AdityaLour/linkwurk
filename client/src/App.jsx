import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelectPage from "@/pages/auth/RoleSelectorPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import LoginPage from "@/pages/auth/LoginPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import CompanyBasicsPage from "@/pages/recruiter/CompanyBasicsPage";
import CompanyBrandingPage from "@/pages/recruiter/CompanyBrandingPage";
import CandidateOnboardingSkillsPage from "@/pages/candidate/CandidateOnboardingSkillsPage";
import CandidateOnboardingResumePage from "@/pages/candidate/CandidateOnboardingResumePage";
import HomeRouter from "@/pages/HomeRouter";
import JobsListPage from "@/pages/JobsListPage";
import JobDetailPage from "@/pages/JobDetailPage";
import MainLayout from "@/components/MainLayout";
import RecruiterJobsPage from "@/pages/recruiter/RecruiterJobsPage";
import JobFormPage from "@/pages/recruiter/JobFormPage";
import ApplicantsPage from "@/pages/recruiter/ApplicantsPage";
import InterviewsPage from "@/pages/recruiter/InterviewsPage";
import MyApplicationsPage from "@/pages/candidate/MyApplicationsPage";
import SavedJobsPage from "@/pages/candidate/SavedJobsPage";
import CandidateInterviewsPage from "@/pages/candidate/CandidateInterviewsPage";
import ProfileRouter from "@/pages/ProfileRouter";
import VerifyEmailPage from "@/pages/VerifyEmailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRouter />} />
        <Route path="/signUp" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/role-select" element={<RoleSelectPage />} />
        <Route
          path="/applications"
          element={
            <ProtectedRoute allowedRole="candidate">
              <MainLayout>
                <MyApplicationsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-jobs"
          element={
            <ProtectedRoute allowedRole="candidate">
              <MainLayout>
                <SavedJobsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate/interviews"
          element={
            <ProtectedRoute allowedRole="candidate">
              <MainLayout>
                <CandidateInterviewsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <MainLayout>
              <JobsListPage />
            </MainLayout>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <MainLayout>
              <JobDetailPage />
            </MainLayout>
          }
        />

        <Route
          path="/recruiter/onboarding/company-info"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <CompanyBasicsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/onboarding/branding"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <CompanyBrandingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate/onboarding/skills"
          element={
            <ProtectedRoute allowedRole="candidate">
              <CandidateOnboardingSkillsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate/onboarding/resume"
          element={
            <ProtectedRoute allowedRole="candidate">
              <CandidateOnboardingResumePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/jobs"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <MainLayout>
                <RecruiterJobsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs/new"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <MainLayout>
                <JobFormPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs/:id/edit"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <MainLayout>
                <JobFormPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs/:id/applicants"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <MainLayout>
                <ApplicantsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/interviews"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <MainLayout>
                <InterviewsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileRouter />
            </ProtectedRoute>
          }
        />

        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

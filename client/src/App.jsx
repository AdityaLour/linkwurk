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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRouter />} />
        <Route path="/signUp" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/role-select" element={<RoleSelectPage />} />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelectPage from "@/pages/auth/RoleSelectorPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import LoginPage from "@/pages/auth/LoginPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import CompanyBasicsPage from "@/pages/recruiter/CompanyBasicsPage";
import CompanyBrandingPage from "@/pages/recruiter/CompanyBrandingPage";
import HomePage from "@/pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
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
        ;
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/MainLayout";
import CandidateProfilePage from "@/pages/candidate/CandidateProfilePage";
import RecruiterProfilePage from "@/pages/recruiter/RecruiterProfilePage";
import AdminProfilePage from "@/pages/admin/AdminProfilePage";

export default function ProfileRouter() {
  const { user } = useAuth();
  return (
    <MainLayout>
      {user?.role === "recruiter" ? (
        <RecruiterProfilePage />
      ) : user?.role === "admin" ? (
        <AdminProfilePage />
      ) : (
        <CandidateProfilePage />
      )}
    </MainLayout>
  );
}

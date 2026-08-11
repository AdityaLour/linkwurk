import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/MainLayout";
import HomePage from "./HomePage";
import CandidateHomePage from "@/features/candidates/components/CandidateHomePage";
import RecruiterHomePage from "@/features/recruiters/components/RecruiterHomePage";
import AdminHomePage from "@/features/admin/components/AdminHomePage";

export default function HomeRouter() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <MainLayout>
      {!user ? (
        <HomePage />
      ) : user.role === "candidate" ? (
        <CandidateHomePage />
      ) : user.role === "recruiter" ? (
        <RecruiterHomePage />
      ) : (
        <AdminHomePage />
      )}
    </MainLayout>
  );
}

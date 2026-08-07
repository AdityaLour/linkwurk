import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/MainLayout";
import HomePage from "./HomePage";
import CandidateHomePage from "@/features/candidates/components/CandidateHomePage";

export default function HomeRouter() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <MainLayout>
      {!user ? (
        <HomePage />
      ) : user.role === "candidate" ? (
        <CandidateHomePage />
      ) : (
        <div>Recruiter home — coming next</div>
      )}
    </MainLayout>
  );
}

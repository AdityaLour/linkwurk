import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refreshUser = () => {
    return api
      .get("/api/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  };

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleDeactivated = () => {
      setUser(null);
      navigate("/login?deactivated=true");
    };
    window.addEventListener("account-deactivated", handleDeactivated);
    return () =>
      window.removeEventListener("account-deactivated", handleDeactivated);
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

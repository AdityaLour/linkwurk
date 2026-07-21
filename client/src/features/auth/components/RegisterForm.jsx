import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { signUp, googleAuth } from "../api/authApi";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // no role in the URL means someone landed here directly, skipping the picker
  if (!role || !["candidate", "recruiter"].includes(role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p>Please choose a role first.</p>
        <button className="underline" onClick={() => navigate("/role-select")}>
          Go back
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signUp({ ...formData, role, authType: "email" });
      navigate("/"); // placeholder — will become role-based dashboard redirect later
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    try {
      await googleAuth({ idToken: credentialResponse.credential, role });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Google sign-up failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      <h1 className="text-2xl font-bold">Sign up as {role}</h1>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        <input
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />
        <input
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white rounded p-2"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <div className="text-sm text-gray-400">or</div>

      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => setError("Google sign-up failed")}
      />

      <p className="text-sm">
        Already have an account?{" "}
        <span
          className="underline cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}

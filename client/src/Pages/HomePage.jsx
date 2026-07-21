import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="Main">
      <h1>LinkWurk</h1>
      <button onClick={() => navigate("/login")}>Login</button>
      <button onClick={() => navigate("/role-select")}>Sign Up</button>
    </div>
  );
}

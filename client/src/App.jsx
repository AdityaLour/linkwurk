import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelectPage from "@/pages/auth/RoleSelectPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelectPage />} />
        <Route
          path="/register"
          element={<div>Register page — not built yet</div>}
        />
        <Route path="/login" element={<div>Login page — not built yet</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

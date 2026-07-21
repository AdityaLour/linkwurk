import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelectPage from "@/pages/auth/RoleSelectorPage";
import RegisterPage from "@/pages/auth/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelectPage />} />
        <Route path="/signUp" element={<RegisterPage />} />
        <Route path="/login" element={<div>Login page — not built yet</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

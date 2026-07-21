import { useNavigate } from "react-router-dom";

export default function RoleSelector() {
  const navigate = useNavigate();

  const roleSelect = (role) => {
    navigate(`/signUp?role=${role}`);
  };

  return (
    <div className="Main">
      <h1 className="heading">Continue As</h1>
      <div className="candidate">
        <button onClick={() => roleSelect("candidate")}>Candidate</button>
      </div>
      <div className="Recruiter">
        <button onClick={() => roleSelect("recruiter")}>Recruiter</button>
      </div>
    </div>
  );
}

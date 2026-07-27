import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateMyRecruiterProfile } from "../api/recruitersApi";

export default function CompanyBasicsForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    numberOfEmployees: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const saveAndContinue = async () => {
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    await updateMyRecruiterProfile(data);
    navigate("/recruiter/onboarding/branding");
  };

  return (
    <div>
      <h2>Company Basics</h2>
      <input
        name="companyName"
        placeholder="Company Name"
        value={formData.companyName}
        onChange={handleChange}
      />
      <input
        name="website"
        placeholder="Website"
        value={formData.website}
        onChange={handleChange}
      />
      <select
        name="numberOfEmployees"
        value={formData.numberOfEmployees}
        onChange={handleChange}
      >
        <option value="">Select size</option>
        <option value="1-10">1-10</option>
        <option value="11-50">11-50</option>
        <option value="51-200">51-200</option>
        <option value="201-500">201-500</option>
        <option value="500+">500+</option>
      </select>
      <button onClick={saveAndContinue}>Save & Continue</button>
      <button onClick={() => navigate("/recruiter/onboarding/branding")}>
        Skip
      </button>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateMyRecruiterProfile } from "../api/recruitersApi";

export default function CompanyBrandingForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ companyTagline: "", address: "" });
  const [profilePicture, setProfilePicture] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const finish = async () => {
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (profilePicture) data.append("profilePicture", profilePicture);
    if (companyLogo) data.append("companyLogo", companyLogo);
    await updateMyRecruiterProfile(data);
    navigate("/"); // → recruiter dashboard, once it exists
  };

  return (
    <div>
      <h2>Branding</h2>
      <input
        name="companyTagline"
        placeholder="Company Tagline"
        value={formData.companyTagline}
        onChange={handleChange}
      />
      <input
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
      />
      <label>
        Profile Picture:{" "}
        <input
          type="file"
          onChange={(e) => setProfilePicture(e.target.files[0])}
        />
      </label>
      <label>
        Company Logo:{" "}
        <input
          type="file"
          onChange={(e) => setCompanyLogo(e.target.files[0])}
        />
      </label>
      <button onClick={finish}>Finish</button>
      <button onClick={() => navigate("/")}>Skip</button>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function CreateJob() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    employment_type: "Full-time",
    salary_min: "",
    salary_max: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/jobs", formData);
      alert("✅ Job created successfully!");
      navigate("/jobs");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "❌ Failed to create job");
    }
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit} className="p-4 shadow-sm border rounded">
        <h2 className="mb-3 text-primary">Create Job</h2>
        <input name="title" className="form-control mb-2" placeholder="Title" onChange={handleChange} required />
        <textarea name="description" className="form-control mb-2" placeholder="Description" rows="3" onChange={handleChange} required />
        <input name="location" className="form-control mb-2" placeholder="Location" onChange={handleChange} required />
        <input name="employment_type" className="form-control mb-2" placeholder="Employment Type" value={formData.employment_type} onChange={handleChange} />
        <input name="salary_min" className="form-control mb-2" type="number" placeholder="Salary Min" onChange={handleChange} />
        <input name="salary_max" className="form-control mb-3" type="number" placeholder="Salary Max" onChange={handleChange} />
        <button type="submit" className="btn btn-success w-100">Create Job</button>
      </form>
    </div>
  );
}

// src/pages/Jobs/CreateJob.jsx
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
      await api.post("/jobs", formData); // backend POST /api/jobs
      alert("Job created successfully!");
      navigate("/jobs");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to create job");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Job</h2>
      <input name="title" placeholder="Title" onChange={handleChange} required />
      <input name="description" placeholder="Description" onChange={handleChange} required />
      <input name="location" placeholder="Location" onChange={handleChange} required />
      <input name="employment_type" placeholder="Employment Type" onChange={handleChange} />
      <input name="salary_min" type="number" placeholder="Salary Min" onChange={handleChange} />
      <input name="salary_max" type="number" placeholder="Salary Max" onChange={handleChange} />
      <button type="submit">Create Job</button>
    </form>
  );
}

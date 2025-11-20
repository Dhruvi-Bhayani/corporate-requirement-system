import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./CreateJob.css";

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
      alert("Job created successfully!");
      navigate("/jobs");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create job");
    }
  };

  return (
    <div className="create-job-page">
      <div className="create-job-card">
        <h2>Create Job</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Job Title"
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Job Description"
            rows="4"
            onChange={handleChange}
            required
          ></textarea>

          <input
            name="location"
            placeholder="Location"
            onChange={handleChange}
            required
          />

          <select
            name="employment_type"
            value={formData.employment_type}
            onChange={handleChange}
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>

          <div className="salary-row">
            <input
              type="number"
              name="salary_min"
              placeholder="Salary Min"
              onChange={handleChange}
            />

            <input
              type="number"
              name="salary_max"
              placeholder="Salary Max"
              onChange={handleChange}
            />
          </div>

          <button type="submit">Create Job</button>
        </form>
      </div>
    </div>
  );
}

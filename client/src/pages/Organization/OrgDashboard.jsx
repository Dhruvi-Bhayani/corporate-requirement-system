// src/pages/Org/OrgDashboard.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./OrgDashboard.css";

export default function OrgDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to load jobs", err);
    }
  };

  useEffect(() => {
    if (user) fetchJobs();
  }, [user]);

  return (
    <div className="org-dashboard-page">
      <h2 className="dashboard-heading">Your Organization Jobs</h2>

      <div className="dashboard-grid">
        {jobs.length === 0 && (
          <p className="no-jobs">No jobs posted yet.</p>
        )}

        {jobs.map((job) => (
          <div key={job.id} className="dashboard-job-card">

            {/* Title */}
            <h3 className="job-title">{job.title}</h3>

            {/* Location */}
            <p className="job-location">{job.location}</p>

            {/* Status */}
            <span
              className={`job-status ${
                job.status === "open" ? "status-open" : "status-closed"
              }`}
            >
              {job.status}
            </span>

            {/* Action Buttons */}
            <div className="dashboard-btn-group">
              <button
                className="view-btn"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                View
              </button>

              {job.status === "open" && (
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/jobs/edit/${job.id}`)}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import api from "../services/api";
import "./JobServices.css";

export default function JobServices() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/applications")
      .then((res) => setApplications(res.data))
      .catch((err) => console.error("Error fetching applications:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (applications.length === 0) return <p className="text-center mt-5">No applications found.</p>;

  return (
    <div className="apps-section">
      <h2 className="apps-heading">Your Applications</h2>

      <div className="apps-grid">
        {applications.map((app) => (
          <div key={app.id} className="app-card">
            
            {/* Card Header */}
            <div className="card-top">
              <h3 className="job-title">{app.Job.title}</h3>
              <p className="company">{app.Job.description}</p>
            </div>

            {/* Card Body */}
            <div className="card-body">
              <div className="row"><span className="label">Location:</span>{app.Job.location}</div>
              <div className="row"><span className="label">Type:</span>{app.Job.employment_type}</div>
              <div className="row">
                <span className="label">Salary:</span>
                ₹{app.Job.salary_min} - ₹{app.Job.salary_max}
              </div>
            </div>

            {/* Footer Badges */}
            <div className="card-footer">
              <span className={`badge job-badge ${app.Job.status === "open" ? "open" : "closed"}`}>
                Job: {app.Job.status}
              </span>

              <span className={`badge user-badge ${
                app.status === "applied" 
                  ? "applied" 
                  : app.status === "shortlisted" 
                  ? "shortlisted" 
                  : "other"
              }`}>
                You: {app.status}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

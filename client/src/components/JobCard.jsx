// src/components/JobCard.jsx
import { Link } from "react-router-dom";
import "./JobCard.css";

export default function JobCard({ job }) {
  return (
    <div className="glass-job-card">
      <div className="glass-job-header">
        <h3 className="glass-job-title">{job.title}</h3>

        <span className="glass-job-badge">
          {job.employment_type || "Full-time"}
        </span>
      </div>

      <p className="glass-job-location">{job.location || "Remote"}</p>

      <p className="glass-job-desc">
        {job.description?.substring(0, 80) || "No description"}...
      </p>

      <Link to={`/jobs/${job.id}`}>
        <button className="glass-job-btn">View →</button>
      </Link>
    </div>
  );
}

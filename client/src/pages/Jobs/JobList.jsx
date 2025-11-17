import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Button } from "react-bootstrap";
import "./JobList.css";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search") || "";

  useEffect(() => {
    setLoading(true);
    const endpoint =
      searchTerm.trim()
        ? `/jobs/search?q=${encodeURIComponent(searchTerm)}`
        : "/jobs";

    api
      .get(endpoint)
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [searchTerm]);

  const role = user?.role?.trim();
  const canCreateJob = ["org_admin", "hr", "manager"].includes(role);

  if (loading) return <p>Loading jobs...</p>;

  return (
    <div className="jobs-container container">

      <div className="header-row">
        <h2 className="jobs-heading">Available Jobs</h2>

        {canCreateJob && (
          <Button className="new-job-btn" onClick={() => navigate("/jobs/create")}>
            + New Job
          </Button>
        )}
      </div>

      {jobs.length === 0 && <p className="no-jobs">No jobs found.</p>}

      <div className="jobs-grid">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            
            {/* ⭐ FIX: Content wrapper to push button down */}
            <div className="job-card-content">
              <h4 className="job-title">{job.title}</h4>
              <p className="job-location">{job.location}</p>
            </div>

            <button
              className="details-btn"
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              View Details →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

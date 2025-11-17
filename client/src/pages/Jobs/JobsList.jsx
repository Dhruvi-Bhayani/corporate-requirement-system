import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Button } from "react-bootstrap";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search") || "";

  // -----------------------------
  // FIXED: Only ONE useEffect
  // -----------------------------
  useEffect(() => {
    setLoading(true);

    const endpoint = searchTerm
      ? `/jobs/search?q=${encodeURIComponent(searchTerm)}`
      : "/jobs";

    api
      .get(endpoint)
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [searchTerm]);

  // Debug logs
  console.log("User Role:", user?.role);

  const role = user?.role?.trim();
  const canCreateJob = role && ["org_admin", "hr", "manager"].includes(role);

  if (loading) return <p>Loading jobs...</p>;
  if (jobs.length === 0) return <p>No jobs found.</p>;

  return (
    <div className="container mt-2">


      {/* Header + Create Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Available Jobs</h2>

        {canCreateJob && (
          <Button variant="primary" onClick={() => navigate("/jobs/create")}>
            + New Job
          </Button>
        )}
      </div>

      {/* Jobs List */}
      <ul className="list-group">
        {jobs.map((job) => (
          <li key={job.id} className="list-group-item">
            <Link to={`/jobs/${job.id}`}>
              {job.title} - {job.location}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

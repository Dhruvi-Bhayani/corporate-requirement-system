// src/pages/Org/OrgDashboard.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function OrgDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      // ⭐ FIX — DO NOT USE orgId in query
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
    <div className="container mt-4">
      <h2>Your Organization Jobs</h2>

      {jobs.length === 0 && <p className="mt-3">No jobs posted yet.</p>}

      {jobs.length > 0 && (
        <Table bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.id}</td>
                <td>{job.title}</td>
                <td>{job.location}</td>

                <td>
                  {job.status === "closed" ? (
                    <span className="badge bg-danger">Closed</span>
                  ) : (
                    <span className="badge bg-success">Open</span>
                  )}
                </td>

                <td>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="me-2"
                  >
                    View
                  </Button>

                  {job.status === "open" && (
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => navigate(`/jobs/edit/${job.id}`)}
                    >
                      Edit
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

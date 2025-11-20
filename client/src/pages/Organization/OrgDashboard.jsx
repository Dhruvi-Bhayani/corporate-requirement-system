// src/pages/Org/OrgDashboard.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Button, Table } from "react-bootstrap";

export default function OrgDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const res = await api.get(`/jobs?orgId=${user.orgId}`);
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to load jobs", err);
    }
  };

  useEffect(() => {
    if (user?.orgId) fetchJobs();
  }, [user]);

  return (
    <div className="container mt-4">
      <h2>Your Organization Jobs</h2>

      {jobs.length === 0 && (
        <p className="mt-3">No jobs posted yet.</p>
      )}

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
                  {job.is_closed ? (
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

                  {!job.is_closed && (
                    <Button
                      size="sm"
                      variant="danger"
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

import { useState, useEffect } from "react";
import api from "../services/api";

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
    <div className="container mt-5">
      <h2 className="text-primary mb-4 text-center">Your Applications</h2>

      <div className="row">
        {applications.map((app) => (
          <div key={app.id} className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">

                <h4 className="card-title text-primary">{app.Job.title}</h4>
                <p className="card-text text-muted">{app.Job.description}</p>

                <p><strong>Location:</strong> {app.Job.location}</p>
                <p><strong>Employment Type:</strong> {app.Job.employment_type}</p>
                <p><strong>Salary:</strong> ₹{app.Job.salary_min} - ₹{app.Job.salary_max}</p>

                <div className="mt-3">
                  <span className="badge bg-info me-2">
                    Job Status: {app.Job.status}
                  </span>

                  <span className="badge bg-success">
                    Your Status: {app.status}
                  </span>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

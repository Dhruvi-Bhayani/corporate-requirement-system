// src/pages/Jobs/JobDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Button } from "react-bootstrap";
import ApplyModal from "../../components/ApplyModal";
import { useAuth } from "../../context/AuthContext";
import "./JobDetail.css";
import AuthPopup from "../Auth/AuthPopup";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showApply, setShowApply] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    api
      .get(`/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch((err) => {
        if (err.response?.status === 404) setError("Job not found.");
        else setError("Failed to load job.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // APPLY BUTTON LOGIC
  const handleApplyClick = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setShowApply(true);
  };

  const closeJob = async () => {
    if (!window.confirm("Are you sure you want to close this job?")) return;

    try {
      await api.patch(`/jobs/${job.id}/close`);
      alert("Job closed successfully!");
      navigate("/org/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to close job");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <>
      <div className={`job-detail-page ${showApply ? "bg-blur" : ""}`}>

        <div className="job-detail-card">

          {/* ⭐ GLASS BACK BUTTON FOR EVERYONE */}
          <button className="job-back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <div className="d-flex gap-2 mt-3 mb-3">

            {(user?.role === "org_admin" || user?.role === "hr" || user?.role === "manager") && (
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/org/job/${job.id}/applications`)}
              >
                View Applicants
              </button>
            )}

            {(user?.role === "org_admin" || user?.role === "hr" || user?.role === "manager") && (
              <button
                className="btn btn-warning"
                onClick={() => navigate(`/jobs/edit/${job.id}`)}
              >
                Edit Job
              </button>
            )}

            {(user?.role === "org_admin" || user?.role === "hr" || user?.role === "manager") && (
              <button
                className="btn btn-danger"
                onClick={closeJob}
              >
                Close Job
              </button>
            )}

          </div>

          <h2 className="job-title mt-3">{job.title}</h2>

          <p className="job-meta mt-3">
            <span>{job.location}</span>
            <span className="job-type-tag">{job.employment_type}</span>
          </p>

          <div className="job-info">
            <p><strong>Status:</strong> {job.status}</p>
            <p><strong>Salary:</strong> ₹{job.salary_min} - ₹{job.salary_max}</p>
            <p><strong>Posted:</strong> {new Date(job.posted_at).toLocaleDateString()}</p>
          </div>

          <hr />

          <h4 className="desc-title">Job Description</h4>
          <p className="desc-text">{job.description}</p>

          {/* ⭐ APPLY BUTTON — visible for everyone when job is open */}
          {job.status === "open" && (
            <div className="apply-box">
              <Button className="apply-btn" onClick={handleApplyClick}>
                Apply Now
              </Button>
            </div>
          )}

          {job.status === "closed" && (
            <div className="apply-box">
              <button
                className="apply-btn"
                disabled
                style={{ opacity: 0.4, cursor: "not-allowed" }}
              >
                Job Closed
              </button>
            </div>
          )}

        </div>
      </div>

      <ApplyModal
        show={showApply}
        onHide={() => setShowApply(false)}
        jobId={job.id}
      />

      <AuthPopup
        show={showLogin}
        onClose={() => setShowLogin(false)}
        mode="login"
      />
    </>
  );
}

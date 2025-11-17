// src/pages/Jobs/JobDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Button } from "react-bootstrap";
import ApplyModal from "../../components/ApplyModal";
import { useAuth } from "../../context/AuthContext";
import "./JobDetail.css";   // ⭐ IMPORT CSS

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showApply, setShowApply] = useState(false);

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

  const handleApplyClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowApply(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <>
      <div className="job-detail-page">
        <div className="job-detail-card">

          <h2 className="job-title">{job.title}</h2>

          <p className="job-meta">
            <span>{job.location}</span>

            <span className="job-type-tag">
              {job.employment_type}
            </span>
          </p>

          <div className="job-info">
            <p><strong>Status:</strong> {job.status}</p>
            <p><strong>Salary:</strong> ₹{job.salary_min} - ₹{job.salary_max}</p>
            <p><strong>Posted:</strong> {new Date(job.posted_at).toLocaleDateString()}</p>
          </div>

          <hr />

          <h4 className="desc-title">Job Description</h4>
          <p className="desc-text">{job.description}</p>

          <div className="apply-box">
            <Button className="apply-btn" onClick={handleApplyClick}>
              Apply Now
            </Button>
          </div>

        </div>
      </div>

      <ApplyModal
        show={showApply}
        onHide={() => setShowApply(false)}
        jobId={job.id}
      />
    </>
  );
}

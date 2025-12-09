// src/pages/Jobs/JobDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Button } from "react-bootstrap";
import ApplyModal from "../../components/ApplyModal";
import { useAuth } from "../../context/AuthContext";
import AuthPopup from "../Auth/AuthPopup";
import { toast } from "react-toastify";
import "./JobDetail.css";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showApply, setShowApply] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // ----------------------------------------------------
  // FETCH JOB DETAILS
  // ----------------------------------------------------
  useEffect(() => {
    api
      .get(`/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch((err) => {
        if (err.response?.status === 404) {
          setError("Job not found.");
        } else if (err.response?.status === 403) {
          setError(err.response?.data?.error || "You cannot view this job.");
        } else {
          setError("Failed to load job.");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  // ----------------------------------------------------
  // APPLY BUTTON CLICK
  // ----------------------------------------------------
  const handleApplyClick = () => {
    if (!user) return setShowLogin(true);
    if (user.role !== "job_seeker") return;

    setShowApply(true);
  };

  // ----------------------------------------------------
  // CLOSE JOB
  // ----------------------------------------------------
  const closeJob = async () => {
    if (!window.confirm("Are you sure you want to close this job?")) return;

    try {
      await api.patch(`/jobs/${job.id}/close`);
      toast.success("Job closed!");
      navigate("/org/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to close job");
    }
  };

  // ----------------------------------------------------
  // REOPEN JOB
  // ----------------------------------------------------
  const handleReopenJob = async () => {
    try {
      await api.patch(`/jobs/${job.id}/reopen`);
      toast.success("Job reopened successfully!");
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to reopen job");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  const isOrgUser = ["org_admin", "hr", "manager", "recruiter"].includes(
    user?.role
  );

  return (
    <>
      <div className={`job-detail-page ${showApply ? "bg-blur" : ""}`}>
        <div className="job-detail-card">
          {/* BACK BUTTON */}
          <button className="job-back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>

          {/* ADMIN BUTTONS */}
          <div className="d-flex gap-2 mt-3 mb-3">
            {isOrgUser && (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate(`/org/job/${job.id}/applications`)
                  }
                >
                  View Applicants
                </button>

                <button
                  className="btn btn-warning"
                  onClick={() => navigate(`/jobs/edit/${job.id}`)}
                >
                  Edit Job
                </button>

                {job.status === "open" && (
                  <button className="btn btn-danger" onClick={closeJob}>
                    Close Job
                  </button>
                )}

                {job.status === "closed" && (
                  <button className="btn btn-success" onClick={handleReopenJob}>
                    Reopen Job
                  </button>
                )}
              </>
            )}
          </div>

          {/* TITLE */}
          <h2 className="job-title mt-3">{job.title}</h2>

          {/* META */}
          <p className="job-meta mt-3">
            <span>{job.location}</span>
            <span className="job-type-tag">{job.employment_type}</span>
          </p>

          {/* JOB INFO */}
          <div className="job-info">
            <p>
              <strong>Status:</strong> {job.status}
            </p>
            <p>
              <strong>Salary:</strong> ₹{job.salary_min} - ₹{job.salary_max}
            </p>
            <p>
              <strong>Posted:</strong>{" "}
              {new Date(job.posted_at).toLocaleDateString()}
            </p>
          </div>

          <hr />

          {/* DESCRIPTION */}
          <h4 className="desc-title">Job Description</h4>
          <p className="desc-text">{job.description}</p>

          {/* APPLY BUTTON - ONLY JOB SEEKER OR GUEST */}
          {job.status === "open" &&
            (!user || user.role === "job_seeker") && (
              <div className="apply-box">
                <Button className="apply-btn" onClick={handleApplyClick}>
                  Apply Now
                </Button>
              </div>
            )}

          {/* CLOSED JOB */}
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

      {/* APPLY MODAL */}
      <ApplyModal
        show={showApply}
        onHide={() => setShowApply(false)}
        jobId={job.id}
      />

      {/* LOGIN POPUP */}
      <AuthPopup
        show={showLogin}
        onClose={() => setShowLogin(false)}
        mode="login"
      />
    </>
  );
}

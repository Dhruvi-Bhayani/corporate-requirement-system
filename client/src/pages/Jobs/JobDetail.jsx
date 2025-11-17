import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Button } from "react-bootstrap";
import ApplyModal from "../../components/ApplyModal";
import { useAuth } from "../../context/AuthContext";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showApply, setShowApply] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");

    api
      .get(`/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch((err) => {
        if (err.response?.status === 404) setError("Job not found.");
        else setError("Failed to load job. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleApplyClick = () => {
    if (!user) {
      navigate("/login"); // 🔥 redirect if not logged in
      return;
    }
    setShowApply(true); // open modal if logged in
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <>
      <h2>{job.title}</h2>
      <p className="text-muted">
        {job.location} • {job.employment_type}
      </p>
      <div className="mb-4">{job.description}</div>

      <Button onClick={handleApplyClick}>Apply Now</Button>

      <ApplyModal
        show={showApply}
        onHide={() => setShowApply(false)}
        jobId={job.id}
      />
    </>
  );
}

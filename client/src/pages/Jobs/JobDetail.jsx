// src/pages/Jobs/JobDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { Button } from "react-bootstrap";
import ApplyModal from "../../components/ApplyModal";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showApply, setShowApply] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .get(`/jobs/${id}`)
      .then(res => {
        setJob(res.data);
      })
      .catch(err => {
        if (err.response?.status === 404) {
          setError("Job not found.");
        } else {
          setError("Failed to load job. Please try again later.");
        }
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <>
      <h2>{job.title}</h2>
      <p className="text-muted">{job.location} • {job.employment_type}</p>
      <div className="mb-4">{job.description}</div>

      <Button onClick={() => setShowApply(true)}>Apply Now</Button>

      <ApplyModal show={showApply} onHide={() => setShowApply(false)} jobId={job.id} />
    </>
  );
}

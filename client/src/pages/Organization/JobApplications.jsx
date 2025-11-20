import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "./JobApplications.css";

export default function JobApplications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load applications");
    }
    setLoading(false);
  };

  const updateStatus = async (id, status, extra = {}) => {
    try {
      await api.put(`/applications/${id}/status`, {
        status,
        note: extra.note || "",
        interview_at: extra.interview_at || null
      });

      fetchApplications();
      toast.success("Status updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const openInterviewModal = (app) => {
    setSelectedApp(app);
    setShowInterviewModal(true);
  };

  const scheduleInterview = () => {
    if (!interviewDate) return toast.error("Select interview date/time");

    updateStatus(selectedApp.id, "interview_scheduled", {
      interview_at: interviewDate,
      note
    });

    setShowInterviewModal(false);
  };

  if (loading) return <p>Loading applications...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 job-application-title">Applicants for this Job</h2>

      {applications.length === 0 && <p>No applications yet.</p>}

      {applications.map((app) => (
        <div key={app.id} className="applicant-card">

          <h5>{app.User.full_name}</h5>
          <p>Email: {app.User.email}</p>

          <p>
            <strong>Status:</strong>{" "}
            <span className="status-badge">{app.status}</span>
          </p>

          <p>
            <strong>Resume:</strong>{" "}
            <a className="resume-link" href={app.resume_url} target="_blank" rel="noreferrer">
              View Resume
            </a>
          </p>

          <div className="d-flex gap-2 mt-3 applicant-actions">
            <Button variant="secondary" onClick={() => updateStatus(app.id, "screening")}>
              Screening
            </Button>

            <Button variant="primary" onClick={() => updateStatus(app.id, "shortlisted")}>
              Shortlist
            </Button>

            <Button variant="warning" onClick={() => openInterviewModal(app)}>
              Schedule Interview
            </Button>

            <Button variant="success" onClick={() => updateStatus(app.id, "selected")}>
              Select
            </Button>

            <Button variant="danger" onClick={() => updateStatus(app.id, "rejected")}>
              Reject
            </Button>
          </div>

          {/* STATUS HISTORY */}
          <p className="history-title mt-3">Status History:</p>

          {app.status_history && app.status_history.length > 0 ? (
            <div className="history-box">
              <ul className="mt-2">
                {app.status_history.map((h, i) => (
                  <li key={i}>
                    <strong>{h.to.toUpperCase()}</strong> — {new Date(h.at).toLocaleString()}
                    <br />
                    by: {h.by_name}
                    <br />
                    {h.note && <em>Note: {h.note}</em>}
                    <hr />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No history recorded.</p>
          )}

        </div>
      ))}

      {/* INTERVIEW MODAL */}
      <Modal
        show={showInterviewModal}
        onHide={() => setShowInterviewModal(false)}
        centered
        className="interview-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Schedule Interview</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Date & Time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Note (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={note}
              placeholder="Add a note..."
              onChange={(e) => setNote(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button className="btn-cancel" onClick={() => setShowInterviewModal(false)}>
            Cancel
          </Button>

          <Button className="btn-save" onClick={scheduleInterview}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

// src/components/ApplyModal.jsx
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import api from "../services/api";

export default function ApplyModal({ show, onHide, jobId }) {
  const [cover, setCover] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/applications/apply", {
        jobId,
        cover_letter: cover,
        resume_url: resumeUrl
      });
      alert("Applied successfully");
      onHide();
    } catch (err) {
      alert(err.response?.data?.error || "Apply failed");
    } finally { setLoading(false); }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Form onSubmit={handleApply}>
        <Modal.Header closeButton><Modal.Title>Apply for job</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Cover Letter</Form.Label>
            <Form.Control as="textarea" rows={4} value={cover} onChange={e=>setCover(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Resume URL (optional)</Form.Label>
            <Form.Control value={resumeUrl} onChange={e=>setResumeUrl(e.target.value)} placeholder="Paste resume link or upload first" />
            <Form.Text className="text-muted">If you have server upload, upload and paste link here.</Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={loading}>{loading? 'Applying...':'Apply'}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

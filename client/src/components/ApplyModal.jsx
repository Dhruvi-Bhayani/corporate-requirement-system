import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import api from "../services/api";
import { toast } from "react-toastify";   // ⭐ ADD THIS
import "./ApplyModal.css";

export default function ApplyModal({ show, onHide, jobId }) {
  const [cover, setCover] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  // ⭐ Upload Resume file
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setSelectedFileName(file.name);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await api.post("/upload/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResumeUrl(res.data.fileUrl);
      toast.success("Resume uploaded successfully!");
    } catch (err) {
      toast.error("Upload failed. Only PDF/JPG/PNG allowed.");
    }

    setUploading(false);
  };

  // ⭐ Submit Application
  const handleApply = async (e) => {
    e.preventDefault();

    if (!resumeUrl) {
      toast.error("Please upload your resume first!");
      return;
    }

    try {
      setLoading(true);

      await api.post("/applications", {
        jobId,
        cover_letter: cover,
        resume_url: resumeUrl,
      });

      toast.success("Applied successfully!");
      onHide();
    } catch (err) {
      toast.error(err.response?.data?.error || "Application failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdropClassName="modal-backdrop">
      <Form onSubmit={handleApply}>
        <div className="apply-glass-box">
          
          {/* HEADER */}
          <div className="modal-header-custom">
            <h4>Apply for Job</h4>
          </div>

          {/* BODY */}
          <div className="modal-body">

            {/* Cover Letter */}
            <label className="form-label-custom">Cover Letter</label>
            <textarea
              className="input-box"
              rows="4"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              placeholder="Write your cover letter..."
            />

            {/* Resume Upload */}
            <label className="form-label-custom mt-3">Upload Resume (PDF/JPG/PNG)</label>

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="input-box"
              onChange={handleResumeUpload}
            />

            {uploading && <p className="hint-text">Uploading...</p>}

            {selectedFileName && !uploading && (
              <p className="hint-text">✔ Uploaded: {selectedFileName}</p>
            )}

          </div>

          {/* FOOTER */}
          <div className="modal-footer-custom">
            <Button type="button" variant="secondary" onClick={onHide}>
              Cancel
            </Button>

            <Button type="submit" variant="primary" disabled={loading || uploading}>
              {loading ? "Applying..." : "Apply"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
}

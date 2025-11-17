// src/pages/Org/OrgDashboard.jsx
import { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function OrgDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', location: '', employment_type: 'Full-time' });

  const fetchJobs = () => {
    api.get(`/jobs?orgId=${user.orgId}`)
      .then(res => setJobs(res.data))
      .catch(err => console.error(err));
  };

  useEffect(fetchJobs, [user]);

  const createJob = async (e) => {
    e.preventDefault();
    try {
      await api.post("/jobs", { ...form });
      setShowCreate(false);
      fetchJobs();
    } catch (err) { alert(err.response?.data?.error || "Create failed"); }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Your Organization Jobs</h2>
        <Button onClick={() => setShowCreate(true)}>Post Job</Button>
      </div>

      <Table bordered hover>
        <thead><tr><th>ID</th><th>Title</th><th>Location</th><th>Type</th><th>Actions</th></tr></thead>
        <tbody>
          {jobs.map(j => (
            <tr key={j.id}>
              <td>{j.id}</td>
              <td>{j.title}</td>
              <td>{j.location}</td>
              <td>{j.employment_type}</td>
              <td>
                <Button size="sm" variant="outline-primary" className="me-2">View</Button>
                <Button size="sm" variant="outline-danger">Close</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showCreate} onHide={() => setShowCreate(false)}>
        <Form onSubmit={createJob}>
          <Modal.Header closeButton><Modal.Title>Create Job</Modal.Title></Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-2"><Form.Label>Title</Form.Label><Form.Control value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Location</Form.Label><Form.Control value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Type</Form.Label><Form.Select value={form.employment_type} onChange={e => setForm({ ...form, employment_type: e.target.value })}>
              <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
            </Form.Select></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

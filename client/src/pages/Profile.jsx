// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import api from "../services/api";

export default function Profile() {
  const [profile, setProfile] = useState({ headline: '', summary: '', resume_url: '' });

  useEffect(() => {
    api.get("/profiles/me").then(res => setProfile(res.data)).catch(() => { });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/profiles", profile).then(() => alert("Saved"));
  };

  return (
    <Card style={{ maxWidth: 800 }} className="mx-auto p-3">
      <h3>Profile</h3>
      <Form onSubmit={submit}>
        <Form.Group className="mb-2"><Form.Label>Headline</Form.Label><Form.Control value={profile.headline} onChange={e => setProfile({ ...profile, headline: e.target.value })} /></Form.Group>
        <Form.Group className="mb-2"><Form.Label>Summary</Form.Label><Form.Control as="textarea" rows={4} value={profile.summary} onChange={e => setProfile({ ...profile, summary: e.target.value })} /></Form.Group>
        <Form.Group className="mb-2"><Form.Label>Resume URL</Form.Label><Form.Control value={profile.resume_url} onChange={e => setProfile({ ...profile, resume_url: e.target.value })} /></Form.Group>
        <Button type="submit">Save</Button>
      </Form>
    </Card>
  );
}

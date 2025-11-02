// src/pages/Seeker/SeekerDashboard.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Table } from "react-bootstrap";

export default function SeekerDashboard(){
  const [apps, setApps] = useState([]);

  useEffect(() => {
    api.get("/applications/my")
      .then(res => setApps(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <h2>My Applications</h2>
      <Table bordered>
        <thead><tr><th>Job</th><th>Status</th><th>Applied At</th></tr></thead>
        <tbody>
          {apps.map(a => (
            <tr key={a.id}>
              <td>{a.Job?.title || a.job_id}</td>
              <td>{a.status}</td>
              <td>{new Date(a.applied_at || a.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

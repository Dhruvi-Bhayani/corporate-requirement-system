// src/pages/Jobs/JobsList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get("/jobs")
      .then(res => setJobs(res.data))
      .catch(err => console.error(err));
  }, []);

  if (jobs.length === 0) return <p>Loading jobs...</p>;

  return (
    <div>
      <h2>Available Jobs</h2>
      <ul>
        {jobs.map(job => (
          <li key={job.id}>
            <Link to={`/jobs/${job.id}`}>{job.title} - {job.location}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

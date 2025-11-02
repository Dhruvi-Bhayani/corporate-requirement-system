// src/pages/Home.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import JobCard from "../components/JobCard";

export default function Home(){
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get("/jobs")
      .then(res => setJobs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <h1 className="mb-4">Open Roles</h1>
      {jobs.length ? jobs.map(job => <JobCard job={job} key={job.id} />)
                : <p>No open roles yet.</p>}
    </>
  );
}

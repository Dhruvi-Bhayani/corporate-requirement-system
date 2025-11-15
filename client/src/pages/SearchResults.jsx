// src/pages/SearchResults.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import JobCard from "../components/JobCard";

export default function SearchResults() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const q = params.get("q") || "";
  const loc = params.get("loc") || "";

  useEffect(() => {
    setLoading(true);

    // Use backend search endpoint
    const endpoint = `/jobs/search?q=${encodeURIComponent(q)}&loc=${encodeURIComponent(loc)}`;

    api.get(endpoint)
      .then((res) => {
        // backend returns an array
        setJobs(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Search error:", err);
        setJobs([]);
      })
      .finally(() => setLoading(false));
  }, [q, loc]);

  return (
    <div className="container mt-4">
      <h2>Search Results {q || loc ? <>for “{q}” {loc && <>in {loc}</>}</> : ""}</h2>

      {loading ? (
        <p>Loading...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div className="row">
          {jobs.map((job) => (
            <div className="col-md-4 mb-4" key={job.id}>
              <JobCard job={job} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

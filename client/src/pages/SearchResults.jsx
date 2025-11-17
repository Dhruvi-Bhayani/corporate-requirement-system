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

    {jobs.length > 0 && (
      <h2 className="mb-4">
        Search Results for “{q}”
      </h2>
    )}

    {loading ? (
      <p>Loading...</p>
    ) : jobs.length === 0 ? (
      <div className="text-center mt-5">
        <img
          src="/nodatafound.png"
          alt="No results"
          style={{ maxWidth: "300px", opacity: 0.85 }}
        />
        <p className="mt-3 text-muted fs-5">No jobs found.</p>
        {/* 🔙 Back Button */}
        <button
          className="btn btn-outline-primary mb-3"
          onClick={() => window.history.back()}
        >
          ← Back
        </button>
      </div>
    ) : (
      <div className="row mt-4">
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

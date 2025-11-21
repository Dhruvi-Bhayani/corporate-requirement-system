// src/pages/SearchResults.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import JobCard from "../components/JobCard";
import "./SearchResults.css";

export default function SearchResults() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const q = params.get("q") || "";
  const loc = params.get("loc") || "";

  useEffect(() => {
    setLoading(true);

    const endpoint = `/jobs/search?q=${encodeURIComponent(q)}&loc=${encodeURIComponent(loc)}`;

    api
      .get(endpoint)
      .then((res) => {
        setJobs(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, [q, loc]);

  return (
    <div className="search-results-container">

      {/* Heading */}
      <h2 className="search-heading">
        Search Results for “{q}”
      </h2>

      {/* Loading */}
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : jobs.length === 0 ? (

        /* ⭐ NO RESULTS CARD */
        <div className="no-results-box">
          <div className="no-results-glass">
            <img src="/nodatafound.png" alt="No results" className="no-results-img" />
            <h3 className="no-results-title">No jobs found</h3>

            <p className="no-results-text">
              We couldn’t find any jobs that match your search term.
              <br />
              Try adjusting your keywords or filters.
            </p>

            <button
              onClick={() => window.location.href = "/jobs"}
              className="no-results-btn"
            >
              ← Back to Jobs
            </button>
          </div>
        </div>

      ) : (

        /* ⭐ FIXED GRID WITH WRAPPER (same look as Jobs page) */
        <div className="search-grid">
          {jobs.map((job) => (
            <div key={job.id} className="search-card-wrapper">
              <JobCard job={job} />
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

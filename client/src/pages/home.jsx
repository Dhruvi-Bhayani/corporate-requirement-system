// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import StatsSection from "../components/StatsSection";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  }, []);

  const doSearch = (q = query, loc = location) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (loc) params.set("loc", loc);
    navigate(`/search?${params.toString()}`);
  };

  const popularTags = ["Frontend Developer", "Product Manager", "Data Scientist", "UX Designer", "DevOps Engineer"];

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Find Your Dream Career</h1>

      {/* Search block */}
      <div className="card p-4 mb-4 shadow-sm">
        <div className="row g-2">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Job title, keywords, or company..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Location or remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="col-md-2 d-grid">
            <button className="btn btn-gradient" onClick={() => doSearch()}>
              Search Jobs
            </button>
          </div>
        </div>

        <div className="mt-3">
          <small className="text-muted me-2">Popular:</small>
          {popularTags.map((tag) => (
            <button
              key={tag}
              className="btn btn-sm btn-outline-secondary me-2 mb-2"
              onClick={() => {
                setQuery(tag);
                doSearch(tag, "");
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      <StatsSection />

    </div>
  );
}

// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import StatsSection from "../components/StatsSection";
import ImageSlider from "../components/ImageSlider";

import "./Home.css"; // ⭐ CSS import

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  }, []);

  const doSearch = (q = query, loc = location) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (loc) params.set("loc", loc);
    navigate(`/search?${params.toString()}`);
  };

  const popularTags = [
    "Frontend Developer",
    "Product Manager",
    "Data Scientist",
    "UX Designer",
    "DevOps Engineer",
  ];

  return (
    <div className="container mt-4">
      {/* ⭐ Gradient Heading */}
      <h1 className="hero-title mb-4 text-center">Find Your Dream Career</h1>

      {/* ⭐ Search Card (Glass UI) */}
      <div className="search-card p-4 mb-4 shadow-sm">

        {/* ⭐ FORM → Allows Enter key to trigger search */}
        <form
          onSubmit={(e) => {
            e.preventDefault(); // stop page reload
            doSearch(); // trigger search
          }}
        >
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
              <button type="submit" className="btn btn-gradient">
                Search Jobs
              </button>
            </div>
          </div>
        </form>

        {/* ⭐ Popular tags */}
        <div className="mt-3 popular-wrapper">
          <small className="text-muted me-2">Popular:</small>

          {popularTags.map((tag) => (
            <button
              key={tag}
              className="popular-tag"
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

      {/* Stats Section */}
      <StatsSection />
      {/* Image Slider */}
      <ImageSlider />


    </div>
  );
}

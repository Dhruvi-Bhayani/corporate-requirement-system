// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import StatsSection from "../components/StatsSection";
import ImageSlider from "../components/ImageSlider";

import "./HomeFeedback.css";
import "./Home.css"; // ⭐ CSS import

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [homeFeedback, setHomeFeedback] = useState([]); // ⭐ NEW
  const navigate = useNavigate();

  // ⭐ Load jobs
  useEffect(() => {
    api
      .get("/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ⭐ Load latest 2 feedbacks
  useEffect(() => {
    fetch("http://localhost:3000/api/feedback/latest")
      .then((res) => res.json())
      .then((data) => setHomeFeedback(data.data))
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            doSearch();
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

      {/* ⭐ Stats Section */}
      <StatsSection />

      {/* ⭐ Image Slider */}
      <ImageSlider />

      {/* ⭐ BEAUTIFUL FEEDBACK PREVIEW SECTION */}
      <div className="container mt-5 mb-5">

        <h2
          className="text-center mb-4 feedback-animate"
          style={{
            color: "white",
            fontSize: "32px",
            fontWeight: "700",
            textShadow: "0 0 12px rgba(255, 255, 255, 0.9)", // FIXED
          }}
        >
          What Our Users Say
        </h2>

        <div className="row justify-content-center">
          {homeFeedback.map((item, index) => (
            <div
              key={item.id}
              className="col-md-6 mb-4 feedback-animate"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="feedback-card-home">
                <div className="d-flex align-items-center">
                  <span className="star-animated">⭐</span>
                  <span className="rating-text">{item.rating}</span>
                </div>
                <p className="feedback-message">{item.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ⭐ View All Button */}
        <div
          className="text-center mt-3 feedback-animate"
          style={{ animationDelay: "0.5s" }}
        >
          <button
            onClick={() => navigate("/feedback-view")}
            className="btn btn-primary px-4 py-2"
            style={{
              borderRadius: "10px",
              fontSize: "18px",
              padding: "10px 28px",
              background: "#1A3D64",
            }}
          >
            View All Feedback →
          </button>
        </div>

      </div>
    </div>
  );
}

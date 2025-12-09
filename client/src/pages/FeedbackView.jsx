import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FeedbackView.css"; // ⭐ CSS file

export default function FeedbackView() {
  const [feedback, setFeedback] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/feedback/all")
      .then((res) => res.json())
      .then((data) => setFeedback(data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="feedback-bg">
      
      {/* ⭐ Back Button */}
      <div className="container">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-light px-4 py-2 mt-3 mb-2"
          style={{
            borderRadius: "10px",
            fontWeight: "600",
            boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
          }}
        >
          ← Back
        </button>
      </div>

      {/* ⭐ Page Title */}
      <h2 className="feedback-title">User Feedback</h2>

      <div className="container py-4">
        {feedback.map((item, index) => (
          <div
            key={item.id}
            className="feedback-card shadow-sm p-4"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            {/* ⭐ Star + Rating */}
            <div className="d-flex align-items-center mb-2">
              <span className="star-icon">⭐</span>
              <span className="rating ms-2">{item.rating}</span>
            </div>

            {/* ⭐ Message */}
            <p className="feedback-message">{item.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

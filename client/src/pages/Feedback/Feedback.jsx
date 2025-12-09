import React, { useState } from "react";
import api from "../../services/api";
import "./Feedback.css";

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setStatus("Please select a rating.");
      return;
    }

    try {
      const res = await api.post("/feedback/send", {
        rating,
        message,
      });

      if (res.data.success) {
        setStatus("Thank you for your feedback!");
        setRating(0);
        setMessage("");
      }
    } catch (err) {
      setStatus("Something went wrong. Try again!");
    }
  };

  return (
    <div className="feedback-container">
      <div className="feedback-card">
        <h2>Give Your Feedback</h2>

        {/* ⭐ STAR RATING SECTION */}
        <div className="star-rating">
          {Array(5)
            .fill(0)
            .map((_, index) => {
              const starValue = index + 1;
              return (
                <span
                  key={index}
                  className={
                    starValue <= (hover || rating)
                      ? "star filled"
                      : "star"
                  }
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHover(starValue)}
                  onMouseLeave={() => setHover(0)}
                >
                  ★
                </span>
              );
            })}
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            name="message"
            placeholder="Write your feedback..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="5"
            required
          ></textarea>

          {status && <p className="status-text">{status}</p>}

          <button className="feedback-btn">Submit Feedback</button>
        </form>
      </div>
    </div>
  );
}

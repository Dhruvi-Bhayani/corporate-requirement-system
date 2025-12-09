import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminFeedback.css";

export default function AdminFeedback() {
    const [feedback, setFeedback] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("admin_token");

        axios
            .get("http://localhost:3000/api/admin/feedback", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => setFeedback(res.data.data))
            .catch((err) => console.error("Admin feedback error:", err));
    }, []);

    return (
        <div className="admin-content admin-feedback-container">
            <h2 className="admin-feedback-title">User Feedback</h2>

            <div className="feedback-grid">
                {feedback.length === 0 ? (
                    <p className="no-feedback">No feedback available</p>
                ) : (
                    feedback.map((item) => (
                        <div key={item.id} className="feedback-card-admin">
                            <div className="feedback-rating">
                                ⭐ {item.rating}
                            </div>

                            <p className="feedback-message-admin">{item.message}</p>

                            <button
                                onClick={() => handleDelete(item.id)}
                                className="delete-btn-admin"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    function handleDelete(id) {
        const token = localStorage.getItem("admin_token");

        axios.delete(`http://localhost:3000/api/admin/feedback/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setFeedback(feedback.filter((f) => f.id !== id));
    }
}

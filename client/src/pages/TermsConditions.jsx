import "./Policy.css";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function TermsConditions() {

    const navigate = useNavigate();

    const handleBack = () => {
        // If there is a previous history entry, go back.
        // If not (user opened page directly), go to home.
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };
    return (
        <div className="policy-wrapper">

            <div className="policy-container">
                <h1>Terms & Conditions</h1>
                <p>Last updated: {new Date().getFullYear()}</p>

                <h3>1. Acceptance of Terms</h3>
                <p>
                    By using CareerGrid, you agree to follow these Terms & Conditions. If
                    you do not agree, please stop using the platform.
                </p>

                <h3>2. User Responsibilities</h3>
                <ul>
                    <li>You must provide accurate information.</li>
                    <li>You are responsible for maintaining account security.</li>
                    <li>You will not upload harmful or false content.</li>
                </ul>

                <h3>3. Job Posting & Applications</h3>
                <p>
                    CareerGrid is a job listing platform. We do not guarantee job selection,
                    interviews, or employer response.
                </p>

                <h3>4. Prohibited Activities</h3>
                <ul>
                    <li>Fake accounts</li>
                    <li>Sharing illegal or harmful content</li>
                    <li>Misusing employer or candidate information</li>
                </ul>

                <h3>5. Account Termination</h3>
                <p>
                    We reserve the right to suspend or terminate accounts that violate our
                    policies.
                </p>

                <h3>6. Limitation of Liability</h3>
                <p>
                    We are not responsible for job offers, hiring decisions, financial
                    losses, misuse of data by employers, or any third-party actions.
                </p>

                <h3>7. Updates to Terms</h3>
                <p>Terms may be updated. Continued use means you accept changes.</p>
            </div>

             {/* Back button */}
            <button className="back-btn" onClick={handleBack}>
                <span className="arrow">←</span> Back
            </button>
        </div>
    );
}

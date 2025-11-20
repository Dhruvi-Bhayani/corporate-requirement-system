import "./Policy.css";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Disclaimer() {
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
                <h1>Disclaimer</h1>
                <p>
                    The information provided on CareerGrid is for general job-related
                    assistance only.
                </p>

                <h3>1. No Guarantee of Employment</h3>
                <p>
                    We do not guarantee job placement, employer response, or hiring
                    outcomes. All hiring decisions are made solely by employers.
                </p>

                <h3>2. Accuracy of Job Listings</h3>
                <p>
                    While we attempt to verify job listings, CareerGrid is not responsible
                    for incorrect, outdated, or misleading information posted by employers.
                </p>

                <h3>3. External Links</h3>
                <p>
                    Our platform may contain links to third-party sites. We are not
                    responsible for external content or actions.
                </p>

                <h3>4. User Responsibility</h3>
                <p>
                    Users should independently verify employers, job offers, and other job
                    information before taking action.
                </p>

                <h3>5. No Legal or Financial Advice</h3>
                <p>
                    CareerGrid does not provide legal, financial, or professional hiring
                    advice.
                </p>
            </div>

            {/* Back button */}
            <button className="back-btn" onClick={handleBack}>
                <span className="arrow">←</span> Back
            </button>
        </div>
    );
}

import "./Policy.css";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {

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
                <h1>Privacy Policy</h1>
                <p>Last updated: {new Date().getFullYear()}</p>

                <p>
                    CareerGrid (“we”, “our”, or “us”) values your privacy. This Privacy
                    Policy explains how we collect, use, and safeguard your personal
                    information when you use our website and job portal services.
                </p>

                <h3>1. Information We Collect</h3>
                <ul>
                    <li>Name, email, phone number</li>
                    <li>Login details (securely encrypted)</li>
                    <li>Job applications or profile information</li>
                    <li>Messages you send through our contact form</li>
                </ul>

                <h3>2. How We Use Your Information</h3>
                <ul>
                    <li>To create your account</li>
                    <li>To help employers connect with job seekers</li>
                    <li>To improve our platform and services</li>
                    <li>To respond to your queries</li>
                </ul>

                <h3>3. How We Protect Your Information</h3>
                <p>
                    We use secure encryption, authentication, and access control to protect
                    your data from unauthorized access.
                </p>

                <h3>4. Sharing Your Information</h3>
                <p>
                    We <strong>do not sell or trade</strong> your information.
                    We may share necessary details only with employers when you apply for a
                    job or use job-related services.
                </p>

                <h3>5. Cookies</h3>
                <p>
                    We may use cookies for improved user experience, login, and analytics.
                </p>

                <h3>6. Your Rights</h3>
                <ul>
                    <li>Access, update, or delete your personal data</li>
                    <li>Request account deletion anytime</li>
                </ul>

                <h3>7. Contact Us</h3>
                <p>If you have questions, contact support@careergrid.com.</p>
            </div>

              {/* Back button */}
            <button className="back-btn" onClick={handleBack}>
                <span className="arrow">←</span> Back
            </button>
        </div>
    );
}

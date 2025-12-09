import { Link } from "react-router-dom";
import "./Footer.css";
import { useAuth } from "../context/AuthContext";   // ⭐ ADDED

export default function Footer() {
  const { user } = useAuth();   // ⭐ GET USER ROLE

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* ABOUT */}
        <div className="footer-col footer-about">
          <div className="footer-logo">
            <img src="/logo1-removebg-preview.png" alt="Logo" />
          </div>
          <p>
            Your trusted platform for finding jobs and hiring talented professionals.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-col">
          <h4>Quick Links</h4>

          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/jobs">Jobs</Link>

          {user?.role === "job_seeker" && (
            <Link to="/job-services">My Jobs</Link>
          )}

          <Link to="/contact">Contact Us</Link>
          <Link to="/feedback">Feedback</Link>
        </div>

        {/* LEGAL */}
        <div className="footer-col">
          <h4>Legal</h4>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/disclaimer">Disclaimer</Link>
        </div>

        {/* CONTACT INFO */}
        <div className="footer-col">
          <h4>Contact Info</h4>
          <p>Email: support@careergrid.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Location: Ahmedabad, India</p>
        </div>

        {/* SOCIAL */}
        <div className="footer-col">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="#"><i className="uil uil-facebook"></i></a>
            <a href="#"><i className="uil uil-instagram"></i></a>
            <a href="#"><i className="uil uil-linkedin"></i></a>
            <a href="#"><i className="uil uil-twitter"></i></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} CareerGrid. All Rights Reserved.
      </div>
    </footer>
  );
}

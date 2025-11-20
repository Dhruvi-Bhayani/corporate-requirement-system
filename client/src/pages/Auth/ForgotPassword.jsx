import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import ToastMessage from "../../components/ToastMessage";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showToast, setShowToast] = useState(false); // ⭐ Toast control

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await api.post("/auth/forgot-password", { email });

      const msg = "OTP sent to your email!";
      setMessage(msg);
      setShowToast(true); // ⭐ Show success toast

      setTimeout(() => navigate("/verify-reset-otp?email=" + email), 1200);
    } catch (err) {
      const errMsg = err.response?.data?.error || "Email not found";
      setError(errMsg);
      setMessage(errMsg);
      setShowToast(true); // ❌ Show error toast
    }
  };

  return (
    <>
      {/* ⭐ GLOBAL TOAST MESSAGE */}
      <ToastMessage
        message={message}
        show={showToast}
        onClose={() => setShowToast(false)}
      />

      <div className="forgot-bg">
        <Container className="d-flex justify-content-center align-items-center forgot-wrapper">
          <Card className="forgot-card p-4">
            <h3 className="text-center forgot-title">Forgot Password</h3>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="forgot-label">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  placeholder="Enter your registered email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="forgot-input"
                  required
                />
              </Form.Group>

              <Button className="forgot-btn w-100" type="submit">
                Send OTP
              </Button>
            </Form>
          </Card>
        </Container>
      </div>
    </>
  );
}

import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await api.post("/auth/verify-otp", { email, otp });

      if (res.status === 200) {
        setMessage("OTP verified successfully. Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card className="p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Verify OTP</h3>

        <Form onSubmit={handleVerify}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Enter OTP</Form.Label>
            <Form.Control
              type="text"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </Form.Group>

          {error && <p className="text-danger text-center">{error}</p>}
          {message && <p className="text-success text-center">{message}</p>}

          <Button type="submit" variant="primary" className="w-100">
            Verify OTP
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

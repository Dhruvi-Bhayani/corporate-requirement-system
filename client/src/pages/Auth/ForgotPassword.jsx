import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage("OTP sent to your email!");
      setTimeout(() => navigate("/verify-reset-otp?email=" + email), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Email not found");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card className="p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Forgot Password</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              placeholder="Enter your registered email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          {error && <p className="text-danger text-center">{error}</p>}
          {message && <p className="text-success text-center">{message}</p>}

          <Button className="w-100" type="submit" variant="primary">
            Send OTP
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

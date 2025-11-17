import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const email = params.get("email");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await api.post("/auth/reset-password", { email, password });
      setMessage("Password reset successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card className="p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Reset Password</h3>

        <Form onSubmit={handleReset}>
          <Form.Group>
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          {error && <p className="text-danger text-center">{error}</p>}
          {message && <p className="text-success text-center">{message}</p>}

          <Button type="submit" className="w-100 mt-3" variant="success">
            Reset Password
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

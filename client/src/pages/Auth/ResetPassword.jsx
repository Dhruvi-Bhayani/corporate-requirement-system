import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import ToastMessage from "../../components/ToastMessage";
import "./ResetPassword.css";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const email = params.get("email");

  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/reset-password", { email, password });

      setToast({ show: true, message: "Password reset successfully!" });

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="reset-bg">
      <Container className="reset-wrapper">
        
        {/* ⭐ Custom Glass Card */}
        <div className="reset-card">
          <h3 className="reset-title">Reset Password</h3>

          <Form onSubmit={handleReset}>
            <Form.Group className="mb-3">
              <Form.Label className="reset-label">New Password</Form.Label>
              <Form.Control
                type="password"
                className="reset-input"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            {error && <p className="text-danger text-center">{error}</p>}

            <Button type="submit" className="reset-btn w-100 mt-3">
              Reset Password
            </Button>
          </Form>
        </div>
      </Container>

      <ToastMessage
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Card, Tabs, Tab, Container, Row, Col } from "react-bootstrap";
import api from "../../services/api"; // Axios instance
import "./Register.css";

const Register = () => {
  const [key, setKey] = useState("jobSeeker");
  const [formData, setFormData] = useState({ fullName: "", orgName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      let endpoint = key === "jobSeeker"
        ? "/auth/register-jobseeker"
        : "/auth/register-org";

      let payload;
      if (key === "jobSeeker") {
        payload = {
          full_name: formData.fullName,
          email: formData.email,
          password: formData.password
        };
      } else {
        payload = {
          org_name: formData.orgName,
          full_name: formData.fullName,
          email: formData.email,
          password: formData.password
        };
      }

      const res = await api.post(endpoint, payload);

      if (res.status === 200 || res.status === 201) {
        setSuccess("OTP sent to your email. Redirecting...");
        setTimeout(() => navigate("/verify-otp"), 1500);
      }
    } catch (err) {
      console.error("Register error:", err);
      setError(
        err.response?.data?.error ||
        err.response?.data ||
        "Registration failed. Please try again!"
      );
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg p-4 border-0 rounded-4">
            <h3 className="text-center mb-4 fw-bold">Register</h3>

            <Tabs
              activeKey={key}
              onSelect={(k) => {
                setKey(k);

                // RESET FORM WHEN SWITCHING TABS
                setFormData({
                  fullName: "",
                  orgName: "",
                  email: "",
                  password: "",
                });

                setError("");
                setSuccess("");
              }}
              className="mb-4 justify-content-center"
            >
              <Tab eventKey="jobSeeker" title="Job Seeker" />
              <Tab eventKey="organization" title="Organization/Admin" />
            </Tabs>


            <Form onSubmit={handleRegister}>
              {key === "organization" && (
                <Form.Group className="mb-3">
                  <Form.Label>Organization Name</Form.Label>
                  <Form.Control
                    name="orgName"
                    type="text"
                    placeholder="Enter organization name"
                    value={formData.orgName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  name="fullName"
                  type="text"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {error && <p className="text-danger text-center">{error}</p>}
              {success && <p className="text-success text-center">{success}</p>}

              <div className="d-grid mb-3">
                <Button type="submit" variant="success" size="lg">
                  Register
                </Button>
              </div>

              <p className="text-center text-muted">
                Already have an account?{" "}
                <Link to="/login" className="text-decoration-none fw-semibold">
                  Login
                </Link>
              </p>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext"; // ✅ adjust path if needed
import "./Login.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);

    if (success) {
      navigate("/"); // ✅ redirect to homepage or dashboard
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow-lg p-4 border-0 rounded-4">
            <h3 className="text-center mb-4 fw-bold">Login</h3>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              {error && <p className="text-danger text-center">{error}</p>}

              <div className="d-grid mb-3">
                <Button type="submit" variant="primary" size="lg">
                  Login
                </Button>
              </div>

              <p className="text-center text-muted mb-0">
                Don’t have an account?{" "}
                <Link to="/register" className="text-decoration-none fw-semibold text-success">
                  Sign up
                </Link>
              </p>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;

import { Container, Row, Col, Card } from "react-bootstrap";
import "./About.css";

export default function About() {
  return (
    <div className="about-wrapper">
      <Container className="py-5">

        <Row className="text-center mb-5">
          <Col>
            <h1 className="fw-bold text-primary">About JobPortal</h1>
            <p className="text-muted fs-5 mt-2">
              Your bridge between opportunities and talent.
            </p>
          </Col>
        </Row>

        {/* Section 1 */}
        <Row className="align-items-center mb-5">
          <Col md={6}>
            <h3 className="fw-semibold text-dark">Our Mission</h3>
            <p className="text-secondary">
              We built JobPortal to simplify the hiring process for companies
              and empower job seekers with transparent, fast, and stress-free opportunities.
            </p>
          </Col>
          <Col md={6}>
            <img
              src="/about1.jpeg"
              alt="Mission"
              className="img-fluid rounded-4 shadow"
            />
          </Col>
        </Row>

        {/* ⭐⭐⭐ EXACT FEATURE ROW LIKE YOUR SCREENSHOT ⭐⭐⭐ */}

        <Row className="my-5 justify-content-center four-image-row">
          <Col md={3} xs={6} className="mb-3">
            <img src="/AA.jpeg" className="about-4-img" alt="img1" />
          </Col>
          <Col md={3} xs={6} className="mb-3">
            <img src="/BB.jpeg" className="about-4-img" alt="img2" />
          </Col>
          <Col md={3} xs={6} className="mb-3">
            <img src="/CC.jpeg" className="about-4-img" alt="img3" />
          </Col>
          <Col md={3} xs={6} className="mb-3">
            <img src="/DD.jpeg" className="about-4-img" alt="img4" />
          </Col>
        </Row>


        {/* Section 2 */}
        <Row className="my-5">
          <h3 className="fw-semibold text-center mb-4 text-dark">What We Offer</h3>

          <Col md={4} className="mb-4">
            <Card className="shadow-lg about-card">
              <Card.Body className="text-center">
                <Card.Title className="fw-bold text-primary">For Job Seekers</Card.Title>
                <Card.Text className="text-secondary">
                  Search jobs, get recommendations, upload resume, and apply instantly.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="shadow-lg about-card">
              <Card.Body className="text-center">
                <Card.Title className="fw-bold text-primary">For Employers</Card.Title>
                <Card.Text className="text-secondary">
                  Post jobs, manage candidates, shortlist faster with our dashboard.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="shadow-lg about-card">
              <Card.Body className="text-center">
                <Card.Title className="fw-bold text-primary">Smart Matching</Card.Title>
                <Card.Text className="text-secondary">
                  Our matching engine connects the right candidate to the right job.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Section 3 */}
        <Row className="my-5">
          <h3 className="fw-semibold text-center mb-4 text-dark">Why Choose Us?</h3>

          <Col md={6}>
            <ul className="fs-5 text-secondary">
              <li>Fast and smooth job application flow</li>
              <li>Verified companies and secure user data</li>
              <li>Modern and powerful recruiter dashboard</li>
              <li>User-friendly UI for job seekers</li>
              <li>Real-time notifications</li>
            </ul>
          </Col>

          <Col md={6}>
            <img
              src="/about2.jpeg"
              alt="Why Choose Us"
              className="img-fluid rounded-4 shadow"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

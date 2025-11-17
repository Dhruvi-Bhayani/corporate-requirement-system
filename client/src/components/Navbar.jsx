import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthPopup from "../pages/Auth/AuthPopup";

export default function TopNavbar() {
  const { user, logout, showPopup, setShowPopup, authMode, setAuthMode } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Navbar expand="lg" className="main-navbar shadow-sm">
        <Container>
          {/* LOGO */}
          <Navbar.Brand as={Link} to="/">
            <img src="/logo1.png" alt="Logo" style={{ height: "50px" }} />
          </Navbar.Brand>

          <Navbar.Toggle />

          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/jobs" style={{ color: "#fff", fontWeight: 600 }}>Jobs</Nav.Link>
              <Nav.Link as={Link} to="/job-services" style={{ color: "#fff", fontWeight: 600 }}>Job Services</Nav.Link>
              <Nav.Link as={Link} to="/about" style={{ color: "#fff", fontWeight: 600 }}>About</Nav.Link>
            </Nav>

            <Nav>
              {!user ? (
                <>
                  <Button
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => {
                      setAuthMode("login");
                      setShowPopup(true);
                    }}
                  >
                    Login
                  </Button>

                  <Button
                    variant="success"
                    onClick={() => {
                      setAuthMode("signup");
                      setShowPopup(true);
                    }}
                  >
                    Register
                  </Button>
                </>
              ) : (
                <>
                  {/* Changed text color to white with Bootstrap utility class text-white */}
                  <span className="me-3 mt-1 fw-semibold text-white">
                    Hello, {user.full_name}
                  </span>

                  <Button
                    variant="outline-danger"
                    // Added a custom class for CSS targeting
                    className="logout-btn-custom"
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                  >
                    Logout
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* AUTH POPUP */}
      <AuthPopup
        show={showPopup}
        onClose={() => setShowPopup(false)}
        mode={authMode}
      />
    </>
  );
}
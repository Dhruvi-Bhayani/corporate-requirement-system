import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthPopup from "../pages/Auth/AuthPopup";
import "./Navbar.css";
import { useState, useEffect } from "react";

export default function TopNavbar() {
  const { user, logout, showPopup, setShowPopup, authMode, setAuthMode } =
    useAuth();
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-dropdown")) {
        setShowMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(".main-navbar");
      if (window.scrollY > 10) {
        navbar?.classList.add("scrolled-navbar");
      } else {
        navbar?.classList.remove("scrolled-navbar");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar expand="lg" className="main-navbar shadow-sm">
        <Container>
          {/* LOGO */}
          <Navbar.Brand>
            <div className="navbar-logo-wrapper">
              <img src="/logo1.png" className="navbar-logo-img" alt="Logo" />
            </div>
          </Navbar.Brand>

          <Navbar.Toggle />

          <Navbar.Collapse>
            {/* CENTER NAV LINKS */}
            <Nav className="mx-auto gap-3">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/about">
                About
              </Nav.Link>
              <Nav.Link as={Link} to="/jobs">
                Jobs
              </Nav.Link>

              {user?.role === "job_seeker" && (
                <Nav.Link as={Link} to="/job-services">
                  My Jobs
                </Nav.Link>
              )}

              <Nav.Link as={Link} to="/contact">
                Contact Us
              </Nav.Link>
              <Nav.Link as={Link} to="/feedback">
                Feedback
              </Nav.Link>
            </Nav>

            {/* RIGHT SIDE BUTTONS */}
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
                  <div className="user-dropdown">
                    <span
                      className="user-name"
                      onClick={() => setShowMenu((prev) => !prev)}
                    >
                      Hello, {user.full_name} ▼
                    </span>

                    {showMenu && (
                      <div className="dropdown-menu-user">
                        <p onClick={() => navigate("/profile")}>My Profile</p>
                        <p onClick={() => navigate("/profile/edit")}>
                          Edit Profile
                        </p>
                        <p
                          className="logout-option"
                          onClick={() => {
                            logout();
                            navigate("/");
                          }}
                        >
                          Logout
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* POPUP */}
      <AuthPopup
        show={showPopup}
        onClose={() => setShowPopup(false)}
        mode={authMode}
      />
    </>
  );
}

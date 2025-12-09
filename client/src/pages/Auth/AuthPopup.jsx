import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import ToastMessage from "../../components/ToastMessage";
import "./AuthPopup.css";

export default function AuthPopup({ show, onClose, mode = "login" }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(mode === "signup");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("jobSeeker");

  const emptyForm = {
    fullName: "",
    orgName: "",
    email: "",
    password: "",
    address: "",
    website: "",
    contact: "",
    description: "",
  };

  const [form, setForm] = useState(emptyForm);

  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  /* ------------------------------------------
        RESET FORM
  ------------------------------------------- */
  const resetForm = () => {
    setForm(emptyForm);
    setShowPassword(false);
    setRole("jobSeeker");
  };

  /* ------------------------------------------
        DISABLE SCROLL WHEN POPUP OPEN
  ------------------------------------------- */
  useEffect(() => {
    if (show) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");
  }, [show]);

  /* ------------------------------------------
       FIX 1: Correct form on Login/Register click
  ------------------------------------------- */
  useEffect(() => {
    setIsSignup(mode === "signup");
    resetForm();
  }, [mode]);

  /* ------------------------------------------
       FIX 2: Clear fields when switching JobSeeker <-> Organization
  ------------------------------------------- */
  useEffect(() => {
    setForm(emptyForm);
  }, [role]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ------------------------------------------
        LOGIN
  ------------------------------------------- */
  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(form.email, form.password);

    if (success) {
      setShowToast(true);
      onClose();
      navigate("/");
    } else {
      setMessage("Invalid email or password");
      setShowToast(true);
    }
  };

  /* ------------------------------------------
        SIGNUP
  ------------------------------------------- */
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const endpoint =
        role === "jobSeeker"
          ? "/auth/register-jobseeker"
          : "/auth/register-org";

      const payload =
        role === "jobSeeker"
          ? {
              full_name: form.fullName,
              email: form.email,
              password: form.password,
            }
          : {
              org_name: form.orgName,
              full_name: form.fullName,
              email: form.email,
              password: form.password,
              address: form.address,
              website: form.website,
              contact_number: form.contact,
              description: form.description,
            };

      await api.post(endpoint, payload);

      setMessage("OTP sent to your email!");
      setShowToast(true);
      onClose();
      navigate("/verify-otp");
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed!");
      setShowToast(true);
    }
  };

  return (
    <>
      <ToastMessage
        message={message}
        show={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* Overlay */}
      <div
        className={`auth-overlay ${show ? "show" : ""}`}
        onClick={onClose}
      ></div>

      {/* Popup */}
      <div className={`auth-container ${show ? "show" : ""}`}>
        <div className="close-btn" onClick={onClose}>✕</div>

        <form
          onSubmit={isSignup ? handleSignup : handleLogin}
          className="auth-form"
        >
          <h2>{isSignup ? "Signup" : "Login"}</h2>

          {/* Role Switch */}
          {isSignup && (
            <div className="role-select">
              <button
                type="button"
                className={role === "jobSeeker" ? "active" : ""}
                onClick={() => setRole("jobSeeker")}
              >
                Job Seeker
              </button>

              <button
                type="button"
                className={role === "orgAdmin" ? "active" : ""}
                onClick={() => setRole("orgAdmin")}
              >
                Organization
              </button>
            </div>
          )}

          {/* Organization Fields */}
          {isSignup && role === "orgAdmin" && (
            <>
              <div className="input_box">
                <input
                  name="orgName"
                  type="text"
                  placeholder="Organization Name"
                  value={form.orgName}
                  onChange={handleChange}
                  required
                />
                <i className="uil uil-building"></i>
              </div>

              <div className="input_box">
                <input
                  name="address"
                  type="text"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
                <i className="uil uil-location-point"></i>
              </div>

              <div className="input_box">
                <input
                  name="website"
                  type="text"
                  placeholder="Website URL"
                  value={form.website}
                  onChange={handleChange}
                />
                <i className="uil uil-globe"></i>
              </div>

              <div className="input_box">
                <input
                  name="contact"
                  type="text"
                  placeholder="Contact Number"
                  value={form.contact}
                  onChange={handleChange}
                  required
                />
                <i className="uil uil-phone"></i>
              </div>

              <div className="input_box">
                <textarea
                  name="description"
                  placeholder="Organization Description"
                  value={form.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </>
          )}

          {/* Signup-only full name */}
          {isSignup && (
            <div className="input_box">
              <input
                name="fullName"
                type="text"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                required
              />
              <i className="uil uil-user"></i>
            </div>
          )}

          {/* Email */}
          <div className="input_box">
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />
            <i className="uil uil-envelope-alt"></i>
          </div>

          {/* Password */}
          <div className="input_box">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={isSignup ? "Create Password" : "Enter Password"}
              value={form.password}
              onChange={handleChange}
              required
            />
            <i className="uil uil-lock"></i>
            <i
              className={`uil ${showPassword ? "uil-eye" : "uil-eye-slash"} pw_hide`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          {/* Submit */}
          <button className="button">
            {isSignup ? "Signup Now" : "Login Now"}
          </button>

          {/* Switch link */}
          <div className="login_signup">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setIsSignup(false);
                    resetForm();
                  }}
                >
                  Login
                </span>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <span
                  onClick={() => {
                    setIsSignup(true);
                    resetForm();
                  }}
                >
                  Signup
                </span>
              </>
            )}
          </div>

        </form>
      </div>
    </>
  );
}

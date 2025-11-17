import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AuthPopup.css";

export default function AuthPopup({ show, onClose, mode = "login" }) {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [isSignup, setIsSignup] = useState(mode === "signup");
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("jobSeeker");

    const [form, setForm] = useState({
        fullName: "",
        orgName: "",
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");

    useEffect(() => {
        setIsSignup(mode === "signup");
    }, [mode]);

    // 🔥 CLEAR FORM WHEN POPUP OPENS
    useEffect(() => {
        if (show) {
            setForm({
                fullName: "",
                orgName: "",
                email: "",
                password: "",
            });
            setMessage("");
        }
    }, [show]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // LOGIN
    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");

        const success = await login(form.email, form.password);

        if (success) {
            navigate("/");
        } else {
            setMessage("Invalid email or password");
        }
    };

    // SIGNUP (with OTP)
    const handleSignup = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            let endpoint =
                role === "jobSeeker"
                    ? "/auth/register-jobseeker"
                    : "/auth/register-org";

            let payload =
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
                    };

            const res = await api.post(endpoint, payload);

            if (res.status === 200 || res.status === 201) {
                setMessage("OTP sent to your email!");

                setTimeout(() => {
                    onClose();
                    navigate("/verify-otp");
                }, 1000);
            }
        } catch (err) {
            setMessage(
                err.response?.data?.error || "Registration failed. Try again!"
            );
        }
    };

    return (
        <>
            <div className={`auth-overlay ${show ? "show" : ""}`} onClick={onClose}></div>

            <div className={`auth-container ${show ? "show" : ""}`}>
                <i className="uil uil-times close-btn" onClick={onClose}></i>

                {/* LOGIN FORM */}
                {!isSignup && (
                    <form onSubmit={handleLogin} className="auth-form">
                        <h2>Login</h2>

                        <div className="input_box">
                            <input
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                            <i className="uil uil-envelope-alt email"></i>
                        </div>

                        <div className="input_box">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                            <i className="uil uil-lock password"></i>

                            <i
                                className={`uil ${showPassword ? "uil-eye" : "uil-eye-slash"} pw_hide`}
                                onClick={() => setShowPassword(!showPassword)}
                            ></i>
                        </div>

                        {message && <p className="error">{message}</p>}

                        <button className="button">Login Now</button>

                        {/* ⭐ ADD FORGOT PASSWORD HERE ⭐ */}
                        <div className="login_signup" style={{ marginTop: "10px" }}>
                            <span
                                className="forgot-link"
                                onClick={() => {
                                    onClose();
                                    navigate("/forgot-password");
                                }}
                            >
                                Forgot Password?
                            </span>
                        </div>

                        <div className="login_signup">
                            Don’t have an account?{" "}
                            <span onClick={() => setIsSignup(true)}>Signup</span>
                        </div>
                    </form>
                )}

                {/* SIGNUP FORM */}
                {isSignup && (
                    <form onSubmit={handleSignup} className="auth-form">
                        <h2>Signup</h2>

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

                        {role === "orgAdmin" && (
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
                        )}

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

                        <div className="input_box">
                            <input
                                name="email"
                                type="email"
                                placeholder="Enter email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                            <i className="uil uil-envelope-alt"></i>
                        </div>

                        <div className="input_box">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create password"
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

                        {message && <p className="error">{message}</p>}

                        <button className="button">Signup Now</button>

                        <div className="login_signup">
                            Already have an account?{" "}
                            <span onClick={() => setIsSignup(false)}>Login</span>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}

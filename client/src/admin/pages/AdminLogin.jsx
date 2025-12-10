import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../AdminAuthContext";
import "./AdminLogin.css";

const API_BASE = "https://corporate-requirement-system-production.up.railway.app";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { adminLogin } = useAdminAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_BASE}/api/admin/login`,
        { email, password }
      );

      adminLogin(res.data.admin, res.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Invalid credentials");
    }
  };

  return (
    <div className="admin-login-wrapper">
      <form className="admin-login-box" onSubmit={handleLogin}>
        <h2>Admin Login</h2>

        {error && <p className="admin-error">{error}</p>}

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="admin-login-btn">Login</button>
      </form>
    </div>
  );
}

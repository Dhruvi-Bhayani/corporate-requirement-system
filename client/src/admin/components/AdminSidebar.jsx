import { NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../AdminAuthContext";
import "./AdminSidebar.css";

export default function AdminSidebar() {
  const { adminLogout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>

      <nav className="sidebar-nav">

        <NavLink to="/admin/dashboard" className="sidebar-link">
          📊 Dashboard
        </NavLink>

        <NavLink to="/admin/users" className="sidebar-link">
          👥 Users
        </NavLink>

        <NavLink to="/admin/organizations" className="sidebar-link">
          🏢 Organizations
        </NavLink>

        <NavLink to="/admin/jobs" className="sidebar-link">
          💼 Jobs
        </NavLink>

        {/* ⭐ ADD THIS */}
        <NavLink to="/admin/applications" className="sidebar-link">
          📬 Applications
        </NavLink>

        <NavLink to="/admin/reports" className="sidebar-link">
          📑 Reports
        </NavLink>

        <NavLink to="/admin/feedback" className="sidebar-link">
          💬 Feedback
        </NavLink>
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
}

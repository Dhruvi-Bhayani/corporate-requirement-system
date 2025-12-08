import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const res = await axios.get("http://localhost:3000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.log("Dashboard stats error:", err);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-content">
        <h1 className="admin-title">Admin Dashboard</h1>
        <p className="admin-subtitle">Overview of platform activity & performance</p>

        {/* Loading */}
        {loading ? (
          <p className="loading-text">Loading stats...</p>
        ) : (
          <>
            {/* STAT CARDS */}
            <div className="stats-grid">
              <DashboardCard
                title="Total Users"
                value={stats.total_users}
                color="#6a00f4"
                icon="👤"
              />

              <DashboardCard
                title="Organizations"
                value={stats.total_orgs}
                color="#0099ff"
                icon="🏢"
              />

              <DashboardCard
                title="Total Jobs"
                value={stats.total_jobs}
                color="#ff7b00"
                icon="💼"
              />

              <DashboardCard
                title="Applications"
                value={stats.total_applications}
                color="#00c853"
                icon="📄"
              />

              {/* ⭐ NEW FEEDBACK CARD */}
              <DashboardCard
                title="Feedback"
                value={stats.total_feedbacks}
                color="#e91e63"
                icon="💬"
              />
            </div>

            {/* QUICK LINKS */}
            <h2 className="section-title">Quick Navigation</h2>

            <div className="quick-links">
              <QuickLink title="Manage Users" color="#6a00f4" link="/admin/users" />
              <QuickLink title="Manage Organizations" color="#0099ff" link="/admin/organizations" />
              <QuickLink title="Manage Jobs" color="#ff7b00" link="/admin/jobs" />
              <QuickLink title="View Applications" color="#00c853" link="/admin/applications" />
              <QuickLink title="Reports & Analytics" color="#9c27b0" link="/admin/reports" />
              <QuickLink title="View Feedback" color="#e91e63" link="/admin/feedback" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DashboardCard({ title, value, color, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ color }}>{icon}</div>
      <h2>{title}</h2>
      <p className="stat-number" style={{ color }}>{value}</p>
    </div>
  );
}

/* QUICK LINK COMPONENT */
function QuickLink({ title, color, link }) {
  return (
    <a href={link} className="quick-link" style={{ borderLeftColor: color }}>
      {title}
    </a>
  );
}

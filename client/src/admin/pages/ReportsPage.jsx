import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

// ✅ REGISTER CHART MODULES
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

// ✅ PRODUCTION BACKEND URL (RAILWAY)
const API_BASE = "https://corporate-requirement-system-production.up.railway.app";

export default function ReportsPage() {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("admin_token");

      const res = await axios.get(`${API_BASE}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(res.data);
    } catch (err) {
      console.error("Stats Error:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats)
    return (
      <div
        style={{
          marginLeft: "300px",
          padding: "40px",
          color: "white",
          fontSize: "20px",
        }}
      >
        Loading reports...
      </div>
    );

  /* ------------------------------------------
        BAR CHART — Users Summary
  ------------------------------------------- */
  const userBarData = {
    labels: ["Total Users", "Active Users", "Blocked Users"],
    datasets: [
      {
        label: "Users Summary",
        data: [stats.total_users, stats.activeUsers, stats.blockedUsers],
        backgroundColor: ["#6a00f4", "#00e676", "#ff1744"],
        borderRadius: 6,
      },
    ],
  };

  /* ------------------------------------------
        PIE CHART — Job Status
  ------------------------------------------- */
  const jobPieData = {
    labels: ["Open Jobs", "Closed Jobs"],
    datasets: [
      {
        data: [stats.openJobs, stats.closedJobs],
        backgroundColor: ["#00b0ff", "#ff6d00"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div style={{ marginLeft: "260px", padding: "30px", width: "100%" }}>
        <h1
          style={{
            fontSize: "34px",
            fontWeight: "800",
            color: "white",
            textShadow: "0 0 12px rgba(30, 26, 26, 0.4)",
          }}
        >
          Reports & Analytics
        </h1>

        {/* SUMMARY CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <StatCard title="Total Users" value={stats.total_users} color="#6a00f4" />
          <StatCard title="Organizations" value={stats.total_orgs} color="#00bfa5" />
          <StatCard title="Total Jobs" value={stats.total_jobs} color="#ff6d00" />
          <StatCard title="Applications" value={stats.total_applications} color="#00e676" />
        </div>

        {/* CHART SECTION */}
        <div style={{ display: "flex", marginTop: "40px", gap: "30px" }}>
          {/* BAR CHART BOX */}
          <div
            style={{
              width: "50%",
              background: "rgba(255,255,255,0.15)",
              padding: "20px",
              borderRadius: "14px",
              boxShadow: "0 6px 25px rgba(0,0,0,0.25)",
              backdropFilter: "blur(8px)",
            }}
          >
            <h3
              style={{
                color: "white",
                textAlign: "center",
                marginBottom: "15px",
                textShadow: "0 0 8px rgba(255,255,255,0.3)",
              }}
            >
              User Summary
            </h3>
            <Bar data={userBarData} />
          </div>

          {/* PIE CHART BOX */}
          <div
            style={{
              width: "50%",
              background: "rgba(255,255,255,0.15)",
              padding: "20px",
              borderRadius: "14px",
              boxShadow: "0 6px 25px rgba(0,0,0,0.25)",
              backdropFilter: "blur(8px)",
            }}
          >
            <h3
              style={{
                color: "white",
                textAlign: "center",
                marginBottom: "15px",
                textShadow: "0 0 8px rgba(255,255,255,0.3)",
              }}
            >
              Job Status
            </h3>
            <Pie data={jobPieData} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================
     STAT CARD COMPONENT
================================ */
function StatCard({ title, value, color }) {
  return (
    <div
      style={{
        padding: "25px",
        background: color,
        borderRadius: "14px",
        color: "white",
        textAlign: "center",
        boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
        transition: "0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>{title}</h2>
      <p style={{ fontSize: "30px", marginTop: "10px", fontWeight: "bold" }}>
        {value}
      </p>
    </div>
  );
}

import { useEffect, useState } from "react";
import api from "../services/api";

export default function StatsSection() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    totalJobSeekers: 0,
    successRate: 0,
  });

  useEffect(() => {
    api.get("/stats")
      .then(res => setStats(res.data))
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  const cards = [
    { icon: "🎯", number: `${stats.totalJobs}+`, label: "Active Jobs" },
    { icon: "🏢", number: `${stats.totalCompanies}+`, label: "Companies" },
    { icon: "👥", number: `${stats.totalJobSeekers}+`, label: "Job Seekers" },
    { icon: "📈", number: `${stats.successRate}%`, label: "Success Rate" },
  ];

  return (
     <div className="container my-5">
      <div className="row text-center">

        {cards.map((item, i) => (
          <div key={i} className="col-12 col-sm-6 col-md-3 mb-4">

            <div
              className="card p-4 h-100 border-0 shadow-sm"
              style={{
                transition: "all 0.3s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.10)";
              }}
            >

              <div className="mb-2" style={{ fontSize: "2rem" }}>
                {item.icon}
              </div>

              <h3 className="fw-bold" style={{ fontSize: "2rem", color: "#000000" }}>
                {item.number}
              </h3>

              <p className="text-muted mt-2">{item.label}</p>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
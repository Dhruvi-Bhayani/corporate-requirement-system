import { useEffect, useState } from "react";
import api from "../services/api";
import "./StatsSection.css"; // ⭐ Add CSS file

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
    <div className="stats-section">
      <div className="container">
        <div className="row text-center">

          {cards.map((item, i) => (
            <div key={i} className="col-12 col-sm-6 col-md-3 mb-4">
              <div className="stats-card shadow-sm">
                <div className="card-body">
                  <div className="stats-icon mb-3">{item.icon}</div>
                  <h4 className="text-primary">{item.number}</h4>
                  <p className="text-muted mt-2">{item.label}</p>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

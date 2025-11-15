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
    <div className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {cards.map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="text-3xl font-bold text-blue-600">{item.number}</h3>
              <p className="text-gray-600 mt-2">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
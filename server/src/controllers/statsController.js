import { Job } from "../models/Job.js";
import { Organization } from "../models/Organization.js";
import { User } from "../models/User.js";

export const getPlatformStats = async (req, res) => {
  try {
    const totalJobs = await Job.count();
    const totalCompanies = await Organization.count();
    const totalJobSeekers = await User.count({ where: { role: "job_seeker" } });
    const successRate = 89; // You can calculate this later if needed

    res.json({
      totalJobs,
      totalCompanies,
      totalJobSeekers,
      successRate,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

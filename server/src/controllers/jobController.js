// src/controllers/jobController.js
import { Job } from "../models/Job.js";

export const createJob = async (req, res) => {
  try {
    const { title, description, location, employment_type, salary_min, salary_max } = req.body;
    const user = req.user; // from auth middleware

    if (!user.organization_id) {
      return res.status(403).json({ error: "Only organization users can create jobs" });
    }

    const job = await Job.create({
      title,
      description,
      location,
      employment_type,
      salary_min,
      salary_max,
      organization_id: user.orgId,
      created_by: user.id
    });

    res.json({ message: "Job created successfully", job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

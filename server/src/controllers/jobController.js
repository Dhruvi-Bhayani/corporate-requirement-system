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

// Get single job details
export const getJobDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update job
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const job = await Job.findByPk(id);

    if (!job) return res.status(404).json({ error: "Job not found" });

    // Only creator or org_admin/HR/Manager can update
    if (job.created_by !== user.id && !["org_admin", "hr", "manager"].includes(user.role)) {
      return res.status(403).json({ error: "Not authorized to update this job" });
    }

    const { title, description, location, employment_type, salary_min, salary_max, status } = req.body;

    job.title = title ?? job.title;
    job.description = description ?? job.description;
    job.location = location ?? job.location;
    job.employment_type = employment_type ?? job.employment_type;
    job.salary_min = salary_min ?? job.salary_min;
    job.salary_max = salary_max ?? job.salary_max;
    job.status = status ?? job.status;

    await job.save();
    res.json({ message: "Job updated successfully", job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete/close job
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const job = await Job.findByPk(id);

    if (!job) return res.status(404).json({ error: "Job not found" });

    // Only creator or org_admin/HR/Manager can delete
    if (job.created_by !== user.id && !["org_admin", "hr", "manager"].includes(user.role)) {
      return res.status(403).json({ error: "Not authorized to delete this job" });
    }

    await job.destroy();
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

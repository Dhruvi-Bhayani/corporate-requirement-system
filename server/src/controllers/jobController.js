// src/controllers/jobController.js
import { Job } from "../models/Job.js";
import { Op } from "sequelize";

// export const createJob = async (req, res) => {
//   try {
//     const { title, description, location, employment_type, salary_min, salary_max } = req.body;
//     const user = req.user; // from auth middleware

//     if (!user.organization_id) {
//       return res.status(403).json({ error: "Only organization users can create jobs" });
//     }

//     const job = await Job.create({
//       title,
//       description,
//       location,
//       employment_type,
//       salary_min,
//       salary_max,
//       organization_id: user.orgId,
//       created_by: user.id
//     });

//     res.json({ message: "Job created successfully", job });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export const createJob = async (req, res) => {
  try {
    const { title, description, location, employment_type, salary_min, salary_max } = req.body;
    const user = req.user; // from auth middleware

    // ✅ Ensure only Org Admin / HR / Manager can create
    if (!["org_admin", "hr", "manager"].includes(user.role)) {
      return res.status(403).json({ error: "Only organization users can create jobs" });
    }

    // ✅ Consistent organization ID
    const organizationId = user.organization_id || user.orgId;
    if (!organizationId) {
      return res.status(400).json({ error: "Missing organization ID" });
    }

    const job = await Job.create({
      title,
      description,
      location,
      employment_type,
      salary_min,
      salary_max,
      organization_id: organizationId,
      created_by: user.id
    });

    res.status(201).json({ message: "Job created successfully", job });
  } catch (err) {
    console.error("Create job error:", err);
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

// Search jobs by title, description, or location
export const searchJobs = async (req, res) => {
  try {
    const q = req.query.q?.trim() || "";    // job title or keyword
    const loc = req.query.loc?.trim() || ""; // location

    // If both are empty, return all jobs
    if (!q && !loc) {
      const allJobs = await Job.findAll();
      return res.json(allJobs);
    }

    const conditions = [];

    if (q) {
      conditions.push({
        [Op.or]: [
          { title: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } },
        ],
      });
    }

    if (loc) {
      conditions.push({
        location: { [Op.like]: `%${loc}%` },
      });
    }

    const where = conditions.length ? { [Op.and]: conditions } : {};

    const jobs = await Job.findAll({ where });
    res.json(jobs);
  } catch (err) {
    console.error("Search jobs error:", err);
    res.status(500).json({ error: err.message });
  }
};

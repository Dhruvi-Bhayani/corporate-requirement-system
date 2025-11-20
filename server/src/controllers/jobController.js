// src/controllers/jobController.js
import { Job } from "../models/Job.js";
import { Op } from "sequelize";

// --------------------- CREATE JOB ---------------------
export const createJob = async (req, res) => {
  try {
    const { title, description, location, employment_type, salary_min, salary_max } = req.body;
    const user = req.user;

    if (!["org_admin", "hr", "manager"].includes(user.role)) {
      return res.status(403).json({ error: "Only organization users can create jobs" });
    }

    const organizationId = user.organization_id || user.orgId;
    if (!organizationId) return res.status(400).json({ error: "Missing organization ID" });

    const job = await Job.create({
      title,
      description,
      location,
      employment_type,
      salary_min,
      salary_max,
      organization_id: organizationId,
      created_by: user.id,
      status: "open"
    });

    res.status(201).json({ message: "Job created successfully", job });
  } catch (err) {
    console.error("Create job error:", err);
    res.status(500).json({ error: err.message });
  }
};

// --------------------- GET JOB DETAIL ---------------------
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

// --------------------- UPDATE JOB ---------------------
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const job = await Job.findByPk(id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    // ⭐ Only same organization can update
    if (job.organization_id !== (user.organization_id || user.orgId)) {
      return res.status(403).json({ error: "Not allowed to update this job" });
    }

    // Update fields
    const fields = [
      "title",
      "description",
      "location",
      "employment_type",
      "salary_min",
      "salary_max",
      "status"
    ];

    fields.forEach((f) => {
      if (req.body[f] !== undefined) job[f] = req.body[f];
    });

    await job.save();
    res.json({ message: "Job updated successfully", job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------- CLOSE JOB (safe) ---------------------
export const closeJob = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const job = await Job.findByPk(id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    // ⭐ Only same organization allowed
    if (job.organization_id !== (user.organization_id || user.orgId)) {
      return res.status(403).json({ error: "Not allowed to close this job" });
    }

    job.status = "closed";
    await job.save();

    res.json({ message: "Job closed successfully", job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------- SEARCH JOBS ---------------------
export const searchJobs = async (req, res) => {
  try {
    const q = req.query.q?.trim() || "";
    const loc = req.query.loc?.trim() || "";

    const conditions = [];

    if (q) {
      conditions.push({
        [Op.or]: [
          { title: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } }
        ]
      });
    }

    if (loc) {
      conditions.push({ location: { [Op.like]: `%${loc}%` } });
    }

    const jobs = await Job.findAll({
      where: conditions.length ? { [Op.and]: conditions } : {}
    });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

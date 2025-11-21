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

    const user = req.user || null;

    // ⭐ Guest + Job seeker → cannot view closed jobs
    if ((!user || user.role === "job_seeker") && job.status !== "open") {
      return res.status(403).json({ error: "This job is closed" });
    }

    // ⭐ Org users → can view only jobs from their organization
    if (user && ["org_admin", "hr", "manager", "recruiter"].includes(user.role)) {
      if (job.organization_id !== (user.organization_id || user.orgId)) {
        return res.status(403).json({ error: "Not allowed to view this job" });
      }
    }

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

// --------------------- CLOSE JOB ---------------------
export const closeJob = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const job = await Job.findByPk(id);
    if (!job) return res.status(404).json({ error: "Job not found" });

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

// --------------------- REOPEN JOB ---------------------
export const reopenJob = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const job = await Job.findByPk(id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    if (job.organization_id !== (user.organization_id || user.orgId)) {
      return res.status(403).json({ error: "Not allowed to reopen this job" });
    }

    if (job.status !== "closed") {
      return res.status(400).json({ error: "Job is not closed" });
    }

    job.status = "open";
    await job.save();

    res.json({ message: "Job reopened successfully", job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------- SEARCH JOBS ---------------------
export const searchJobs = async (req, res) => {
  try {
    const q = req.query.q?.trim() || "";
    const loc = req.query.loc?.trim() || "";
    const user = req.user || null;

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

    const filters = conditions.length ? { [Op.and]: conditions } : {};

    // ⭐ Job seeker + Guest → show only open jobs
    if (!user || user.role === "job_seeker") {
      filters.status = "open";
    }

    // ⭐ Org users → only jobs created by their org
    if (user && ["org_admin", "hr", "manager", "recruiter"].includes(user.role)) {
      filters.organization_id = user.organization_id || user.orgId;
    }

    const jobs = await Job.findAll({ where: filters });
    res.json(jobs);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------- GET ALL JOBS ---------------------
export const getAllJobs = async (req, res) => {
  try {
    const filters = {};

    // Guest → Only open jobs
    if (!req.user) {
      filters.status = "open";
    }

    // Job seeker → Only open jobs
    if (req.user?.role === "job_seeker") {
      filters.status = "open";
    }

    // Org users → Only their created jobs
    if (["org_admin", "hr", "manager", "recruiter"].includes(req.user?.role)) {
      filters.created_by = req.user.id;
    }

    const jobs = await Job.findAll({ where: filters });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

// src/routes/jobRoutes.js
import express from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import {
  createJob,
  getJobDetail,
  updateJob,
  deleteJob
} from "../controllers/jobController.js";
import { Job } from "../models/Job.js";

const router = express.Router();

// GET all jobs (public)
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.json(jobs);
  } catch (err) {
    console.error("GET /api/jobs error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST create a new job (protected: org_admin, hr, manager)
router.post(
  "/",
  requireAuth,
  requireRole(["org_admin", "hr", "manager"]),
  async (req, res) => {
    try {
      const { title, description, location, employment_type, salary_min, salary_max } = req.body;

      // Validate required fields
      if (!title || !description || !location) {
        return res.status(400).json({ error: "title, description, and location are required" });
      }

      // Get organization ID from logged-in user
      const orgId = req.user.orgId;
      if (!orgId) return res.status(403).json({ error: "User has no organization" });

      // Create new job
      const job = await Job.create({
        organization_id: orgId,
        created_by: req.user.id,
        title,
        description,
        location,
        employment_type: employment_type || "Full-time", // default if not provided
        salary_min: salary_min || null,
        salary_max: salary_max || null,
      });

      res.status(201).json({ message: "Job created successfully", job });
    } catch (err) {
      console.error("POST /api/jobs error:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// Public: list jobs
router.get("/", async (req, res) => {
  const { Job } = await import("../models/Job.js");
  try {
    const jobs = await Job.findAll();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public: job detail
router.get("/:id", getJobDetail);

// Protected: create job
router.post("/", requireAuth, requireRole(["org_admin", "hr", "manager"]), createJob);

// Protected: update job
router.put("/:id", requireAuth, requireRole(["org_admin", "hr", "manager"]), updateJob);

// Protected: delete job
router.delete("/:id", requireAuth, requireRole(["org_admin", "hr", "manager"]), deleteJob);

export default router;

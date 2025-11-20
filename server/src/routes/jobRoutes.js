import express from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

import {
  createJob,
  getJobDetail,
  updateJob,
  closeJob,
  searchJobs
} from "../controllers/jobController.js";

const router = express.Router();

// GET all jobs
router.get("/", async (req, res) => {
  try {
    const { Job } = await import("../models/Job.js");
    const jobs = await Job.findAll();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search
router.get("/search", searchJobs);

// Get single job
router.get("/:id", getJobDetail);

// Create
router.post("/", requireAuth, requireRole(["org_admin", "hr", "manager"]), createJob);

// Update job
router.put("/:id", requireAuth, requireRole(["org_admin", "hr", "manager"]), updateJob);

// Close job (PATCH)
router.patch("/:id/close", requireAuth, requireRole(["org_admin", "hr", "manager"]), closeJob);

export default router;

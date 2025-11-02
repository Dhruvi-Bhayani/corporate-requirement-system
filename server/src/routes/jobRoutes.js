import express from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import {
  createJob,
  getJobDetail,
  updateJob,
  deleteJob
} from "../controllers/jobController.js";

const router = express.Router();

// GET all jobs (public)
router.get("/", async (req, res) => {
  try {
    const jobs = await (await import("../models/Job.js")).Job.findAll();
    res.json(jobs);
  } catch (err) {
    console.error("GET /api/jobs error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET single job by id (public)
router.get("/:id", getJobDetail);

// POST create a new job (protected)
router.post("/", requireAuth, requireRole(["org_admin", "hr", "manager"]), createJob);

// PUT update job (protected)
router.put("/:id", requireAuth, requireRole(["org_admin", "hr", "manager"]), updateJob);

// DELETE job (protected)
router.delete("/:id", requireAuth, requireRole(["org_admin", "hr", "manager"]), deleteJob);

export default router;

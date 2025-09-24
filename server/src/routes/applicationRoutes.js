// src/routes/applicationRoutes.js
import express from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import {
  applyJob,
  getUserApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

const router = express.Router();

// Candidate applies for a job
router.post("/", requireAuth, requireRole(["job_seeker"]), applyJob);

// Candidate views their applications
router.get("/", requireAuth, requireRole(["job_seeker"]), getUserApplications);

// HR/Manager updates status of applications
router.put("/:appId/status", requireAuth, requireRole(["hr", "manager"]), updateApplicationStatus);

// HR/Manager: view all applications for a specific job
router.get("/job/:jobId", requireAuth, requireRole(["hr", "manager"]), getJobApplications);


export default router;

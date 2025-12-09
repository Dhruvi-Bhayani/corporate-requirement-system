import express from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

import {
  createJob,
  getJobDetail,
  updateJob,
  closeJob,
  searchJobs,
  reopenJob,
  getAllJobs
} from "../controllers/jobController.js";

const router = express.Router();

// PUBLIC (with optionalAuth)
router.get("/", optionalAuth, getAllJobs);
router.get("/search", optionalAuth, searchJobs);
router.get("/:id", optionalAuth, getJobDetail);

// ORG ONLY
router.post("/", requireAuth, requireRole(["org_admin", "hr", "manager"]), createJob);
router.put("/:id", requireAuth, requireRole(["org_admin", "hr", "manager"]), updateJob);
router.patch("/:id/close", requireAuth, requireRole(["org_admin", "hr", "manager"]), closeJob);
router.patch("/:id/reopen", requireAuth, requireRole(["org_admin", "hr", "manager"]), reopenJob);

export default router;

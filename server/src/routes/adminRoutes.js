import express from "express";
import {
  adminLogin,
  getDashboardStats,
  getAllUsers,
  toggleUserBlock,
  deleteUser,
  getAllOrganizations,
  approveOrganization,
  getAllJobs,
  toggleJobStatus
} from "../controllers/adminController.js";

import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// AUTH
router.post("/login", adminLogin);

// DASHBOARD
router.get("/stats", adminAuth, getDashboardStats);

// USERS
router.get("/users", adminAuth, getAllUsers);
router.put("/users/:id/block", adminAuth, toggleUserBlock);
router.delete("/users/:id", adminAuth, deleteUser);

// ORGANIZATIONS
router.get("/organizations", adminAuth, getAllOrganizations);
router.put("/organizations/:id/approve", adminAuth, approveOrganization);

// JOBS
router.get("/jobs", adminAuth, getAllJobs);
router.put("/jobs/:id/status", adminAuth, toggleJobStatus);

export default router;

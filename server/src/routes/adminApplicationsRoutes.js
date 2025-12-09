import express from "express";
import {
  getAllApplications,
  updateApplicationStatus,
  deleteApplication
} from "../controllers/adminApplicationsController.js";

import { adminAuth } from "../middleware/adminAuth.js"; // ✅ Correct import

const router = express.Router();

// ✅ Use adminAuth middleware correctly
router.get("/", adminAuth, getAllApplications);
router.put("/:id/status", adminAuth, updateApplicationStatus);
router.delete("/:id", adminAuth, deleteApplication);

export default router;

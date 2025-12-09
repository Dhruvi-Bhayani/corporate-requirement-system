// src/routes/userRoutes.js
import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only authenticated users can access
router.get("/", requireAuth, getAllUsers);

export default router;

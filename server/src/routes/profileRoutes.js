import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";

import {
  createProfile,
  getProfile,
  updateProfile,
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/", requireAuth, createProfile);
router.get("/", requireAuth, getProfile);
router.put("/", requireAuth, updateProfile);

export default router;

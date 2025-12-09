import express from "express";
import { getAllFeedback, deleteFeedback } from "../controllers/feedbackController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", adminAuth, getAllFeedback);
router.delete("/:id", adminAuth, deleteFeedback);

export default router;

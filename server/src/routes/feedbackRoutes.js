import express from "express";
import { submitFeedback, getAllFeedback, getLatestFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/send", submitFeedback);
router.get("/all", getAllFeedback);
router.get("/latest", getLatestFeedback);

export default router;

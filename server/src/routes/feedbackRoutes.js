import express from "express";
import { submitFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/send", submitFeedback);

export default router;

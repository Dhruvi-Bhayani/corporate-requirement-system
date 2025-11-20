import express from "express";
import { uploadResume } from "../utils/upload.js"; // adjust path if required

const router = express.Router();

router.post("/resume", uploadResume.single("resume"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ⭐ FULL PUBLIC URL
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/resumes/${req.file.filename}`;

    return res.json({
      message: "Resume uploaded successfully",
      fileUrl: fileUrl,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
});

export default router;

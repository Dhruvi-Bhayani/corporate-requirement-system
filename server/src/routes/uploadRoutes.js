import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = "./uploads/resumes";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowed = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only PDF, JPG, JPEG, PNG allowed"));
};

const upload = multer({ storage, fileFilter });

// ---------------------------------------------
// 📌 API: Upload Resume (FIXED)
// ---------------------------------------------
router.post("/resume", upload.single("resume"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "File not uploaded" });
  }

  // ⭐ FIX: FULL URL (important!)
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/resumes/${req.file.filename}`;

  return res.json({
    message: "Resume uploaded successfully",
    fileUrl,
  });
});

export default router;

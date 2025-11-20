import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// -------------------------------
// 📌 Upload folder (outside server/src)
// -------------------------------
const uploadDir = path.join(process.cwd(), "uploads", "resumes");

// Create folder if missing
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// -------------------------------
// 📌 Multer Storage
// -------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 999999);
    cb(null, unique + ".pdf");
  }
});

// -------------------------------
// 📌 Only allow PDF
// -------------------------------
const fileFilter = (req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Only PDF files allowed"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

// -------------------------------
// 📌 POST /api/upload/resume
// -------------------------------
router.post("/resume", upload.single("resume"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Please upload a PDF file" });
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/resumes/${req.file.filename}`;

  return res.json({
    message: "Resume uploaded successfully",
    fileUrl,
  });
});

export default router;

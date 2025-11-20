import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";

import { sequelize } from './db.js';
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import orgRoutes from "./routes/orgRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import userRoutes from './routes/userRoutes.js';
import contactRoutes from "./routes/contactRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Static uploads folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/org", orgRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/upload", uploadRoutes);  // ⭐ NEW UPLOAD API

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connected!');

    await sequelize.sync();
    console.log('Models synced with database!');
  } catch (err) {
    console.error('DB connection error:', err);
  }
});

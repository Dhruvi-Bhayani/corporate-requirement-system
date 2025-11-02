import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './db.js';
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import orgRoutes from "./routes/orgRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import userRoutes from './routes/userRoutes.js'; // <-- import user routes

// Import models
import { User } from './models/User.js';
import { Organization } from './models/Organization.js';
import { Job } from './models/Job.js';
import { Profile } from './models/Profile.js';
import { Application } from './models/Application.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.use("/api/jobs", jobRoutes);
app.use("/api/org", orgRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/applications", applicationRoutes);
// Add this line with other API routes
app.use('/api/users', userRoutes);
// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connected!');

    // ✅ Sync all models
    await sequelize.sync({ alter: true }); 
    console.log('Models synced with database!');
  } catch (err) {
    console.error('DB connection error:', err);
  }
});

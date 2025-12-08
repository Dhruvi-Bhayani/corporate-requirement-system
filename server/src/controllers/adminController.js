import { User } from "../models/User.js";
import { Job } from "../models/Job.js";
import { Organization } from "../models/Organization.js";
import { Application } from "../models/Application.js";
import { sequelize } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Feedback } from "../models/Feedback.js";

/* -----------------------------------------
   ADMIN LOGIN
------------------------------------------*/
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({
      where: { email, role: "admin" },
    });

    if (!admin)
      return res.status(404).json({ error: "Admin not found" });

    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match)
      return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: admin.id,
        role: admin.role,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* -----------------------------------------
   DASHBOARD STATISTICS
------------------------------------------*/
export const getDashboardStats = async (req, res) => {
  try {
    const users = await User.count();
    const orgs = await Organization.count();
    const jobs = await Job.count();
    const apps = await Application.count();

    const activeUsers = await User.count({ where: { is_active: true } });
    const blockedUsers = await User.count({ where: { is_active: false } });

    const openJobs = await Job.count({ where: { status: "open" } });
    const closedJobs = await Job.count({ where: { status: "closed" } });

    // ⭐ FEEDBACK COUNT
    const total_feedbacks = await Feedback.count();

    res.json({
      total_users: users,
      total_orgs: orgs,
      total_jobs: jobs,
      total_applications: apps,
      activeUsers,
      blockedUsers,
      openJobs,
      closedJobs,

      // ⭐ NEW FIELD
      total_feedbacks,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* -----------------------------------------
   USERS MANAGEMENT
------------------------------------------*/
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "full_name", "email", "role", "is_active", "created_at"]
    });

    res.json(users);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleUserBlock = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.is_active = !user.is_active;
    await user.save();

    res.json({ message: "User updated successfully", user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.destroy({ where: { id } });

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* -----------------------------------------
   ORGANIZATIONS MANAGEMENT
------------------------------------------*/
export const getAllOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.findAll({
      include: [{ model: User, attributes: ["full_name", "email", "role"] }],
    });

    res.json(orgs);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const approveOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    const org = await Organization.findByPk(id);
    if (!org) return res.status(404).json({ error: "Organization not found" });

    org.is_approved = true;
    await org.save();

    res.json({ message: "Organization approved", org });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* -----------------------------------------
   JOBS MANAGEMENT
------------------------------------------*/
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      include: [{ model: Organization, attributes: ["name"] }]
    });

    res.json(jobs);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleJobStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    job.status = job.status === "open" ? "closed" : "open";
    await job.save();

    res.json({ message: "Job updated", job });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

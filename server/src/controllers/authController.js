import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Organization } from "../models/Organization.js";
import crypto from "crypto";

// 🔹 Register Job Seeker
export const registerJobSeeker = async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password_hash: hashedPassword,
      full_name,
      role: "job_seeker",
    });

    res.json({ message: "Job Seeker registered successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Register Organization + Admin
export const registerOrg = async (req, res) => {
  try {
    const { org_name, email, password, full_name } = req.body;

    const organization = await Organization.create({ name: org_name });
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password_hash: hashedPassword,
      full_name,
      role: 'org_admin',
      organization_id: organization.id
    });

    res.json({ message: "Organization and Admin registered successfully", organization, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Invite User (HR/Manager)
export const inviteUser = async (req, res) => {
  try {
    const { email, role, orgId } = req.body;
    const inviteToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      email,
      role,
      organization_id: orgId,
      password_hash: null, // password not set yet
      invite_token: inviteToken
    });

    res.json({ message: "User invited successfully", inviteToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Accept Invite
export const acceptInvite = async (req, res) => {
  try {
    const { invite_token, password, full_name } = req.body;

    const user = await User.findOne({ where: { invite_token } });
    if (!user) return res.status(400).json({ error: "Invalid invite token" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password_hash = hashedPassword;
    user.full_name = full_name;
    user.invite_token = null;
    await user.save();

    res.json({ message: "Invite accepted, account created", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.password_hash) {
      return res.status(403).json({ error: "Invite not yet accepted." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // JWT payload: id, role, orgId (if exists)
    const token = jwt.sign(
      { id: user.id, role: user.role, orgId: user.organization_id || null },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        orgId: user.organization_id || null
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

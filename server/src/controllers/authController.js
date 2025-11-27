import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Organization } from "../models/Organization.js";
import crypto from "crypto";
import { sendMail } from "../utils/sendMail.js";

// 🔹 Register Job Seeker (with OTP)
export const registerJobSeeker = async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    // 1️⃣ Check required fields
    if (!full_name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 2️⃣ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // 3️⃣ Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "This email is already registered" });
    }

    // 4️⃣ Continue with OTP registration
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      email,
      password_hash: hashedPassword,
      full_name,
      role: "job_seeker",
      otp_code: otp,
      otp_expiry: new Date(Date.now() + 10 * 60 * 1000),
      is_verified: false,
    });

    await sendMail(
      email,
      "Your Job Portal OTP Verification",
      `
        <h2>Hello ${full_name},</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
      `
    );

    res.json({ message: "OTP sent to your email", email });

  } catch (err) {
    console.error("Register Job Seeker Error:", err);
    res.status(500).json({ error: "Something went wrong. Try again!" });
  }
};


// 🔹 Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.is_verified)
      return res.json({ message: "Already verified" });

    if (user.otp_code !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    if (new Date() > user.otp_expiry)
      return res.status(400).json({ error: "OTP expired" });

    // Mark verified
    user.is_verified = true;
    user.otp_code = null;
    user.otp_expiry = null;
    await user.save();

    res.json({ message: "OTP verified. You can now login." });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Register Organization Admin (with OTP + Org details + Logo)
export const registerOrg = async (req, res) => {
  try {
    const {
      org_name,
      email,
      password,
      full_name,
      address,
      website_url,
      description,
      contact_number
    } = req.body;

    // 1️⃣ Required field validation
    if (!org_name || !email || !password || !full_name) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "This email is already registered" });
    }

    // 2️⃣ Create Organization Row
    const organization = await Organization.create({ name: org_name });

    // 3️⃣ Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 5️⃣ Format Website URL
    let formattedWebsite = website_url || null;
    if (formattedWebsite && !formattedWebsite.startsWith("http")) {
      formattedWebsite = `https://${formattedWebsite}`;
    }

    // 6️⃣ Handle Logo File Upload
    let logoPath = null;
    if (req.file) {
      logoPath = `/uploads/org/${req.file.filename}`;
    }

    // 7️⃣ Create Admin User of Organization
    const user = await User.create({
      email,
      password_hash: hashedPassword,
      full_name,
      role: "org_admin",
      organization_id: organization.id,
      otp_code: otp,
      otp_expiry: new Date(Date.now() + 10 * 60 * 1000),
      is_verified: false,

      // ⭐ NEW FIELDS
      address: address || null,
      website_url: formattedWebsite,
      description: description || null,
      contact_number: contact_number || null,
      logo: logoPath,
    });

    // 8️⃣ Send OTP Email
    await sendMail(
      email,
      "Your Organization Admin OTP Verification",
      `
      <h2>Hello ${full_name},</h2>
      <p>Your OTP for verification is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
      <hr/>
      <p><b>Organization:</b> ${org_name}</p>
      `
    );

    // 9️⃣ Response
    res.json({
      message: "OTP sent to your email for verification",
      email,
      organization_id: organization.id
    });

  } catch (err) {
    console.error("Register Org Error:", err);
    res.status(500).json({ error: "Something went wrong during registration." });
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

    // BLOCK UNVERIFIED USERS
    if (!user.is_verified)
      return res.status(403).json({ error: "Please verify your OTP before login." });

    if (!user.password_hash)
      return res.status(403).json({ error: "Invite not yet accepted." });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid credentials" });

    // JWT now includes correct key
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        organization_id: user.organization_id || null
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // IMPORTANT FIX 🔥
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        organization_id: user.organization_id || null, // <-- FIXED
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔹 Forgot Password - Send OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "Email not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.reset_otp = otp;
    user.reset_expiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendMail(
      email,
      "Password Reset OTP",
      `<h2>Your OTP for resetting password:</h2>
       <h1>${otp}</h1>
       <p>OTP valid for 10 minutes.</p>`
    );

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// 🔹 Verify Reset Password OTP
export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.reset_otp !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    if (new Date() > user.reset_expiry)
      return res.status(400).json({ error: "OTP expired" });

    res.json({ message: "OTP verified" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password)
      return res.status(400).json({ error: "Password is required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password_hash = hashedPassword;
    user.reset_otp = null;
    user.reset_expiry = null;
    await user.save();

    res.json({ message: "Password reset successful!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

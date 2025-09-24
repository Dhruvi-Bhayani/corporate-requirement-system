import { User } from "../models/User.js";
import crypto from "crypto";

// Invite user (HR/Manager) by org admin
export const inviteUser = async (req, res) => {
  try {
    const { email, role, orgId } = req.body;

    // Generate a random invite token
    const inviteToken = crypto.randomBytes(32).toString("hex");

    // Create user with invite token, password will be null initially
    const user = await User.create({
      email,
      role,
      organization_id: orgId,
      invite_token: inviteToken,
      password_hash: null  // password not yet set
    });

    // You can send invite email here with the token link (optional)
    // Example: http://localhost:3000/accept-invite?token=<inviteToken>

    res.json({ message: "User invited successfully", inviteToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Accept invite and set password
export const acceptInvite = async (req, res) => {
  try {
    const { invite_token, password, full_name } = req.body;

    const user = await User.findOne({ where: { invite_token } });
    if (!user) return res.status(400).json({ error: "Invalid invite token" });

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user details
    user.password_hash = hashedPassword;
    user.full_name = full_name;
    user.invite_token = null; // invalidate token
    await user.save();

    res.json({ message: "Invite accepted, account created successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

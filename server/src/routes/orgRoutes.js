// src/routes/orgRoutes.js
import express from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import { User } from "../models/User.js";
import { Organization } from "../models/Organization.js";

const router = express.Router();

// GET organization info (protected)
router.get("/:orgId", requireAuth, async (req, res) => {
  try {
    const { orgId } = req.params;
    const organization = await Organization.findByPk(orgId, {
      include: [User],
    });
    res.json(organization);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add/invite new user (protected: org_admin)
router.post(
  "/:orgId/users",
  requireAuth,
  requireRole(["org_admin"]),
  async (req, res) => {
    try {
      const { orgId } = req.params;
      const { email, role } = req.body;

      const user = await User.create({
        email,
        role,
        organization_id: orgId,
        password_hash: null, // will be set after invite acceptance
      });

      res.json({ message: "User invited successfully", user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET all users in org
router.get(
  "/:orgId/users",
  requireAuth,
  requireRole(["org_admin", "hr", "manager"]),
  async (req, res) => {
    try {
      const { orgId } = req.params;
      const users = await User.findAll({ where: { organization_id: orgId } });
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;

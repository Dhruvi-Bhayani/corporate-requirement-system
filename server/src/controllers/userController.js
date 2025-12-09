import { User } from "../models/User.js";

// Get all users (filtered by role/org)
export const getAllUsers = async (req, res) => {
  try {
    const { role, id, orgId } = req.user;

    if (!role) return res.status(400).json({ error: "User role not found" });

    let whereClause = {};
    let attributes = ["id", "full_name", "email", "role"];

    // Role-based filtering logic
    switch (role) {
      case 'hr':
        // HR can see ALL job seekers (across all organizations)
        whereClause = { role: 'job_seeker' };
        break;

      case 'job_seeker':
        // Job seekers can only see themselves
        whereClause = { id: id };
        break;

      case 'org_admin':
        // Org admin can see ONLY other org_admins from same organization
        whereClause = {
          role: 'org_admin',
          organization_id: orgId // only users from same organization
        };
        break;

      case 'manager':
      case 'recruiter':
        // Managers and recruiters can see job seekers in their organization
        whereClause = {
          role: 'job_seeker',
          organization_id: orgId
        };
        break;

      default:
        // Default: users can only see themselves
        whereClause = { id: id };
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: attributes
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
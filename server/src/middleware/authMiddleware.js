// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

// Check if user is authenticated
export const requireAuth = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // add user info to request
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Check if user has required role(s)
export const requireRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: "Forbidden: Insufficient role" });
  }
  next();
};

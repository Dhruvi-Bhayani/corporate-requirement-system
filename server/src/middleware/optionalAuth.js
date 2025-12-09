import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const optionalAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    req.user = null; // guest
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);
  } catch (err) {
    req.user = null; // invalid token → treat as guest
  }

  next();
};

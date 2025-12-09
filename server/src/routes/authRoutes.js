import express from "express";
import {
  registerJobSeeker,
  registerOrg,
  login,
  inviteUser,
  acceptInvite,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  verifyOtp,
  adminLogin
} from "../controllers/authController.js";

import { uploadOrgLogo } from "../middleware/uploadLogo.js";

const router = express.Router();

router.post("/register-jobseeker", registerJobSeeker);

// ⭐ Updated: Org register now supports logo upload + extra fields
router.post("/register-org", uploadOrgLogo.single("logo"), registerOrg);

router.post("/login", login);
router.post("/invite", inviteUser);
router.post("/accept-invite", acceptInvite);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);
router.post("/admin/login", adminLogin);

export default router;

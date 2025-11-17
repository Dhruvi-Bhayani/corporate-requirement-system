import express from "express";
import {
  registerJobSeeker,
  registerOrg,
  login,
  inviteUser,
  acceptInvite, forgotPassword,
  verifyResetOtp,
  resetPassword
} from "../controllers/authController.js";
import { verifyOtp } from "../controllers/authController.js";

const router = express.Router();

router.post("/register-jobseeker", registerJobSeeker);
router.post("/register-org", registerOrg);
router.post("/login", login);
router.post("/invite", inviteUser);
router.post("/accept-invite", acceptInvite);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

export default router;

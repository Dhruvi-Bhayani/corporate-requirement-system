import express from "express";
import {
  registerJobSeeker,
  registerOrg,
  login,
  inviteUser,
  acceptInvite,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register-jobseeker", registerJobSeeker);
router.post("/register-org", registerOrg);
router.post("/login", login);
router.post("/invite", inviteUser);
router.post("/accept-invite", acceptInvite);

export default router;

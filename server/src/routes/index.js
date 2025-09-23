import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to Corporate Requirement System API" });
});

export default router;

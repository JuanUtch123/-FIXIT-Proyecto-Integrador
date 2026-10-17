import express from "express";

import {
  getUser,
  getAllUsers,
  getUserStats,
  updateUserStats,
  leaderboard,
  login,
  register,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", getAllUsers);
router.get("/leaderboard", leaderboard);

router.get("/:id", getUser);

router.get("/:id/stats", getUserStats);

router.patch("/:id/stats", updateUserStats);

export default router;

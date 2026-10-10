import express from "express";

import {
  getProgress,
  updateProgress,
} from "../controllers/progress.controller.js";

const router = express.Router();

router.get("/:userId", getProgress);
router.patch("/:userId", updateProgress);

export default router;

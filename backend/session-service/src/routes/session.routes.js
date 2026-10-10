import { Router } from "express";
import { createSessionController, getSessionsController, getSummaryController } from "../controllers/session.controller.js";

const router = Router();

router.post("/", createSessionController)
router.get("/user/:userId", getSessionsController);
router.get("/user/:userId/summary", getSummaryController);

export default router

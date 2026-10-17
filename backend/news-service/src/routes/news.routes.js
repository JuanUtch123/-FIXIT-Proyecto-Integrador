import { Router } from "express";

import {
  createNews,
  getAllNews,
} from "../controllers/news.controller.js";

const router = Router();

router.get("/", getAllNews);
router.post("/", createNews);

export default router;

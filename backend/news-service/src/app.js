import express from "express";

import cors from "./middleware/cors.js";
import newsRoutes from "./routes/news.routes.js";

const app = express();

app.use(cors);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "The news service is working as expected.",
    service: "news-service",
  });
});

app.use("/news", newsRoutes);

export default app;

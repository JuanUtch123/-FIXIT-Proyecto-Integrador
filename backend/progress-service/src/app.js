import express from "express";

import progressRoutes from "./routes/progress.routes.js";
import cors from "./middleware/cors.js";

const app = express();

app.use(cors);
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "The progress service is working as expected.",
    service: "progress-service",
  });
});

app.use("/progress", progressRoutes);

export default app;

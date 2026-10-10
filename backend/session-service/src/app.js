import express from "express";
import router from "./routes/session.routes.js";
import cors from "./middleware/cors.js";
const app = express();

app.use(cors);
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "session-service",
  });
});

app.use("/sessions", router)

export default app;

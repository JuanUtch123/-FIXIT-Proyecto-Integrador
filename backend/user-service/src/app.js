import express from "express";
import userRoutes from "./routes/user.routes.js";
import cors from "./middleware/cors.js";

const app = express();

app.use(cors);
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "The server is workin like expected.",
    service: "user-service",
  });
});

app.use("/users", userRoutes);

export default app;

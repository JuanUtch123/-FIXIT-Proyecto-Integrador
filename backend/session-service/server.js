import "dotenv/config";
import mongoose from "mongoose";

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 3003;
let server;

const startServer = async () => {
  await connectDB();

  server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Session Service running on port ${PORT}`);
  });
};

const shutdown = (signal) => {
  console.log(`${signal} received; shutting down Session Service`);
  if (!server) return process.exit(0);

  server.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
};

process.once("SIGTERM", shutdown);
process.once("SIGINT", shutdown);

startServer().catch((error) => {
  console.error(`Session Service startup failed (${error.name || "Error"}). Check MONGO_URI and database network access.`);
  process.exitCode = 1;
});

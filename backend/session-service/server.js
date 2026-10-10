import "dotenv/config";

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 3003;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Session Service running on port ${PORT}`);
  });
};

startServer();

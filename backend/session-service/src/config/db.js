import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required");
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed; check MONGO_URI and database network access.");
    throw error;
  }
};

export default connectDB;

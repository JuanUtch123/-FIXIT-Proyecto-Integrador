import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true, select: false },
    createdAt: { type: Date, default: Date.now },
    stats: {
      totalGamesPlayed: {
        type: Number,
        min: 0,
        default: 0,
      },
      totalTicketsCompleted: { type: Number, min: 0, default: 0 },
      totalTicketsFailed: { type: Number, min: 0, default: 0 },
      totalPlayTimeSeconds: { type: Number, min: 0, default: 0 },
      totalScore: { type: Number, min: 0, default: 0 },
      totalStars: { type: Number, min: 0, default: 0 },
    },
  },
  {
    collection: "users",
  },
);


const User = mongoose.model("User", userSchema);

export default User;

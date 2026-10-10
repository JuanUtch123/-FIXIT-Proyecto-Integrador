import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    levelId: { type: String, required: true, trim: true },
    worldId: { type: String, required: true, trim: true },
    equipment: { type: String, trim: true, default: "Laptop" },
    repairType: { type: String, trim: true, default: "Otros" },
    completed: { type: Boolean, default: true },
    players: [{ type: mongoose.Schema.Types.ObjectId }],
    score: { type: Number, required: true, min: 0 },
    starsEarned: { type: Number, required: true, min: 0, max: 3 },
    ticketsCompleted: { type: Number, required: true, min: 0 },
    ticketsFailed: { type: Number, required: true, min: 0 },
    durationSeconds: { type: Number, required: true, min: 1 },
    playedAt: { type: Date, default: Date.now },
  },
  {
    collection: "game_sessions",
    versionKey: false,
  },
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;

import mongoose from "mongoose";

const levelProgressSchema = new mongoose.Schema(
  {
    bestScore: { type: Number, required: true, min: 0 },
    bestStars: { type: Number, required: true, min: 0, max: 3 },
  },
  {
    _id: false,
  },
);

const worldProgressSchema = new mongoose.Schema(
  {
    levels: {
      type: Map,
      of: levelProgressSchema,
    },
  },
  {
    _id: false,
  },
);

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },

    worlds: {
      type: Map,
      of: worldProgressSchema,
    },
  },
  {
    collection: "user_progress",
    timestamps: {
      createdAt: false,
      updatedAt: true,
    },
  },
);

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;

import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    content: { type: String, required: true, trim: true, maxlength: 5000 },
    author: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      default: "Equipo Fix IT!",
    },
    publishedAt: { type: Date, default: Date.now },
  },
  {
    collection: "news",
    timestamps: true,
    versionKey: false,
  },
);

const News = mongoose.model("News", newsSchema);

export default News;

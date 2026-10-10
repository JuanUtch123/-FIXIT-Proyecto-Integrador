import Progress from "../models/progress.model.js";

const findProgressByUserId = async (userId) => {
  const progress = await Progress.findOne({ userId });

  return progress;
};

const createProgress = async (progressData) => {
  const progress = new Progress(progressData);

  await progress.save();

  return progress;
};

const saveProgress = async (progress) => {
  await progress.save();

  return progress;
};

export { findProgressByUserId, createProgress, saveProgress };

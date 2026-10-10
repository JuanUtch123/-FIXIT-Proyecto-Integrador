import {
  getProgressByUserId,
  updateLevelProgress,
} from "../services/progress.service.js";

const getProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    const progress = await getProgressByUserId(userId);

    return res.status(200).json(progress);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Internal server error",
    });
  }
};

const updateProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const progressData = req.body;

    const progress = await updateLevelProgress(userId, progressData);

    return res.status(200).json(progress);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Internal server error",
    });
  }
};

export { getProgress, updateProgress };

import mongoose from "mongoose";

import {
  findProgressByUserId,
  createProgress,
  saveProgress,
} from "../repositories/progress.repository.js";
import { validateProgressData } from "../validators/progress.validator.js";

const getProgressByUserId = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error("Invalid user id");
    error.statusCode = 400;
    throw error;
  }

  const progress = await findProgressByUserId(userId);

  if (!progress) {
    const error = new Error("Progress not found");
    error.statusCode = 404;
    throw error;
  }

  return progress;
};

const updateLevelProgress = async (userId, progressData) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error("Invalid user id");
    error.statusCode = 400;
    throw error;
  }

  validateProgressData(progressData);

  const { worldId, levelId, score, starsEarned } = progressData;

  let progress = await findProgressByUserId(userId);

  // If the user does not have a progress document yet,
  // create the initial world and level.
  if (!progress) {
    progress = await createProgress({
      userId,
      worlds: {
        [worldId]: {
          levels: {
            [levelId]: {
              bestScore: score,
              bestStars: starsEarned,
            },
          },
        },
      },
    });

    return progress;
  }

  // Create the world if it does not exist.
  if (!progress.worlds.has(worldId)) {
    progress.worlds.set(worldId, {
      levels: new Map([
        [
          levelId,
          {
            bestScore: score,
            bestStars: starsEarned,
          },
        ],
      ]),
    });

    return await saveProgress(progress);
  }

  const world = progress.worlds.get(worldId);

  // Create the level if it does not exist.
  if (!world.levels.has(levelId)) {
    world.levels.set(levelId, {
      bestScore: score,
      bestStars: starsEarned,
    });

    return await saveProgress(progress);
  }

  // The level already exists: preserve the best values independently.
  const level = world.levels.get(levelId);

  level.bestScore = Math.max(level.bestScore, score);
  level.bestStars = Math.max(level.bestStars, starsEarned);

  return await saveProgress(progress);
};

export { getProgressByUserId, updateLevelProgress };

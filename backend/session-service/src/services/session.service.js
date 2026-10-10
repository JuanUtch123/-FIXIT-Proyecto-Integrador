import mongoose from "mongoose";
import { createSession, findSessionsByUser, summarizeSessionsByUser } from "../repositories/session.repository.js";
import { validateSession } from "../validators/session.validator.js";

const registerSession = async (sessionData) => {
  validateSession(sessionData);

  const session = await createSession(sessionData);

  const userService = process.env.USER_SERVICE_URL || "http://localhost:3001";
  const progressService = process.env.PROGRESS_SERVICE_URL || "http://localhost:3002";
  const requests = sessionData.players.flatMap((userId) => [
    fetch(`${userService}/users/${userId}/stats`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gamesPlayed: 1, ticketsCompleted: sessionData.ticketsCompleted, ticketsFailed: sessionData.ticketsFailed, playTimeSeconds: sessionData.durationSeconds, score: sessionData.score, stars: sessionData.starsEarned }),
    }),
    fetch(`${progressService}/progress/${userId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ worldId: sessionData.worldId, levelId: sessionData.levelId, score: sessionData.score, starsEarned: sessionData.starsEarned }),
    }),
  ]);
  const results = await Promise.allSettled(requests);
  results.forEach((result) => {
    if (result.status === "rejected") console.error("Could not synchronize session:", result.reason.message);
  });

  return session;
};

const validateUserId = (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error("Invalid user id"); error.statusCode = 400; throw error;
  }
};

const getUserSessions = async (userId) => {
  validateUserId(userId);
  return findSessionsByUser(userId);
};

const getUserSessionSummary = async (userId) => {
  validateUserId(userId);
  return summarizeSessionsByUser(userId);
};

export { getUserSessions, getUserSessionSummary, registerSession };

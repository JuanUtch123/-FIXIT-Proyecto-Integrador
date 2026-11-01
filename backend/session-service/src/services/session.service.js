import mongoose from "mongoose";
import { createSession, findSessionsByUser, summarizeSessionsByUser } from "../repositories/session.repository.js";
import { validateSession } from "../validators/session.validator.js";

const registerSession = async (sessionData) => {
  validateSession(sessionData);

  const session = await createSession(sessionData);

  const userService = normalizeServiceUrl(process.env.USER_SERVICE_URL || "http://localhost:3001");
  const progressService = normalizeServiceUrl(process.env.PROGRESS_SERVICE_URL || "http://localhost:3002");
  const requests = sessionData.players.flatMap((userId) => [
    { service: "user-service", promise: fetch(`${userService}/users/${userId}/stats`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gamesPlayed: 1, ticketsCompleted: sessionData.ticketsCompleted, ticketsFailed: sessionData.ticketsFailed, playTimeSeconds: sessionData.durationSeconds, score: sessionData.score, stars: sessionData.starsEarned }),
      signal: AbortSignal.timeout(5000),
    }) },
    { service: "progress-service", promise: fetch(`${progressService}/progress/${userId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ worldId: sessionData.worldId, levelId: sessionData.levelId, score: sessionData.score, starsEarned: sessionData.starsEarned }),
      signal: AbortSignal.timeout(5000),
    }) },
  ]);
  const results = await Promise.allSettled(requests.map(({ promise }) => promise));
  results.forEach((result, index) => {
    const service = requests[index].service;
    if (result.status === "rejected") {
      console.error(`Session saved, but synchronization with ${service} failed (network error or timeout).`);
    } else if (!result.value.ok) {
      console.error(`Session saved, but ${service} returned HTTP ${result.value.status} during synchronization.`);
    }
  });

  return session;
};

const normalizeServiceUrl = (serviceUrl) => {
  const normalized = serviceUrl.replace(/\/+$/, "");
  return /^https?:\/\//i.test(normalized) ? normalized : `http://${normalized}`;
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

import Session from "../models/session.model.js";

const createSession = async (sessionData) => {
  const session = await Session.create(sessionData);

  return session;
};

const findSessionsByUser = async (userId, limit = 20) =>
  Session.find({ players: userId }).sort({ playedAt: -1 }).limit(limit);

const summarizeSessionsByUser = async (userId) => {
  const sessions = await Session.find({ players: userId }).sort({ playedAt: -1 });
  const repairTypes = {};
  const weekly = [0, 0, 0, 0, 0, 0, 0];

  sessions.forEach((session) => {
    const type = session.repairType || "Otros";
    repairTypes[type] = (repairTypes[type] || 0) + session.ticketsCompleted;
    const day = session.playedAt.getDay();
    weekly[day === 0 ? 6 : day - 1] += session.ticketsCompleted;
  });

  return { repairTypes, weekly, recent: sessions.slice(0, 5) };
};

export { createSession, findSessionsByUser, summarizeSessionsByUser };

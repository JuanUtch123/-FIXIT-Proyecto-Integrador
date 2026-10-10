import { getUserSessions, getUserSessionSummary, registerSession } from "../services/session.service.js";

const createSessionController = async (req, res) => {
  try {
    const sessionData = req.body;

    const session = await registerSession(sessionData);

    res.status(201).json({
      message: "Session created successfully! Well Played!",
      session_created: session,
    });
  } catch (e) {
    const statusCode = e.statusCode || 500; // improve error code logic later.
    res.status(statusCode).json({
      error_message: "Something's wrong!",
      error_type: e.message,
    });
  }
};

const getSessionsController = async (req, res) => {
  try { res.status(200).json(await getUserSessions(req.params.userId)); }
  catch (e) { res.status(e.statusCode || 500).json({ error: e.message || "Internal server error" }); }
};

const getSummaryController = async (req, res) => {
  try { res.status(200).json(await getUserSessionSummary(req.params.userId)); }
  catch (e) { res.status(e.statusCode || 500).json({ error: e.message || "Internal server error" }); }
};

export { createSessionController, getSessionsController, getSummaryController };

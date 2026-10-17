import {
  getUserById,
  getUsers,
  getUserStatsById,
  incrementUserStats,
  getLeaderboard,
  loginUser,
  registerUser,
} from "../services/user.service.js";

const register = async (req, res) => {
  try { res.status(201).json({ user: await registerUser(req.body) }); }
  catch (error) { res.status(error.statusCode || 500).json({ error: error.message || "Internal server error" }); }
};

const login = async (req, res) => {
  try { res.status(200).json({ user: await loginUser(req.body) }); }
  catch (error) { res.status(error.statusCode || 500).json({ error: error.message || "Internal server error" }); }
};

const leaderboard = async (_req, res) => {
  try { res.status(200).json(await getLeaderboard()); }
  catch (error) { res.status(500).json({ error: error.message || "Internal server error" }); }
};

const getAllUsers = async (_req, res) => {
  try {
    res.status(200).json(await getUsers());
  } catch (error) {
    res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);

    res.status(200).json(user);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message || "Internal server error",
    });
  }
};

const getUserStats = async (req, res) => {
  try {
    const { id } = req.params;

    const userStats = await getUserStatsById(id);

    res.status(200).json(userStats);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message || "Internal server error",
    });
  }
};

const updateUserStats = async (req, res) => {
  try {
    const { id } = req.params;
    const statsData = req.body;

    const updatedUser = await incrementUserStats(id, statsData);

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message || "Internal server error",
    });
  }
};

export { getAllUsers, getUser, getUserStats, leaderboard, login, register, updateUserStats };

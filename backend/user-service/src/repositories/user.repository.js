import User from "../models/user.model.js";

const findUserById = async (userId) => {
  const user = await User.findById(userId);

  return user;
};

const findUserByEmailWithPassword = async (email) =>
  User.findOne({ email: email.toLowerCase() }).select("+passwordHash");

const findUserByEmail = async (email) => User.findOne({ email: email.toLowerCase() });

const createUser = async (userData) => User.create(userData);

const findAllUsersWithStats = async () =>
  User.find()
    .select("username stats")
    .sort({ "stats.totalScore": -1, "stats.totalTicketsCompleted": -1 });

const findLeaderboard = async (limit = 20) =>
  User.find()
    .select("username stats createdAt")
    .sort({ "stats.totalScore": -1, "stats.totalTicketsCompleted": -1 })
    .limit(limit);

const findUserStatsById = async (userId) => {
  const userStats = await User.findById(userId).select("stats");

  return userStats;
};

const updateUserStats = async (userId, statsData) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $inc: {
        "stats.totalGamesPlayed": statsData.gamesPlayed,
        "stats.totalTicketsCompleted": statsData.ticketsCompleted,
        "stats.totalTicketsFailed": statsData.ticketsFailed,
        "stats.totalPlayTimeSeconds": statsData.playTimeSeconds,
        "stats.totalScore": statsData.score,
        "stats.totalStars": statsData.stars,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return updatedUser;
};

export { createUser, findAllUsersWithStats, findLeaderboard, findUserByEmail, findUserByEmailWithPassword, findUserById, findUserStatsById, updateUserStats };

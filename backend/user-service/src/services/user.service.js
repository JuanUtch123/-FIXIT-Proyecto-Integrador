import mongoose from "mongoose";
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

import {
  findUserById,
  findUserStatsById,
  updateUserStats,
  createUser,
  findLeaderboard,
  findUserByEmail,
  findUserByEmailWithPassword,
} from "../repositories/user.repository.js";

const scrypt = promisify(scryptCallback);

const publicUser = (user) => {
  const value = user.toObject ? user.toObject() : { ...user };
  delete value.passwordHash;
  return value;
};

const hashPassword = async (password) => {
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
};

const verifyPassword = async (password, stored) => {
  const [salt, hashHex] = stored.split(":");
  const calculated = await scrypt(password, salt, 64);
  const storedBuffer = Buffer.from(hashHex, "hex");
  return storedBuffer.length === calculated.length && timingSafeEqual(storedBuffer, calculated);
};

const registerUser = async ({ username, email, password }) => {
  if (!username?.trim() || !email?.trim() || !password) {
    const error = new Error("Username, email and password are required"); error.statusCode = 400; throw error;
  }
  if (password.length < 6) {
    const error = new Error("Password must contain at least 6 characters"); error.statusCode = 400; throw error;
  }
  if (await findUserByEmail(email)) {
    const error = new Error("An account with this email already exists"); error.statusCode = 409; throw error;
  }
  const user = await createUser({ username: username.trim(), email: email.trim(), passwordHash: await hashPassword(password) });
  return publicUser(user);
};

const loginUser = async ({ email, password }) => {
  if (!email?.trim() || !password) {
    const error = new Error("Email and password are required"); error.statusCode = 400; throw error;
  }
  const user = await findUserByEmailWithPassword(email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    const error = new Error("Invalid email or password"); error.statusCode = 401; throw error;
  }
  return publicUser(user);
};

const getLeaderboard = async () => findLeaderboard();

const getUserById = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error("Invalid user id");
    error.statusCode = 400;
    throw error;
  }

  const user = await findUserById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

const getUserStatsById = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error("Invalid user id");
    error.statusCode = 400;
    throw error;
  }

  const userStats = await findUserStatsById(userId);

  if (!userStats) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return userStats;
};

const incrementUserStats = async (userId, statsData) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error("Invalid user id");
    error.statusCode = 400;
    throw error;
  }

  if (
    statsData == null ||
    typeof statsData !== "object" ||
    Array.isArray(statsData)
  ) {
    const error = new Error("Stats data must be an object");
    error.statusCode = 400;
    throw error;
  }

  const requiredFields = [
    "gamesPlayed",
    "ticketsCompleted",
    "ticketsFailed",
    "playTimeSeconds",
    "score",
    "stars",
  ];

  const missingFields = [];

  requiredFields.forEach((field) => {
    if (statsData[field] == null) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    const error = new Error(
      `Missing required fields: ${missingFields.join(", ")}`,
    );
    error.statusCode = 400;
    throw error;
  }

  requiredFields.forEach((field) => {
    if (!Number.isInteger(statsData[field])) {
      const error = new Error(`The field '${field}' must be an integer`);
      error.statusCode = 400;
      throw error;
    }
  });

  requiredFields.forEach((field) => {
    if (statsData[field] < 0) {
      const error = new Error(
        `The field '${field}' must be greater than or equal to 0`,
      );
      error.statusCode = 400;
      throw error;
    }
  });

  const updatedUser = await updateUserStats(userId, statsData);

  if (!updatedUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return updatedUser;
};

export { getLeaderboard, getUserById, getUserStatsById, incrementUserStats, loginUser, registerUser };

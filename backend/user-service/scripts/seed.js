import "dotenv/config";
import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";
import mongoose from "mongoose";
import User from "../src/models/user.model.js";

const scrypt = promisify(scryptCallback);
const hashPassword = async (password) => {
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
};

await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fixit");
const demoEmails = ["jugador1@fixit.com", "player2@fixit.com", "player3@fixit.com"];
const previousDemoUsers = await User.find({ email: { $in: demoEmails } }).select("_id");
const previousIds = previousDemoUsers.map((user) => user._id);
await Promise.all([
  previousIds.length ? mongoose.connection.collection("game_sessions").deleteMany({ players: { $in: previousIds } }) : null,
  previousIds.length ? mongoose.connection.collection("user_progress").deleteMany({ userId: { $in: previousIds } }) : null,
  User.deleteMany({ email: { $in: demoEmails } }),
]);

const passwordHash = await hashPassword("Fixit123");
const players = await User.insertMany([
  { username: "Jugador1", email: "jugador1@fixit.com", passwordHash, stats: { totalGamesPlayed: 12, totalTicketsCompleted: 87, totalTicketsFailed: 19, totalPlayTimeSeconds: 162000, totalScore: 1952, totalStars: 28 } },
  { username: "Player2", email: "player2@fixit.com", passwordHash, stats: { totalGamesPlayed: 9, totalTicketsCompleted: 42, totalTicketsFailed: 8, totalPlayTimeSeconds: 12360, totalScore: 984, totalStars: 20 } },
  { username: "Player3", email: "player3@fixit.com", passwordHash, stats: { totalGamesPlayed: 8, totalTicketsCompleted: 35, totalTicketsFailed: 12, totalPlayTimeSeconds: 10560, totalScore: 876, totalStars: 17 } },
]);

const now = new Date();
const sessionRows = [
  ["Laptop HP", "Pantalla", 380, 3, 8, 0, 3600, 1],
  ["Laptop Dell", "Batería", 310, 3, 6, 1, 2800, 3],
  ["Laptop Lenovo", "Teclado", 250, 2, 5, 1, 2400, 5],
  ["Laptop ASUS", "Otros", 190, 2, 4, 2, 2100, 6],
];
await mongoose.connection.collection("game_sessions").insertMany(sessionRows.map(([equipment, repairType, score, starsEarned, ticketsCompleted, ticketsFailed, durationSeconds, daysAgo], index) => ({
  levelId: `nivel-${index + 1}`, worldId: "mundo-1", equipment, repairType, completed: true,
  players: [players[0]._id], score, starsEarned, ticketsCompleted, ticketsFailed, durationSeconds,
  playedAt: new Date(now.getTime() - daysAgo * 86400000),
})));
await mongoose.connection.collection("user_progress").insertOne({ userId: players[0]._id, worlds: { "mundo-1": { levels: { "nivel-1": { bestScore: 380, bestStars: 3 } } } }, updatedAt: now });

console.log("Datos de prueba creados. Usuario: jugador1@fixit.com / Fixit123");
await mongoose.disconnect();

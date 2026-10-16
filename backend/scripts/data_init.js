import "dotenv/config";

import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";
import mongoose from "mongoose";

const scrypt = promisify(scryptCallback);
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const DEFAULT_MONGO_URI = "mongodb://127.0.0.1:27017/fixit";
const LAB_PASSWORD = "Fixit123";

const playerDefinitions = [
  {
    id: "660000000000000000000001",
    username: "Jugador1",
    email: "jugador1@fixit.com",
  },
  {
    id: "660000000000000000000002",
    username: "Player2",
    email: "player2@fixit.com",
  },
  {
    id: "660000000000000000000003",
    username: "Player3",
    email: "player3@fixit.com",
  },
  {
    id: "660000000000000000000004",
    username: "TecnicoNova",
    email: "tecnico.nova@fixit.com",
  },
  {
    id: "660000000000000000000005",
    username: "ByteMaster",
    email: "byte.master@fixit.com",
  },
];

const sessionDefinitions = [
  {
    id: "670000000000000000000001",
    levelId: "1-1",
    worldId: "world_1",
    equipment: "Laptop HP",
    repairType: "Pantalla",
    players: ["Jugador1"],
    score: 1500,
    starsEarned: 3,
    ticketsCompleted: 6,
    ticketsFailed: 1,
    durationSeconds: 180,
    daysAgo: 1,
  },
  {
    id: "670000000000000000000002",
    levelId: "1-1",
    worldId: "world_1",
    equipment: "Laptop Dell",
    repairType: "Batería",
    players: ["Player2"],
    score: 1280,
    starsEarned: 2,
    ticketsCompleted: 5,
    ticketsFailed: 2,
    durationSeconds: 240,
    daysAgo: 2,
  },
  {
    id: "670000000000000000000003",
    levelId: "1-2",
    worldId: "world_1",
    equipment: "PC Gamer",
    repairType: "Fuente de poder",
    players: ["Jugador1", "Player2"],
    score: 1720,
    starsEarned: 3,
    ticketsCompleted: 7,
    ticketsFailed: 0,
    durationSeconds: 210,
    daysAgo: 3,
  },
  {
    id: "670000000000000000000004",
    levelId: "1-2",
    worldId: "world_1",
    equipment: "Laptop Lenovo",
    repairType: "Teclado",
    players: ["Player3"],
    score: 980,
    starsEarned: 2,
    ticketsCompleted: 4,
    ticketsFailed: 2,
    durationSeconds: 260,
    daysAgo: 4,
  },
  {
    id: "670000000000000000000005",
    levelId: "2-1",
    worldId: "world_2",
    equipment: "MacBook Pro",
    repairType: "Almacenamiento",
    players: ["TecnicoNova"],
    score: 2100,
    starsEarned: 3,
    ticketsCompleted: 8,
    ticketsFailed: 1,
    durationSeconds: 300,
    daysAgo: 5,
  },
  {
    id: "670000000000000000000006",
    levelId: "2-1",
    worldId: "world_2",
    equipment: "PC de escritorio",
    repairType: "Memoria RAM",
    players: ["ByteMaster"],
    score: 1350,
    starsEarned: 2,
    ticketsCompleted: 5,
    ticketsFailed: 1,
    durationSeconds: 225,
    daysAgo: 6,
  },
  {
    id: "670000000000000000000007",
    levelId: "2-2",
    worldId: "world_2",
    equipment: "Servidor",
    repairType: "Red",
    players: ["Jugador1", "Player3"],
    score: 2450,
    starsEarned: 3,
    ticketsCompleted: 9,
    ticketsFailed: 1,
    durationSeconds: 360,
    daysAgo: 7,
  },
  {
    id: "670000000000000000000008",
    levelId: "2-2",
    worldId: "world_2",
    equipment: "Workstation",
    repairType: "Sistema operativo",
    players: ["Player2", "TecnicoNova", "ByteMaster"],
    score: 2680,
    starsEarned: 3,
    ticketsCompleted: 10,
    ticketsFailed: 0,
    durationSeconds: 420,
    daysAgo: 8,
  },
];

const newsDefinitions = [
  {
    id: "680000000000000000000001",
    title: "Bienvenidos a Fix IT!",
    content:
      "Conoce el laboratorio cooperativo donde aprenderás diagnóstico y reparación de equipos de cómputo.",
    author: "Equipo Fix IT!",
    daysAgo: 10,
  },
  {
    id: "680000000000000000000002",
    title: "Nuevo mundo de redes disponible",
    content:
      "Ya puedes practicar la identificación de fallas de conectividad y completar nuevas reparaciones.",
    author: "Equipo Fix IT!",
    daysAgo: 4,
  },
  {
    id: "680000000000000000000003",
    title: "Mejoras en la clasificación general",
    content:
      "La PWA ahora puede consultar las estadísticas de todos los jugadores para mostrar la clasificación general.",
    author: "Equipo Fix IT!",
    daysAgo: 1,
  },
];

const objectId = (value) => new mongoose.Types.ObjectId(value);

const hashPassword = async (password) => {
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, 64);

  return `${salt}:${hash.toString("hex")}`;
};

const emptyStats = () => ({
  totalGamesPlayed: 0,
  totalTicketsCompleted: 0,
  totalTicketsFailed: 0,
  totalPlayTimeSeconds: 0,
  totalScore: 0,
  totalStars: 0,
});

const buildLabDocuments = async () => {
  const now = new Date();
  const passwordHash = await hashPassword(LAB_PASSWORD);
  const playersByUsername = new Map(
    playerDefinitions.map((player) => [player.username, player]),
  );
  const statsByUsername = new Map(
    playerDefinitions.map((player) => [player.username, emptyStats()]),
  );
  const progressByUsername = new Map(
    playerDefinitions.map((player) => [player.username, {}]),
  );

  const sessions = sessionDefinitions.map((session) => {
    session.players.forEach((username) => {
      const stats = statsByUsername.get(username);
      const worlds = progressByUsername.get(username);

      stats.totalGamesPlayed += 1;
      stats.totalTicketsCompleted += session.ticketsCompleted;
      stats.totalTicketsFailed += session.ticketsFailed;
      stats.totalPlayTimeSeconds += session.durationSeconds;
      stats.totalScore += session.score;
      stats.totalStars += session.starsEarned;

      worlds[session.worldId] ??= { levels: {} };
      const previousLevel = worlds[session.worldId].levels[session.levelId];
      worlds[session.worldId].levels[session.levelId] = {
        bestScore: Math.max(previousLevel?.bestScore ?? 0, session.score),
        bestStars: Math.max(previousLevel?.bestStars ?? 0, session.starsEarned),
      };
    });

    return {
      _id: objectId(session.id),
      levelId: session.levelId,
      worldId: session.worldId,
      equipment: session.equipment,
      repairType: session.repairType,
      completed: true,
      players: session.players.map(
        (username) => objectId(playersByUsername.get(username).id),
      ),
      score: session.score,
      starsEarned: session.starsEarned,
      ticketsCompleted: session.ticketsCompleted,
      ticketsFailed: session.ticketsFailed,
      durationSeconds: session.durationSeconds,
      playedAt: new Date(now.getTime() - session.daysAgo * DAY_IN_MILLISECONDS),
    };
  });

  const users = playerDefinitions.map((player) => ({
    _id: objectId(player.id),
    username: player.username,
    email: player.email,
    passwordHash,
    createdAt: new Date(now.getTime() - 30 * DAY_IN_MILLISECONDS),
    stats: statsByUsername.get(player.username),
    __v: 0,
  }));

  const progress = playerDefinitions.map((player, index) => ({
    _id: objectId(`69000000000000000000000${index + 1}`),
    userId: objectId(player.id),
    worlds: progressByUsername.get(player.username),
    updatedAt: now,
    __v: 0,
  }));

  const news = newsDefinitions.map((item) => {
    const publishedAt = new Date(
      now.getTime() - item.daysAgo * DAY_IN_MILLISECONDS,
    );

    return {
      _id: objectId(item.id),
      title: item.title,
      content: item.content,
      author: item.author,
      publishedAt,
      createdAt: publishedAt,
      updatedAt: publishedAt,
    };
  });

  return { news, progress, sessions, users };
};

const cleanLabData = async (database) => {
  const usersCollection = database.collection("users");
  const seededUserIds = playerDefinitions.map((player) => objectId(player.id));
  const previousUsers = await usersCollection
    .find(
      {
        $or: [
          { _id: { $in: seededUserIds } },
          { email: { $in: playerDefinitions.map((player) => player.email) } },
          {
            username: {
              $in: playerDefinitions.map((player) => player.username),
            },
          },
        ],
      },
      { projection: { _id: 1 } },
    )
    .toArray();
  const relatedUserIds = [
    ...new Map(
      [...seededUserIds, ...previousUsers.map((user) => user._id)].map((id) => [
        id.toString(),
        id,
      ]),
    ).values(),
  ];

  const sessionsResult = await database.collection("game_sessions").deleteMany({
    $or: [
      { _id: { $in: sessionDefinitions.map((session) => objectId(session.id)) } },
      { players: { $in: relatedUserIds } },
    ],
  });
  const progressResult = await database.collection("user_progress").deleteMany({
    $or: [
      {
        _id: {
          $in: playerDefinitions.map((_, index) =>
            objectId(`69000000000000000000000${index + 1}`),
          ),
        },
      },
      { userId: { $in: relatedUserIds } },
    ],
  });
  const newsResult = await database.collection("news").deleteMany({
    _id: { $in: newsDefinitions.map((item) => objectId(item.id)) },
  });
  const usersResult = await usersCollection.deleteMany({
    $or: [
      { _id: { $in: relatedUserIds } },
      { email: { $in: playerDefinitions.map((player) => player.email) } },
      { username: { $in: playerDefinitions.map((player) => player.username) } },
    ],
  });

  return {
    news: newsResult.deletedCount,
    progress: progressResult.deletedCount,
    sessions: sessionsResult.deletedCount,
    users: usersResult.deletedCount,
  };
};

const loadLabData = async (database) => {
  const documents = await buildLabDocuments();

  await database.collection("users").insertMany(documents.users);
  await database.collection("user_progress").insertMany(documents.progress);
  await database.collection("game_sessions").insertMany(documents.sessions);
  await database.collection("news").insertMany(documents.news);

  return {
    news: documents.news.length,
    progress: documents.progress.length,
    sessions: documents.sessions.length,
    users: documents.users.length,
  };
};

const printSummary = (title, counts) => {
  console.log(`\n${title}`);
  console.table(counts);
};

const main = async () => {
  const cleanOnly = process.argv.includes("--clean-only");
  const mongoUri = process.env.MONGO_URI || DEFAULT_MONGO_URI;

  try {
    const connection = await mongoose.connect(mongoUri);
    console.log(
      `MongoDB conectado para aprovisionamiento: ${connection.connection.name}`,
    );

    const deletedCounts = await cleanLabData(connection.connection.db);
    printSummary("Datos de laboratorio eliminados:", deletedCounts);

    if (cleanOnly) {
      console.log("\nLimpieza finalizada. No se cargaron datos nuevos.");
      return;
    }

    const insertedCounts = await loadLabData(connection.connection.db);
    printSummary("Datos de laboratorio insertados:", insertedCounts);
    console.log(`\nCredenciales de prueba: jugador1@fixit.com / ${LAB_PASSWORD}`);
    console.log("Aprovisionamiento finalizado correctamente.");
  } catch (error) {
    console.error(`No fue posible preparar los datos: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

const isDirectExecution =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  await main();
}

export { buildLabDocuments, cleanLabData, loadLabData };

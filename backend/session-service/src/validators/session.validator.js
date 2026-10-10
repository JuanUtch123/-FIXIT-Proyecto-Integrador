import mongoose from "mongoose";

const validateSession = (sessionData) => {
  const requiredFields = [
    "levelId",
    "worldId",
    "players",
    "score",
    "starsEarned",
    "ticketsCompleted",
    "ticketsFailed",
    "durationSeconds",
  ];

  const missingFields = [];
  if (
    sessionData == null ||
    typeof sessionData !== "object" ||
    Array.isArray(sessionData)
  ) {
    const error = new Error("Session data must be an object");
    error.statusCode = 400;
    throw error;
  }

  requiredFields.forEach((field) => {
    if (sessionData[field] == null) {
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

  // Validate strings
  const stringFields = ["levelId", "worldId"];

  stringFields.forEach((field) => {
    if (
      typeof sessionData[field] !== "string" ||
      sessionData[field].trim() === ""
    ) {
      const error = new Error(
        `The field '${field}' must be a non-empty string`,
      );
      error.statusCode = 400;
      throw error;
    }
  });

  // Validate players
  if (!Array.isArray(sessionData.players)) {
    const error = new Error("Players must be an array");
    error.statusCode = 400;
    throw error;
  }

  if (sessionData.players.length === 0) {
    const error = new Error("Players must contain at least one player");
    error.statusCode = 400;
    throw error;
  }

  sessionData.players.forEach((playerId) => {
    if (!mongoose.Types.ObjectId.isValid(playerId)) {
      const error = new Error(`Invalid player ObjectId: '${playerId}'`);
      error.statusCode = 400;
      throw error;
    }
  });

  // Validate integer fields
  const integerFields = [
    "score",
    "starsEarned",
    "ticketsCompleted",
    "ticketsFailed",
    "durationSeconds",
  ];

  integerFields.forEach((field) => {
    if (!Number.isInteger(sessionData[field])) {
      const error = new Error(`The field '${field}' must be an integer`);
      error.statusCode = 400;
      throw error;
    }
  });

  // Validate non-negative fields
  const nonNegativeFields = ["score", "ticketsCompleted", "ticketsFailed"];

  nonNegativeFields.forEach((field) => {
    if (sessionData[field] < 0) {
      const error = new Error(
        `The field '${field}' must be greater than or equal to 0`,
      );
      error.statusCode = 400;
      throw error;
    }
  });

  // Validate stars range
  if (sessionData.starsEarned < 0 || sessionData.starsEarned > 3) {
    const error = new Error("The field 'starsEarned' must be between 0 and 3");
    error.statusCode = 400;
    throw error;
  }

  // Validate duration
  if (sessionData.durationSeconds < 1) {
    const error = new Error(
      "The field 'durationSeconds' must be greater than or equal to 1",
    );
    error.statusCode = 400;
    throw error;
  }
};

export { validateSession };

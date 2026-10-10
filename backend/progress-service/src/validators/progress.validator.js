const validateProgressData = (progressData) => {
  if (
    progressData == null ||
    typeof progressData !== "object" ||
    Array.isArray(progressData)
  ) {
    const error = new Error("Progress data must be an object");
    error.statusCode = 400;
    throw error;
  }

  const requiredFields = ["worldId", "levelId", "score", "starsEarned"];

  const missingFields = [];

  requiredFields.forEach((field) => {
    if (progressData[field] == null) {
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

  if (
    typeof progressData.worldId !== "string" ||
    progressData.worldId.trim() === ""
  ) {
    const error = new Error("The field 'worldId' must be a non-empty string");
    error.statusCode = 400;
    throw error;
  }

  if (
    typeof progressData.levelId !== "string" ||
    progressData.levelId.trim() === ""
  ) {
    const error = new Error("The field 'levelId' must be a non-empty string");
    error.statusCode = 400;
    throw error;
  }

  if (!Number.isInteger(progressData.score)) {
    const error = new Error("The field 'score' must be an integer");
    error.statusCode = 400;
    throw error;
  }

  if (!Number.isInteger(progressData.starsEarned)) {
    const error = new Error("The field 'starsEarned' must be an integer");
    error.statusCode = 400;
    throw error;
  }

  if (progressData.score < 0) {
    const error = new Error(
      "The field 'score' must be greater than or equal to 0",
    );
    error.statusCode = 400;
    throw error;
  }

  if (progressData.starsEarned < 0 || progressData.starsEarned > 3) {
    const error = new Error("The field 'starsEarned' must be between 0 and 3");
    error.statusCode = 400;
    throw error;
  }
};

export { validateProgressData };

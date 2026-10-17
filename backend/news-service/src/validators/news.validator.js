const validateNews = (newsData) => {
  if (newsData == null || typeof newsData !== "object" || Array.isArray(newsData)) {
    const error = new Error("News data must be an object");
    error.statusCode = 400;
    throw error;
  }

  const requiredFields = ["title", "content"];
  const missingFields = requiredFields.filter(
    (field) => typeof newsData[field] !== "string" || newsData[field].trim() === "",
  );

  if (missingFields.length > 0) {
    const error = new Error(
      `Missing or invalid required fields: ${missingFields.join(", ")}`,
    );
    error.statusCode = 400;
    throw error;
  }

  if (newsData.title.trim().length > 120) {
    const error = new Error("The field 'title' must contain at most 120 characters");
    error.statusCode = 400;
    throw error;
  }

  if (newsData.content.trim().length > 5000) {
    const error = new Error("The field 'content' must contain at most 5000 characters");
    error.statusCode = 400;
    throw error;
  }

  if (
    newsData.author != null &&
    (typeof newsData.author !== "string" ||
      newsData.author.trim() === "" ||
      newsData.author.trim().length > 80)
  ) {
    const error = new Error(
      "The field 'author' must be a non-empty string with at most 80 characters",
    );
    error.statusCode = 400;
    throw error;
  }
};

export { validateNews };

import { getNews, publishNews } from "../services/news.service.js";

const getAllNews = async (_req, res) => {
  try {
    res.status(200).json(await getNews());
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message || "Internal server error",
    });
  }
};

const createNews = async (req, res) => {
  try {
    const news = await publishNews(req.body);

    res.status(201).json({ news });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message || "Internal server error",
    });
  }
};

export { createNews, getAllNews };

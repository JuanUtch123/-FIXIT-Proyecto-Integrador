import News from "../models/news.model.js";

const createNews = async (newsData) => News.create(newsData);

const findAllNews = async () => News.find().sort({ publishedAt: -1 });

export { createNews, findAllNews };

import {
  createNews,
  findAllNews,
} from "../repositories/news.repository.js";
import { validateNews } from "../validators/news.validator.js";

const getNews = async () => findAllNews();

const publishNews = async (newsData) => {
  validateNews(newsData);

  return createNews({
    title: newsData.title.trim(),
    content: newsData.content.trim(),
    author: newsData.author?.trim() || "Equipo Fix IT!",
  });
};

export { getNews, publishNews };

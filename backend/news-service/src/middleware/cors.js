const cors = (req, res, next) => {
  const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
};

export default cors;

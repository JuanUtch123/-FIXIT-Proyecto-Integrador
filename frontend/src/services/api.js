const URLS = {
  users: import.meta.env.VITE_USER_API_URL || "http://localhost:3001",
  progress: import.meta.env.VITE_PROGRESS_API_URL || "http://localhost:3002",
  sessions: import.meta.env.VITE_SESSION_API_URL || "http://localhost:3003",
};

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.error_type || "No fue posible conectar con el servidor");
  return data;
};

export const api = {
  login: (credentials) => request(`${URLS.users}/users/login`, { method: "POST", body: JSON.stringify(credentials) }),
  register: (form) => request(`${URLS.users}/users/register`, { method: "POST", body: JSON.stringify(form) }),
  user: (id) => request(`${URLS.users}/users/${id}`),
  leaderboard: () => request(`${URLS.users}/users/leaderboard`),
  progress: (id) => request(`${URLS.progress}/progress/${id}`),
  sessionSummary: (id) => request(`${URLS.sessions}/sessions/user/${id}/summary`),
  sessions: (id) => request(`${URLS.sessions}/sessions/user/${id}`),
};

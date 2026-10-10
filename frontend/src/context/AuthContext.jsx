import { useState } from "react";
import { api } from "../services/api";
import { AuthContext } from "./auth";
const STORAGE_KEY = "fixit_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); }
    catch { return null; }
  });

  const saveUser = (nextUser, remember = true) => {
    setUser(nextUser);
    if (remember) localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const login = async (credentials, remember) => {
    const { user: loggedUser } = await api.login(credentials);
    saveUser(loggedUser, remember);
    return loggedUser;
  };

  const register = async (form, remember) => {
    const { user: createdUser } = await api.register(form);
    saveUser(createdUser, remember);
    return createdUser;
  };

  const logout = () => { localStorage.removeItem(STORAGE_KEY); setUser(null); };

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}

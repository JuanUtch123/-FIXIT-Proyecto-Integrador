import { useEffect, useState } from "react";
import { useAuth } from "../context/auth";
import { api } from "../services/api";

export function usePlayerData({ withSummary = false, withProgress = false } = {}) {
  const { user: sessionUser } = useAuth();
  const [data, setData] = useState({ user: sessionUser, summary: null, progress: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionUser?._id) return;
    const load = async () => {
      setLoading(true); setError("");
      try {
        const calls = [api.user(sessionUser._id)];
        if (withSummary) calls.push(api.sessionSummary(sessionUser._id));
        if (withProgress) calls.push(api.progress(sessionUser._id).catch((e) => e.message === "Progress not found" ? null : Promise.reject(e)));
        const results = await Promise.all(calls);
        let index = 1;
        setData({ user: results[0], summary: withSummary ? results[index++] : null, progress: withProgress ? results[index] : null });
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    };
    load();
  }, [sessionUser?._id, withSummary, withProgress]);

  return { ...data, loading, error };
}

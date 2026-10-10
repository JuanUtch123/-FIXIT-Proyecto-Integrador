import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Bell, ChartNoAxesCombined, ChevronDown, Clock3, Crown, Eye, Home, Search, Trophy, UserRound, LogOut } from "lucide-react";
import "../styles/perfil.css";
import "../styles/dashboard.css";
import { useAuth } from "../context/auth";
import { api } from "../services/api";
import { formatTime, playerLevel } from "../utils/player";

function Leaderboard() {
  const { user, logout } = useAuth();
  const [jugadores, setJugadores] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { api.leaderboard().then(setJugadores).catch((e) => setError(e.message)); }, []);
  const posicion = jugadores.findIndex((j) => j._id === user?._id) + 1;
  const actual = jugadores.find((j) => j._id === user?._id) || user;
  const score = actual?.stats?.totalScore || 0;
  return <div className="perfil-page"><aside className="perfil-sidebar"><img src="/images/Logo2.png" alt="Fix IT!" className="perfil-logo"/><nav className="perfil-nav"><NavLink to="/home"><Home/><span>Inicio</span></NavLink><NavLink to="/estadisticas"><ChartNoAxesCombined/><span>Estadísticas</span></NavLink><NavLink to="/leaderboard" className="activo"><Trophy/><span>Leaderboard</span></NavLink><NavLink to="/perfil"><UserRound/><span>Perfil</span></NavLink></nav><NavLink to="/" replace className="cerrar-sesion" onClick={logout}><LogOut/><span>Cerrar sesión</span></NavLink></aside>
    <section className="perfil-contenido"><header className="perfil-topbar"><img src="/images/networkGuy2.png" alt="Avatar"/><div className="topbar-usuario"><strong>{user?.username}</strong><small>Nivel {playerLevel(score)}</small></div><ChevronDown className="flecha"/></header>
    <main className="dash-main"><div className="leader-titulo"><div><h1>Leaderboard</h1><p>Compite, mejora tus tiempos y alcanza el primer lugar.</p></div><button aria-label="Buscar"><Search/></button></div>
      {error && <p className="api-error">{error}</p>}
      <section className="jugador-destacado"><div className="puesto"><Crown/><strong>#{posicion || "-"}</strong></div><img src="/images/networkGuy2.png" alt={user?.username}/><div><h2>{user?.username}</h2><p><Eye/> {score.toLocaleString("es-MX")} puntos</p></div><div className="nivel-rank"><span>Tu posición actual</span><strong>{posicion || "-"}</strong></div></section>
      <section className="dash-panel ranking-panel"><div className="ranking-head"><h2>Clasificación general</h2><span>{jugadores.length} jugadores</span></div><div className="tabla-scroll"><table className="ranking-tabla"><thead><tr><th>Posición</th><th>Jugador</th><th><Clock3/> Tiempo jugado</th><th>Victorias</th><th>Puntos</th></tr></thead><tbody>{jugadores.map((j,i)=>{ const total=(j.stats?.totalTicketsCompleted||0)+(j.stats?.totalTicketsFailed||0); const win=total ? ((j.stats.totalTicketsCompleted/total)*100).toFixed(1) : "0.0"; return <tr key={j._id}><td><span className={`posicion p${i+1}`}>{i+1}</span></td><td className="jugador-celda"><img src="/images/networkGuy2.png" alt=""/><strong>{j.username}</strong></td><td>{formatTime(j.stats?.totalPlayTimeSeconds)}</td><td>{win}%</td><td className="puntos">{j.stats?.totalScore || 0}</td></tr>})}</tbody></table></div></section>
    </main></section></div>;
}
export default Leaderboard;

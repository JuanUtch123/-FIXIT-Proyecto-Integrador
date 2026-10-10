import { NavLink } from "react-router-dom";
import { Bell, ChartNoAxesCombined, CheckCircle2, ChevronDown, Clock3, Home, Laptop, Star, Trophy, UserRound, LogOut } from "lucide-react";
import "../styles/perfil.css";
import "../styles/dashboard.css";
import { useAuth } from "../context/auth";
import { usePlayerData } from "../hooks/usePlayerData";
import { formatTime, playerLevel } from "../utils/player";

const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function Navegacion({ activo, logout }) {
  return <aside className="perfil-sidebar"><img src="/images/Logo2.png" alt="Fix IT!" className="perfil-logo" />
    <nav className="perfil-nav"><NavLink to="/home"><Home/><span>Inicio</span></NavLink><NavLink to="/estadisticas" className={activo === "estadisticas" ? "activo" : ""}><ChartNoAxesCombined/><span>Estadísticas</span></NavLink><NavLink to="/leaderboard"><Trophy/><span>Leaderboard</span></NavLink><NavLink to="/perfil"><UserRound/><span>Perfil</span></NavLink></nav><NavLink to="/" replace className="cerrar-sesion" onClick={logout}><LogOut/><span>Cerrar sesión</span></NavLink>
  </aside>;
}

function Encabezado({ user }) { return <header className="perfil-topbar"><img src="/images/networkGuy2.png" alt="Avatar"/><div className="topbar-usuario"><strong>{user?.username || "Jugador"}</strong><small>Nivel {playerLevel(user?.stats?.totalScore)}</small></div><ChevronDown className="flecha"/></header>; }

function Estadisticas() {
  const { logout } = useAuth();
  const { user, summary, error } = usePlayerData({ withSummary: true });
  const stats = user?.stats || {};
  const barras = summary?.weekly || [0, 0, 0, 0, 0, 0, 0];
  const maxBarra = Math.max(...barras, 1);
  const tipos = summary?.repairTypes || {};
  const totalTipos = Object.values(tipos).reduce((a, b) => a + b, 0) || 1;
  const tipoPorcentaje = (nombre) => Math.round(((tipos[nombre] || 0) / totalTipos) * 100);
  const reparaciones = summary?.recent || [];
  return <div className="perfil-page"><Navegacion activo="estadisticas" logout={logout}/><section className="perfil-contenido"><Encabezado user={user}/><main className="dash-main">
    <div className="dash-titulo"><h1>Estadísticas</h1><p>Revisa tu progreso y el impacto de tus reparaciones.</p></div>
    {error && <p className="api-error">{error}</p>}
    <section className="metricas">
      <article><Laptop/><div><span>Laptops reparadas</span><strong>{stats.totalTicketsCompleted || 0}</strong></div></article>
      <article><Star className="estrella"/><div><span>Estrellas totales</span><strong>{stats.totalStars || 0}</strong></div></article>
      <article><Clock3/><div><span>Tiempo jugado</span><strong>{formatTime(stats.totalPlayTimeSeconds)}</strong></div></article>
    </section>
    <section className="graficas-grid">
      <article className="dash-panel"><h2>Progreso por semana</h2><div className="grafica-barras"><div className="eje"><span>{maxBarra}</span><span>{Math.round(maxBarra*.66)}</span><span>{Math.round(maxBarra*.33)}</span><span>0</span></div><div className="barras">{barras.map((valor,i)=><div className="barra-col" key={dias[i]}><div className="barra" style={{height:`${valor/maxBarra*100}%`}}/><span>{dias[i]}</span></div>)}</div></div></article>
      <article className="dash-panel"><h2>Tipo de reparaciones</h2><div className="pastel-wrap"><div className="pastel"><div><strong>{stats.totalTicketsCompleted || 0}</strong><span>Total</span></div></div><ul><li><i className="pantalla"/>Pantalla <b>{tipoPorcentaje("Pantalla")}%</b></li><li><i className="bateria"/>Batería <b>{tipoPorcentaje("Batería")}%</b></li><li><i className="teclado"/>Teclado <b>{tipoPorcentaje("Teclado")}%</b></li><li><i className="otros"/>Otros <b>{tipoPorcentaje("Otros")}%</b></li></ul></div></article>
    </section>
    <section className="dash-panel tabla-panel"><div className="panel-head"><h2>Últimas reparaciones</h2><button>Ver todas</button></div><div className="tabla-scroll"><table><thead><tr><th>#</th><th>Equipo</th><th>Tipo</th><th>Fecha</th><th>Resultado</th></tr></thead><tbody>{reparaciones.map((r,i)=><tr key={r._id}><td>{i+1}</td><td>{r.equipment}</td><td>{r.repairType}</td><td>{new Date(r.playedAt).toLocaleDateString("es-MX")}</td><td className="completada"><CheckCircle2/>{r.completed ? "Completada" : "Fallida"}</td></tr>)}</tbody></table>{!reparaciones.length && <p className="tabla-vacia">Aún no hay reparaciones registradas.</p>}</div></section>
  </main></section></div>;
}
export default Estadisticas;

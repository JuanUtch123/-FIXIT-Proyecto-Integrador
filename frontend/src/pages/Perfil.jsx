import { NavLink } from "react-router-dom";
import {
  Bell, ChevronDown, CircleCheck, CircleX, Clock3, Crown, Home, Medal,
  MonitorCheck, Star, Trophy, UserRound, Wrench, ChartNoAxesCombined, LogOut,
} from "lucide-react";
import "../styles/perfil.css";
import { useAuth } from "../context/auth";
import { usePlayerData } from "../hooks/usePlayerData";
import { formatTime, levelPercent, playerLevel } from "../utils/player";

const logros = [
  { nombre: "Experto en reparación", Icono: Wrench, tipo: "oro" },
  { nombre: "Jugador destacado", Icono: Star, tipo: "diamante" },
  { nombre: "Tickets completados", Icono: MonitorCheck, tipo: "plata" },
  { nombre: "Racha de soluciones", Icono: Medal, tipo: "bronce" },
];

function Perfil() {
  const { logout } = useAuth();
  const { user, error } = usePlayerData({ withProgress: true });
  const stats = user?.stats || {};
  const nivel = playerLevel(stats.totalScore);
  const porcentaje = levelPercent(stats.totalScore);
  const resumen = [
    { etiqueta: "Puntuación", valor: stats.totalScore || 0, Icono: Crown, tipo: "amarillo" },
    { etiqueta: "Tickets completados", valor: stats.totalTicketsCompleted || 0, Icono: CircleCheck, tipo: "verde" },
    { etiqueta: "Tickets fallidos", valor: stats.totalTicketsFailed || 0, Icono: CircleX, tipo: "naranja" },
    { etiqueta: "Tiempo jugado", valor: formatTime(stats.totalPlayTimeSeconds), Icono: Clock3, tipo: "azul" },
  ];
  return (
    <div className="perfil-page">
      <aside className="perfil-sidebar">
        <img src="/images/Logo2.png" alt="Fix IT!" className="perfil-logo" />
        <nav className="perfil-nav" aria-label="Navegación principal">
          <NavLink to="/home"><Home aria-hidden="true" /><span>Inicio</span></NavLink>
          <NavLink to="/estadisticas"><ChartNoAxesCombined aria-hidden="true" /><span>Estadísticas</span></NavLink>
          <NavLink to="/leaderboard"><Trophy aria-hidden="true" /><span>Leaderboard</span></NavLink>
          <NavLink to="/perfil" className={({ isActive }) => (isActive ? "activo" : "")}>
            <UserRound aria-hidden="true" /><span>Perfil</span>
          </NavLink>
        </nav>
        <NavLink to="/" replace className="cerrar-sesion" onClick={logout}><LogOut/><span>Cerrar sesión</span></NavLink>
      </aside>

      <section className="perfil-contenido">
        <header className="perfil-topbar">
          
          <img src="/images/networkGuy2.png" alt="Avatar de Jugador1" />
          <div className="topbar-usuario"><strong>{user?.username || "Jugador"}</strong><small>Nivel {nivel}</small></div>
          <ChevronDown className="flecha" aria-hidden="true" />
        </header>

        <main className="perfil-main">
          <div className="perfil-titulo">
            <h1>Mi Perfil</h1>
            <p>Aquí puedes ver tu progreso y todo lo que has logrado en Fix IT!</p>
          </div>
          {error && <p className="api-error">{error}</p>}

          <div className="perfil-grid">
            <section className="panel tarjeta-jugador">
              <div className="avatar-grande">
                <div className="avatar-resplandor" />
                <img src="/images/networkGuy2.png" alt="Personaje Network Guy" />
              </div>
              <div className="datos-jugador">
                <h2>{user?.username || "Jugador"}</h2><h3>Nivel {nivel}</h3>
                <div className="barra-fila">
                  <div className="barra-progreso" aria-label={`Progreso del nivel: ${porcentaje}%`}><span style={{width: `${porcentaje}%`}} /></div>
                  <strong>{porcentaje}%</strong>
                </div>
                <blockquote>“El esfuerzo de hoy es el éxito de mañana.”<cite>— Network Guy</cite></blockquote>
              </div>
            </section>

            <section className="panel resumen-panel">
              <h2>Resumen</h2>
              <div className="resumen-lista">
                {resumen.map(({ etiqueta, valor, Icono, tipo }) => (
                  <div className="resumen-item" key={etiqueta}>
                    <span className={`resumen-icono ${tipo}`}><Icono /></span>
                    <span>{etiqueta}</span><strong>{valor}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel logros-panel">
              <div className="logros-encabezado"><h2>Logros Recientes</h2><button type="button">Ver todos</button></div>
              <div className="logros-lista">
                {logros.map(({ nombre, Icono, tipo }) => (
                  <article className={`logro ${tipo}`} key={nombre} title={nombre}>
                    <div className="medalla"><Icono /></div><span>{nombre}</span>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </main>
      </section>
    </div>
  );
}

export default Perfil;

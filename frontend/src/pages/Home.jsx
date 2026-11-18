import { NavLink, Link } from "react-router-dom";
import {
  Bell, ChartNoAxesCombined, ChevronDown, ChevronRight, CircleCheck,
  Gamepad2, Gauge, Home as HomeIcon, Laptop, Play, ShieldCheck,
  Sparkles, Trophy, UserRound, Wrench, LogOut, MessageCircle,
} from "lucide-react";
import "../styles/perfil.css";
import "../styles/home.css";
import { useAuth } from "../context/auth";
import { usePlayerData } from "../hooks/usePlayerData";
import { formatTime, levelPercent, playerLevel } from "../utils/player";
import InstallPWA from "../components/InstallPWA";

const pasos = [
  {
  
    Icono: Laptop,
    titulo: "Busca el componente",
    texto: "Explora el almacén y selecciona la pieza solicitada.",
    imagen: "/images/paso-almacen.png",
  },
  {
   
    Icono: Wrench,
    titulo: "Identifica la pieza correcta",
    texto: "Compara las piezas y elige la compatible con el equipo.",
    imagen: "/images/paso-componentes.png",
  },
  {
    
    Icono: Trophy,
    titulo: "Completa la reparación",
    texto: "Instala el componente, termina la misión y gana experiencia.",
    imagen: "/images/paso-reparacion2.png",
  },
];
function Home() {
  const { logout } = useAuth();
  const { user } = usePlayerData();
  const stats = user?.stats || {};
  const nivel = playerLevel(stats.totalScore);
  const porcentaje = levelPercent(stats.totalScore);
  return (
    <div className="perfil-page home-page">
      <aside className="perfil-sidebar">
        <img src="/images/Logo2.png" alt="Fix IT!" className="perfil-logo" />
        <nav className="perfil-nav">
          <NavLink to="/home" className="activo"><HomeIcon/><span>Inicio</span></NavLink>
          <NavLink to="/estadisticas"><ChartNoAxesCombined/><span>Estadísticas</span></NavLink>
          <NavLink to="/leaderboard"><Trophy/><span>Leaderboard</span></NavLink>
          <NavLink to="/perfil"><UserRound/><span>Perfil</span></NavLink>
        </nav>
        <NavLink to="/" replace className="cerrar-sesion" onClick={logout}><LogOut/><span>Cerrar sesión</span></NavLink>
      </aside>

      <section className="perfil-contenido">
        {/* Encabezado */}
        <header className="perfil-topbar home-topbar">
          <div className="mini-marca">
            <Gamepad2 />
            <span>Centro de misiones</span>
          </div>

          <div className="topbar-acciones">
            <InstallPWA />

            <img
              src="/images/networkGuyConOjos.png"
              alt={`Avatar de ${user?.username || "Jugador"}`}
            />

            <div className="topbar-usuario">
              <strong>
                {user?.username || "Jugador"}
              </strong>

              <small>Nivel {nivel}</small>
            </div>

            <ChevronDown
              className="flecha"
              aria-hidden="true"
            />
          </div>
        </header>

        <main className="home-main">
          <section className="home-hero">
            <div className="hero-circuito circuito-uno"/><div className="hero-circuito circuito-dos"/>
            <div className="hero-copy">
              <div className="hero-etiqueta"><Sparkles/> Aprende jugando</div>
              <h1>Conviértete en un<br/><span>experto en reparación</span></h1>
              <p>Fix IT! es un juego interactivo donde diagnosticas fallas, reparas computadoras y acumulas experiencia mientras desarrollas habilidades técnicas.</p>
              <div className="hero-acciones">
                <button className="boton-jugar"><Play/> Comenzar misión</button>
                <a href="#como-jugar" className="boton-conocer">Conocer el juego <ChevronRight/></a>
              </div>
              <div className="hero-datos"><div><strong>{stats.totalTicketsCompleted || 0}</strong><span>reparaciones</span></div><div><strong>{stats.totalScore || 0}</strong><span>puntos ganados</span></div><div><strong>{formatTime(stats.totalPlayTimeSeconds)}</strong><span>de práctica</span></div></div>
            </div>

            <div className="hero-visual">
              <div className="orbita orbita-uno"/><div className="orbita orbita-dos"/>
              <div className="resplandor-personaje"/>
              <img src="/images/networkGuyConOjos.png" alt="Personaje principal de Fix IT" className="hero-personaje"/>
              <div className="tarjeta-flotante tarjeta-nivel"><Gauge/><div><span>Nivel {nivel}</span><strong>{porcentaje}% completado</strong></div></div>
              <div className="tarjeta-flotante tarjeta-ticket"><CircleCheck/><div><span>Último ticket</span><strong>¡Reparación exitosa!</strong></div></div>
              <div className="chip-flotante chip-uno"><Wrench/></div><div className="chip-flotante chip-dos"><ShieldCheck/></div>
            </div>
          </section>

          <div className="cinta-juego"><div><span>DIAGNOSTICA</span><i/> <span>REPARA</span><i/> <span>APRENDE</span><i/> <span>SUBE DE NIVEL</span><i/> <span>DIAGNOSTICA</span><i/> <span>REPARA</span></div></div>

          <section className="como-jugar" id="como-jugar">
            <div className="seccion-heading"><span>CÓMO FUNCIONA</span><h2>Tu camino para dominar<br/>la reparación técnica</h2><p>Cada misión te plantea un problema diferente. Observa, decide y aplica tus conocimientos.</p></div>
<div className="pasos-grid">{pasos.map(({ numero, Icono, titulo, texto, imagen }) => <article className="paso-card" key={numero}><span className="paso-numero">{numero}</span><div className="paso-encabezado"><div className="paso-icono"><Icono /></div><h3>{titulo}</h3></div><div className="paso-imagen-contenedor"><img src={imagen} alt={titulo} className="paso-imagen" loading="lazy" /></div><p>{texto}</p></article>)}</div>          </section>

<section className="home-cta"><div className="cta-contenido"><span>¿LISTO PARA EL RETO?</span><h2>La próxima reparación<br />depende de ti.</h2><p>Entra al taller, completa una misión y mejora tu posición en el leaderboard.</p><Link to="/estadisticas">Ver mi progreso<ChevronRight /></Link></div><div className="cta-visual"><div className="cta-resplandor"></div><img src="/images/banner-personajes.png" alt="Equipo técnico de Fix IT" className="cta-personajes" loading="lazy" /></div></section>
          <footer className="fixit-footer">
            <div className="footer-principal">
              <div className="footer-marca"><img src="/images/Logo2.png" alt="Fix IT!"/><p>Aprende a diagnosticar y reparar computadoras mientras completas misiones y mejoras tus habilidades.</p></div>
              <div><h3>Navegación</h3><Link to="/home">Inicio</Link><Link to="/estadisticas">Estadísticas</Link><Link to="/leaderboard">Leaderboard</Link><Link to="/perfil">Perfil</Link></div>
              <div><h3>Contacto</h3><a href="mailto:contacto@fixit.com">contacto@fixit.com</a><span>Chihuahua, México</span><div className="footer-redes"><a href="#instagram" aria-label="Instagram" className="red-letra">◎</a><a href="#x" aria-label="X" className="red-x">X</a><a href="#facebook" aria-label="Facebook" className="red-letra">f</a><a href="#whatsapp" aria-label="WhatsApp"><MessageCircle/></a></div></div>
            </div>
            <div className="footer-inferior"><span>© 2026 Fix IT! Todos los derechos reservados.</span><span>Proyecto educativo · UTCH</span></div>
          </footer>
        </main>
      </section>
    </div>
  );
}

export default Home;

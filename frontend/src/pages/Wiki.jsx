import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowDown, ArrowUpRight, BookOpen, ChartNoAxesCombined, ChevronLeft, ChevronRight, Home, LogOut, Maximize2, Trophy, UserRound, Users, X } from "lucide-react";
import { useAuth } from "../context/auth";
import WikiNavLink from "../components/WikiNavLink";
import { characters, tutorials } from "../data/wiki";
import "../styles/perfil.css";
import "../styles/wiki.css";

export default function Wiki() {
  const { logout } = useAuth();
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash]);
  const [selected, setSelected] = useState(characters[0].id);
  const [slide, setSlide] = useState(0);
  const viewer = useRef(null);
  const character = characters.find(({ id }) => id === selected);
  const tutorial = tutorials[slide];
  const changeSlide = (direction) => setSlide((current) => (current + direction + tutorials.length) % tutorials.length);

  return <div className="perfil-page wiki-page">
    <aside className="perfil-sidebar">
      <img src="/images/Logo2.png" alt="Fix IT!" className="perfil-logo" />
      <nav className="perfil-nav" aria-label="Navegación principal">
        <NavLink to="/home"><Home aria-hidden="true" /><span>Inicio</span></NavLink>
        <NavLink to="/estadisticas"><ChartNoAxesCombined aria-hidden="true" /><span>Estadísticas</span></NavLink>
        <NavLink to="/leaderboard"><Trophy aria-hidden="true" /><span>Leaderboard</span></NavLink>
        <NavLink to="/perfil"><UserRound aria-hidden="true" /><span>Perfil</span></NavLink>
        <WikiNavLink />
      </nav>
      <NavLink to="/" replace className="cerrar-sesion" onClick={logout}><LogOut aria-hidden="true" /><span>Cerrar sesión</span></NavLink>
    </aside>
    <section className="perfil-contenido">
      <header className="perfil-topbar wiki-topbar"><BookOpen aria-hidden="true" /><span>Archivo de Fix IT Corp</span></header>
      <main className="wiki-main">
        <section className="wiki-hero" aria-labelledby="wiki-title">
          <div className="wiki-eyebrow"><span /> MANUAL DEL TALLER · VOL. 01</div>
          <h1 id="wiki-title">Conoce al equipo.<br /><em>Domina el taller.</em></h1>
          <p>Bienvenido al departamento de TI de Fix It Corp. Conoce a quienes mantienen todo en marcha y aprende a resolver el próximo desastre.</p>
          <div className="wiki-hero-actions"><a href="#personajes"><Users aria-hidden="true" /> Los personajes <ArrowDown aria-hidden="true" /></a><a href="#tutorial">Cómo jugar <ArrowUpRight aria-hidden="true" /></a><a href="#trailer">Ver tráiler <ArrowUpRight aria-hidden="true" /></a></div>
          <div className="wiki-hero-note"><span>04 / PERSONAJES</span><span>05 / GUÍAS VISUALES</span><span>01 / EQUIPO</span></div>
        </section>

        <section id="trailer" className="wiki-section" aria-labelledby="trailer-title">
          <div className="wiki-section-heading"><div><span className="wiki-eyebrow">EN PANTALLA / FIX IT!</span><h2 id="trailer-title">Un vistazo al caos del taller</h2></div><p id="trailer-description">Dale play al tráiler del juego y conoce el mundo de Fix IT! antes de comenzar tu próxima misión.</p></div>
          <div className="wiki-trailer">
            <video controls playsInline preload="metadata" aria-label="Tráiler del juego Fix IT!" aria-describedby="trailer-description">
              <source src="/wiki/trailer-fixit.mp4" type="video/mp4" />
              Tu navegador no permite reproducir este video. Puedes abrirlo con el enlace que aparece debajo.
            </video>
            <div className="wiki-trailer-caption"><span>FIX IT! / TRÁILER DEL JUEGO</span><a href="/wiki/trailer-fixit.mp4" target="_blank" rel="noopener noreferrer">Abrir video <ArrowUpRight size={16} aria-hidden="true" /></a></div>
          </div>
        </section>

        <section id="personajes" className="wiki-section" aria-labelledby="characters-title">
          <div className="wiki-section-heading"><div><span className="wiki-eyebrow">01 / EL EQUIPO</span><h2 id="characters-title">Los rostros detrás de la reparación</h2></div><p>Hasta cuatro jugadores pueden elegir a su personaje en el lobby. Cada uno tiene una historia que contar.</p></div>
          <div className="wiki-roster" role="group" aria-label="Seleccionar personaje">
            {characters.map((item) => <button key={item.id} type="button" className={`wiki-character ${selected === item.id ? "selected" : ""}`} style={{ "--character-color": item.color }} aria-pressed={selected === item.id} aria-controls="character-details" onClick={() => setSelected(item.id)}>
              <span className="wiki-character-portrait" aria-hidden="true">{item.image ? <img src={item.image} alt="" /> : <span>{item.initials}</span>}</span>
              <span className="wiki-character-name">{item.name}</span><span className="wiki-character-alias">{item.alias}</span><span className="wiki-character-index" aria-hidden="true">0{characters.indexOf(item) + 1}</span>
            </button>)}
          </div>
          <article id="character-details" className="wiki-dossier" style={{ "--character-color": character.color }} aria-labelledby="character-name">
            <div className="wiki-dossier-intro"><img className="wiki-dossier-portrait" src={character.image} alt={`Retrato de ${character.name}, ${character.alias}`} /><span className="wiki-eyebrow">EXPEDIENTE / {character.role}</span><h3 id="character-name">{character.name}<span>{character.alias}</span></h3><p>{character.summary}</p><span className="wiki-playable"><Users size={15} aria-hidden="true" /> Personaje jugable</span></div>
            <div className="wiki-dossier-copy"><h4>Su personalidad</h4><p>{character.personality}</p><h4>Su historia en Fix It Corp</h4><p>{character.story}</p></div>
          </article>
        </section>

        <section id="tutorial" className="wiki-section" aria-labelledby="tutorial-title">
          <div className="wiki-section-heading"><div><span className="wiki-eyebrow">02 / APRENDE JUGANDO</span><h2 id="tutorial-title">Tu primera misión empieza aquí</h2></div><p>Recorre las guías ilustradas. Puedes abrir cada lámina a tamaño completo para consultar sus detalles.</p></div>
          <div className="wiki-guide-layout">
            <div className="wiki-guide-menu" role="group" aria-label="Elegir guía del tutorial">{tutorials.map((item, index) => <button type="button" key={item.id} className={index === slide ? "selected" : ""} aria-pressed={index === slide} aria-controls="tutorial-content" onClick={() => setSlide(index)}><span>0{index + 1}</span><span><small>{item.category}</small><strong>{item.title}</strong></span><ChevronRight aria-hidden="true" /></button>)}</div>
            <article id="tutorial-content" className="wiki-guide">
              <button className="wiki-guide-image" type="button" onClick={() => viewer.current?.showModal()} aria-label={`Ampliar: ${tutorial.title}`}><img src={tutorial.image} alt={tutorial.alt} loading="lazy" /><span><Maximize2 size={16} aria-hidden="true" /> Ampliar lámina</span></button>
              <div className="wiki-guide-copy" aria-live="polite"><span className="wiki-eyebrow">GUÍA {String(slide + 1).padStart(2, "0")} / 05</span><h3>{tutorial.title}</h3><p>{tutorial.description}</p></div>
              <div className="wiki-guide-controls"><button type="button" onClick={() => changeSlide(-1)}><ChevronLeft aria-hidden="true" /> Anterior</button><span>{slide + 1} / {tutorials.length}</span><button type="button" onClick={() => changeSlide(1)}>Siguiente <ChevronRight aria-hidden="true" /></button></div>
            </article>
          </div>
        </section>
        <footer className="wiki-footer"><span>FIX IT CORP / CONOCER · DIAGNOSTICAR · REPARAR</span><Link to="/home">Volver al taller <ArrowUpRight aria-hidden="true" /></Link></footer>
      </main>
    </section>
    <dialog ref={viewer} className="wiki-viewer" aria-labelledby="wiki-viewer-title">
      <div className="wiki-viewer-bar"><h2 id="wiki-viewer-title">{tutorial.title}</h2><form method="dialog"><button aria-label="Cerrar lámina"><X aria-hidden="true" /></button></form></div>
      <img src={tutorial.image} alt={tutorial.alt} />
      <p>Puedes desplazarte para consultar la ilustración completa.</p>
    </dialog>
  </div>;
}

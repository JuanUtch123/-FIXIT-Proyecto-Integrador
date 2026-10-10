import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Wrench,
  Laptop,
  Settings,
  UserRound,
} from "lucide-react";

import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const { user, login, register } = useAuth();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [recordarme, setRecordarme] = useState(true);
  const [modoRegistro, setModoRegistro] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => { if (user) navigate("/perfil", { replace: true }); }, [user, navigate]);

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setError(""); setEnviando(true);
    try {
      if (modoRegistro) await register({ username, email: correo, password }, recordarme);
      else await login({ email: correo, password }, recordarme);
      navigate("/perfil", { replace: true });
    } catch (e) { setError(e.message); }
    finally { setEnviando(false); }
  };

  return (
    <main className="login-page">

      {/* =========================================
          CIRCUITOS DECORATIVOS DEL FONDO
      ========================================== */}

      <div className="circuit-decoration circuit-decoration-tl">
  <span className="c-line tl-1"></span>
  <span className="c-line tl-2"></span>
  <span className="c-line tl-3"></span>
  <span className="c-node tl-node-1"></span>
  <span className="c-node tl-node-2"></span>
</div>

<div className="circuit-decoration circuit-decoration-tr">
  <span className="c-line tr-1"></span>
  <span className="c-line tr-2"></span>
  <span className="c-line tr-3"></span>
  <span className="c-node tr-node-1"></span>
</div>

<div className="circuit-decoration circuit-decoration-bl">
  <span className="c-line bl-1"></span>
  <span className="c-line bl-2"></span>
  <span className="c-line bl-3"></span>
  <span className="c-node bl-node-1"></span>
  <span className="c-node bl-node-2"></span>
</div>

<div className="circuit-decoration circuit-decoration-br">
  <span className="c-line br-1"></span>
  <span className="c-line br-2"></span>
  <span className="c-line br-3"></span>
  <span className="c-node br-node-1"></span>
</div>

      {/* =========================================
          ENGRANES DEL FONDO
      ========================================== */}

      <Settings className="background-gear gear-top-right" />

      <Settings className="background-gear gear-bottom-center" />

      <Settings className="background-gear gear-left" />


      {/* =========================================
          LADO IZQUIERDO
      ========================================== */}

      <section className="login-left">

        {/* LOGO */}

        <img
          src="/images/Logo2.png"
          alt="Fix IT!"
          className="fixit-logo"
        />


        {/* ZONA DEL PERSONAJE */}

        <div className="mascot-zone">

          {/* CÍRCULO NEÓN */}

          <div className="neon-circle"></div>


          {/* ICONO DE HERRAMIENTAS */}

          <div className="tech-icon wrench-icon">
            <Wrench />
          </div>


          {/* ENGRANE CERCA DEL PERSONAJE */}

          <div className="gear-icon">
            <Settings />
          </div>


          {/* ICONO DE LAPTOP */}

          <div className="tech-icon laptop-icon">
            <Laptop />
          </div>


          {/* PERSONAJE */}

          <img
            src="/images/networkGuy2.png"
            alt="Network Guy"
            className="network-guy"
          />

        </div>

      </section>


      {/* =========================================
          LADO DERECHO
      ========================================== */}

      <section className="login-right">

        <div className="login-card">

          {/* ENCABEZADO */}

          <div className="login-header">

            <h1>
              ¡Bienvenido!
            </h1>

            <p>
              {modoRegistro ? "Crea tu cuenta para comenzar" : "Inicia sesión para continuar"}
            </p>

          </div>


          {/* FORMULARIO */}

          <form onSubmit={iniciarSesion}>

            {modoRegistro && <div className="input-box"><UserRound />
              <input type="text" placeholder="Nombre de jugador" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>}

            {/* CORREO */}

            <div className="input-box">

              <Mail />

              <input
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) =>
                  setCorreo(e.target.value)
                }
                required
              />

            </div>


            {/* CONTRASEÑA */}

            <div className="input-box">

              <LockKeyhole />

              <input
                type={
                  mostrarPassword
                    ? "text"
                    : "password"
                }
                placeholder="Contraseña"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />


              {/* MOSTRAR CONTRASEÑA */}

              <button
                type="button"
                className="eye-button"
                onClick={() =>
                  setMostrarPassword(
                    !mostrarPassword
                  )
                }
                aria-label="Mostrar u ocultar contraseña"
              >

                {mostrarPassword ? (
                  <EyeOff />
                ) : (
                  <Eye />
                )}

              </button>

            </div>


            {/* OPCIONES */}

            <div className="login-options">

              <label className="remember">

                <input
                  type="checkbox"
                  checked={recordarme}
                  onChange={(e) =>
                    setRecordarme(
                      e.target.checked
                    )
                  }
                />

                <span>
                  Recordarme
                </span>

              </label>


              <button
                type="button"
                className="forgot"
              >
                ¿Olvidaste tu contraseña?
              </button>

            </div>


            {/* BOTÓN LOGIN */}

            <button
              type="submit"
              className="login-submit"
              disabled={enviando}
            >
              {enviando ? "Conectando..." : modoRegistro ? "Crear cuenta" : "Iniciar sesión"}
            </button>

            {error && <p className="login-error" role="alert">{error}</p>}

          </form>


          {/* SEPARADOR */}

          <div className="separator">

            <span></span>

            <p>o</p>

            <span></span>

          </div>


          {/* REGISTRO */}

          <div className="register">

            <span>
              {modoRegistro ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}
            </span>

            <button type="button" onClick={() => { setModoRegistro(!modoRegistro); setError(""); }}>
              {modoRegistro ? "Inicia sesión" : "Regístrate"}
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Login;

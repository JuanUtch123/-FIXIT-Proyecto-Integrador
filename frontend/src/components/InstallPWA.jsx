import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { MonitorDown, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/auth";
import { consumeInstallPrompt, getInstallPrompt, subscribeInstallPrompt } from "../services/pwaInstall";

function InstallPWA() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const installPrompt = useSyncExternalStore(subscribeInstallPrompt, getInstallPrompt);
  const [instalada, setInstalada] = useState(false);
  const instructions = useRef(null);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)");
    const actualizarModo = () => setInstalada(standalone.matches || window.navigator.standalone === true);
    actualizarModo();

    const confirmarInstalacion = () => {
      actualizarModo();
      instructions.current?.close();
    };

    window.addEventListener("appinstalled", confirmarInstalacion);
    standalone.addEventListener("change", actualizarModo);
    return () => {
      window.removeEventListener("appinstalled", confirmarInstalacion);
      standalone.removeEventListener("change", actualizarModo);
    };
  }, []);

  const instalarAplicacion = async () => {
    if (!installPrompt) {
      instructions.current?.showModal();
      return;
    }
    // El navegador permite utilizar cada aviso de instalación una sola vez.
    const prompt = consumeInstallPrompt();
    if (!prompt) return;
    try {
      await prompt.prompt();
      await prompt.userChoice;
    } catch {
      instructions.current?.showModal();
    }
  };

  if (instalada || !user || pathname === "/") return null;

  return (
    <>
      <button
        type="button"
        className="install-pwa-button"
        onClick={instalarAplicacion}
        aria-label="Instalar aplicación"
      >
        <MonitorDown aria-hidden="true" />
      </button>
      <dialog ref={instructions} className="install-pwa-dialog" aria-labelledby="install-pwa-title">
        <form method="dialog">
          <button className="install-pwa-close" aria-label="Cerrar instrucciones"><X aria-hidden="true" /></button>
        </form>
        <h2 id="install-pwa-title">Instalar Fix IT!</h2>
        <p>En Chrome o Edge, abre el menú del navegador y busca la opción para instalar esta aplicación.</p>
        <p>En iPhone o iPad, abre la página en Safari y selecciona Compartir → Añadir a la pantalla de inicio.</p>
        <p>Si la opción no aparece, comprueba si ya está instalada o prueba con un navegador compatible.</p>
      </dialog>
    </>
  );
}

export default InstallPWA;

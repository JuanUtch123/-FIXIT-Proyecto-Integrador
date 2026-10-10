import { useEffect, useState } from "react";
import { Download } from "lucide-react";

function InstallPWA() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [instalada, setInstalada] = useState(false);

  useEffect(() => {
    const guardarEvento = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    const confirmarInstalacion = () => {
      setInstalada(true);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", guardarEvento);
    window.addEventListener("appinstalled", confirmarInstalacion);

    return () => {
      window.removeEventListener("beforeinstallprompt", guardarEvento);
      window.removeEventListener("appinstalled", confirmarInstalacion);
    };
  }, []);

  const instalarAplicacion = async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  if (!installPrompt || instalada) return null;

  return (
    <button
      type="button"
      className="install-pwa-button"
      onClick={instalarAplicacion}
    >
      <Download />
      Instalar aplicación
    </button>
  );
}

export default InstallPWA;
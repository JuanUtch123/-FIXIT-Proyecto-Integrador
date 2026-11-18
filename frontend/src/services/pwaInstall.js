// Se conserva durante toda la sesión, aunque React vuelva a montar una vista.
let pendingPrompt = null;
const listeners = new Set();
const notify = () => listeners.forEach((listener) => listener());

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  pendingPrompt = event;
  notify();
});
window.addEventListener("appinstalled", () => {
  pendingPrompt = null;
  notify();
});

export const getInstallPrompt = () => pendingPrompt;
export const subscribeInstallPrompt = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const consumeInstallPrompt = () => {
  const prompt = pendingPrompt;
  pendingPrompt = null;
  notify();
  return prompt;
};

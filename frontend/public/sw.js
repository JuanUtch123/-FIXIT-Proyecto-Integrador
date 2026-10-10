const CACHE_NAME = "fixit-cache-v1";

const APP_SHELL = [
  "/",
  "/manifest.json",
  "/favicon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/images/Logo2.png",
  "/images/networkGuy.png",
  "/images/networkGuy2.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);

  // No guardar las solicitudes del backend.
  if (
    requestUrl.port === "3001" ||
    requestUrl.port === "3002" ||
    requestUrl.port === "3003"
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseCopy = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseCopy);
        });

        return response;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);

        if (cachedResponse) return cachedResponse;

        if (event.request.mode === "navigate") {
          return caches.match("/");
        }

        return new Response("Sin conexión", {
          status: 503,
          headers: {
            "Content-Type": "text/plain; charset=utf-8"
          }
        });
      })
  );
});
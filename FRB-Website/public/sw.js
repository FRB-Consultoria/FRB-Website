/* FRB Consultoria — Service Worker
 * Estratégia:
 *  - Navegação (HTML/SPA): network-first com fallback para o app shell em cache (offline).
 *  - Assets estáticos do próprio domínio (js/css/img/icons): stale-while-revalidate.
 *  - Chamadas de API (outra origem / backend): nunca intercepta — passa direto pela rede.
 *
 * Bump CACHE_VERSION sempre que quiser forçar atualização do cache.
 */
const CACHE_VERSION = "frb-v1";
const APP_SHELL = "/areadocliente";

// Recursos garantidos no primeiro carregamento (ícones + shell).
const PRECACHE_URLS = [
  "/",
  "/areadocliente",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Só GET; só mesma origem. API/backend (origem diferente) passa direto.
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navegação (rotas do SPA) → network-first, fallback ao shell em cache.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(request, copy)).catch(() => {});
          return res;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match(APP_SHELL) || caches.match("/"))
        )
    );
    return;
  }

  // Assets estáticos → stale-while-revalidate.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(request, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});

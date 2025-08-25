importScripts("https://cdn.jsdelivr.net/npm/workbox-sw@7/build/workbox-sw.js");

if (workbox) {
  const APP_CACHE = "app-v4";
  const CDN_CACHE = "cdn-v1";

  // Dynamically determine base path
  // For GitHub Pages: /code-to-markup/, for local dev: /
  const BASE_PATH = self.location.pathname.replace(/\/sw\.js$/, "") || "";

  workbox.setConfig({ debug: false }); // Enable debug mode
  workbox.navigationPreload.enable();

  // Skip waiting and claim clients immediately on install
  self.addEventListener("install", (event) => {
    self.skipWaiting();
  });

  self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
  });

  workbox.precaching.cleanupOutdatedCaches();
  workbox.precaching.precacheAndRoute([
    { url: `${BASE_PATH}/index.html`, revision: APP_CACHE },
    { url: `${BASE_PATH}/app.js`, revision: APP_CACHE },
    { url: `${BASE_PATH}/styles.css`, revision: APP_CACHE },
    { url: `${BASE_PATH}/manifest.json`, revision: APP_CACHE },
  ]);

  // Navigation route for SPA - handles all navigation requests
  workbox.routing.registerRoute(
    new workbox.routing.NavigationRoute(
      workbox.precaching.createHandlerBoundToURL(`${BASE_PATH}/index.html`)
    )
  );

  // Cache other same-origin resources (but exclude navigation requests)
  workbox.routing.registerRoute(
    ({ request, url }) =>
      url.origin === self.location.origin && request.destination !== "document",
    new workbox.strategies.NetworkFirst({
      cacheName: APP_CACHE,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          purgeOnQuotaError: true,
        }),
      ],
    })
  );

  workbox.routing.registerRoute(
    ({ url }) => url.origin === "https://cdn.jsdelivr.net",
    new workbox.strategies.CacheFirst({
      cacheName: CDN_CACHE,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 120 * 24 * 60 * 60, // 120 days
          purgeOnQuotaError: true,
        }),
      ],
    })
  );
} else {
  console.log("Workbox failed to load");
}

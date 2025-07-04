importScripts("https://cdn.jsdelivr.net/npm/workbox-sw@7/build/workbox-sw.js");

if (workbox) {
  const APP_CACHE = "app-v1";
  const CDN_CACHE = "cdn-v1";

  workbox.setConfig({ debug: false });
  workbox.navigationPreload.enable();

  workbox.precaching.cleanupOutdatedCaches();
  workbox.precaching.precacheAndRoute([
    { url: "/index.html", revision: APP_CACHE },
  ]);

  workbox.routing.registerRoute(
    new workbox.routing.NavigationRoute(
      workbox.precaching.createHandlerBoundToURL("/index.html")
    )
  );

  workbox.routing.registerRoute(
    ({ url }) => url.origin === self.location.origin,
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

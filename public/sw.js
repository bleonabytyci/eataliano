
const CACHE_NAME = "eataliano-offline-v3";

const OFFLINE_FILES = [
  "/",
  "/offline",
  "/icon-192.png",
  "/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_FILES))
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/admin")
  ) {
    return;
  }

  // Faqet: provo internetin, pastaj përdor kopjen e ruajtur.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);

          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response.clone());
          }

          return response;
        } catch {
          const cachedPage = await caches.match(request);

          if (cachedPage) {
            return cachedPage;
          }

          const homePage = await caches.match("/");

          if (homePage) {
            return homePage;
          }

          const offlinePage = await caches.match("/offline");

          if (offlinePage) {
            return offlinePage;
          }

          return new Response("Je pa internet.", {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
            },
          });
        }
      })()
    );

    return;
  }

  // JavaScript, CSS, fotografitë dhe resurset e tjera.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      try {
        const response = await fetch(request);

        if (response.ok) {
          await cache.put(request, response.clone());
        }

        return response;
      } catch {
        const cachedResource = await cache.match(request);

        if (cachedResource) {
          return cachedResource;
        }

        return new Response("Resource unavailable offline.", {
          status: 503,
        });
      }
    })()
  );
});

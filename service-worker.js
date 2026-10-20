const CACHE_NAME = "learning-platform-shell-v22";
const RUNTIME_CACHE = "learning-platform-runtime-v4";
const APP_SHELL = [
  "./index.html",
  "./uni/index.html",
  "./cv/index.html",
  "./shared-theme.css?v=19",
  "./shared-theme.js?v=13",
  "./manifest.webmanifest",
  "./icon.svg",
  "./logo.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                (key.startsWith("learning-platform-shell-") ||
                 key.startsWith("learning-platform-runtime-")) &&
                key !== CACHE_NAME &&
                key !== RUNTIME_CACHE,
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function fetchAndCache(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(new Request(request, { cache: "no-store" }));
    if (response.ok && response.type !== "opaque") {
      try {
        await cache.put(request, response.clone());
      } catch (error) {
        console.warn("Could not update the offline copy:", error);
      }
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === "navigate") {
      // Try all main pages as fallback
      for (const page of ["./index.html", "./uni/index.html", "./cv/index.html"]) {
        const fallback = await caches.match(page);
        if (fallback) return fallback;
      }
    }
    throw error;
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(fetchAndCache(request));
});

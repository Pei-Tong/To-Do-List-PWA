const CACHE_NAME = "to-do-pwa-cache-v1";
const FILES_TO_CACHE = [
  "/To-Do-List-PWA/",
  "/To-Do-List-PWA/index.html",
  "/To-Do-List-PWA/style.css",
  "/To-Do-List-PWA/app.js",
  "/To-Do-List-PWA/manifest.json",
  "/To-Do-List-PWA/icons/icon-128.png",
  "/To-Do-List-PWA/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// sw.js - Service Worker（オフラインキャッシュ用）

const CACHE_NAME = "studyum-v1";
const URLS_TO_CACHE = [
  "/studyum-app/",
  "/studyum-app/index.html",
  "/studyum-app/StudyDuel.jsx",
  "/studyum-app/manifest.json",
  "/studyum-app/icon-192.png",
  "/studyum-app/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        if (fetchResponse && fetchResponse.status === 200) {
          const responseClone = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return fetchResponse;
      }).catch(() => {
        if (event.request.mode === "navigate") {
          return caches.match("/studyum-app/");
        }
      });
    })
  );
});

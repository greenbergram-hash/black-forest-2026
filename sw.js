// חשוב: כל שינוי ב-app.js / style.css / index.html מחייב העלאת המספר כאן.
// ה-Service Worker הוא cache-first, אז בלי זה מכשיר שכבר התקין את האפליקציה
// ימשיך להריץ את הגרסה הישנה לנצח.
const CACHE = "bf2026-v7";
const SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./images/ravennaschlucht.jpg",
  "./images/titisee.jpg",
  "./images/badeparadies.jpg",
  "./images/europapark.jpg",
  "./images/freiburg.jpg",
  "./images/todtnau-falls.jpg",
  "./images/blackforestline.jpg",
  "./images/rulantica.jpg",
  "./images/triberg.jpg",
  "./images/vogelpark.jpg",
  "./images/rheinfall.jpg",
  "./images/lindt.jpg",
  "./images/zurich-airport.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Cache-first for same-origin requests, so the app keeps working with no signal.
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, clone));
        }
        return res;
      }).catch(() => cached);
    })
  );
});

const CACHE_NAME = "ipr-cache-v1";

// Вариант для работы в офлайн режиме
// const urlsToCache = [
//     "/",
//     "/calculator-worker.js",
//     "/sw.js",
//     "/_next/static/css/app/page.css",
//     "/_next/static/chunks/main-app.js",
//     "/_next/static/chunks/app/layout.js",
//     "/_next/static/chunks/app/page.js",
// ];

const urlsToCache = [];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            if (urlsToCache.length === 0) {
                await cache.add(
                    new Request("/offline.html", { cache: "reload" })
                );
            }

            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                return self.clients.claim();
            })
    );
});

self.addEventListener("fetch", (event) => {
    const { request } = event;

    // Network First
    if (request.destination === "document") {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    if (urlsToCache.length === 0 && request.url.endsWith("/")) {
                        return caches.match("/offline.html");
                    }

                    return caches.match(request);
                })
        );
    }

    // Cache First
    else if (
        request.destination === "style" ||
        request.destination === "script" ||
        request.destination === "image"
    ) {
        event.respondWith(
            caches.match(request).then((response) => {
                if (response) {
                    return response;
                }
                return fetch(request).then((response) => {
                    if (
                        !response ||
                        response.status !== 200 ||
                        response.type !== "basic"
                    ) {
                        return response;
                    }
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                });
            })
        );
    }
});

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

// Service Worker para cache de recursos estáticos
const CACHE_NAME = "codenews-v1";
const STATIC_CACHE = [
  "/",
  "/index.html",
  // CSS e JS serão adicionados automaticamente pelo Vite
];

// Instala o service worker e faz cache dos recursos estáticos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache aberto");
      return cache.addAll(STATIC_CACHE);
    })
  );
});

// Intercepta requests e serve do cache quando possível
self.addEventListener("fetch", (event) => {
  // Só faz cache de recursos estáticos (não API calls)
  if (event.request.url.includes("/api/")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retorna do cache se encontrado
      if (response) {
        return response;
      }

      // Senão, busca da rede e adiciona ao cache
      return fetch(event.request).then((response) => {
        // Verifica se é uma resposta válida
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Clona a resposta
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Limpa caches antigos quando ativa
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Removendo cache antigo:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

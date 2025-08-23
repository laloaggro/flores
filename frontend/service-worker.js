// service-worker.js
// Service Worker para caché y offline

const CACHE_NAME = 'arreglos-victoria-v1.0';
const urlsToCache = [
  '/',
  '/frontend/',
  '/frontend/index.html',
  '/frontend/products.html',
  '/frontend/login.html',
  '/frontend/register.html',
  '/frontend/profile.html',
  '/frontend/checkout.html',
  '/frontend/wishlist.html',
  '/frontend/assets/css/styles.css',
  '/frontend/assets/js/app.js',
  '/frontend/assets/images/placeholder.svg'
];

// Instalación del service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación del service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptación de solicitudes
self.addEventListener('fetch', event => {
  // Solo manejar solicitudes que son para nuestro origen
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si encontramos la respuesta en caché, la devolvemos
        if (response) {
          return response;
        }
        
        // Si no está en caché, hacemos la solicitud de red
        return fetch(event.request).then(
          response => {
            // Verificamos si obtenemos una respuesta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Importante: CLONAMOS la respuesta. Una respuesta es un stream
            // y como queremos consumirla una vez para caché y una vez para
            // el navegador, necesitamos clonarla para poder enviar cada copia.
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          }
        );
      })
    );
});

// Manejo de mensajes desde la aplicación
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
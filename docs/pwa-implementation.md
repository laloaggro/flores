# Implementación de Progressive Web App (PWA)

## Introducción

Este documento describe cómo implementar una Progressive Web App (PWA) completa en la aplicación web de Arreglos Victoria para mejorar la experiencia del usuario y permitir el uso offline.

## Beneficios de una PWA

1. **Instalabilidad**: Los usuarios pueden instalar la aplicación en sus dispositivos
2. **Offline**: Funcionalidad limitada incluso sin conexión a internet
3. **Rendimiento**: Carga más rápida gracias al cacheo de recursos
4. **Notificaciones push**: Comunicación proactiva con los usuarios
5. **Acceso directo**: Icono en la pantalla de inicio como una aplicación nativa
6. **Experiencia inmersiva**: Sin barras de URL, pantalla completa

## Componentes de una PWA

### 1. Manifest File

El archivo manifest.json proporciona información sobre la aplicación a los navegadores.

```json
{
  "name": "Arreglos Victoria Florería",
  "short_name": "Arreglos Victoria",
  "description": "Florería familiar con más de 20 años de experiencia en Recoleta",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ff6b6b",
  "icons": [
    {
      "src": "/assets/images/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/assets/images/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/assets/images/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/assets/images/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/assets/images/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/assets/images/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/assets/images/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/assets/images/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 2. Service Worker

El Service Worker es el componente clave que permite las capacidades offline y cacheo de recursos.

```javascript
// public/sw.js
const CACHE_NAME = 'arreglos-victoria-v1.0.0';
const urlsToCache = [
  '/',
  '/pages/index.html',
  '/pages/products.html',
  '/pages/product-detail.html',
  '/pages/contact.html',
  '/pages/about.html',
  '/assets/css/combined.css',
  '/assets/js/main.js',
  '/assets/images/logo.png',
  '/assets/images/hero-image.jpg'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  
  // Realizar la precarga de recursos
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activado');
  
  // Limpiar cachés antiguos
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptación de solicitudes
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si el recurso está en caché, devolverlo
        if (response) {
          return response;
        }
        
        // Si no está en caché, hacer la solicitud a la red
        return fetch(event.request).then((response) => {
          // Verificar si la respuesta es válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clonar la respuesta para guardarla en caché
          const responseToCache = response.clone();
          
          // Guardar la respuesta en caché
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(() => {
        // Si falla la red y no está en caché, mostrar página offline
        if (event.request.mode === 'navigate') {
          return caches.match('/pages/offline.html');
        }
      })
  );
});

// Manejo de mensajes desde la aplicación principal
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
```

### 3. Página Offline

Una página personalizada para mostrar cuando el usuario está offline.

```html
<!-- frontend/pages/offline.html -->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sin conexión - Arreglos Victoria</title>
    <link rel="stylesheet" href="/assets/css/combined.css">
</head>
<body>
    <div class="offline-container">
        <div class="offline-content">
            <h1><i class="fas fa-wifi"></i></h1>
            <h2>No hay conexión a internet</h2>
            <p>Por favor, verifica tu conexión e inténtalo de nuevo.</p>
            <button class="btn btn-primary" onclick="retryConnection()">Reintentar</button>
        </div>
    </div>
    
    <script>
        function retryConnection() {
            window.location.reload();
        }
        
        // Verificar conexión periódicamente
        setInterval(() => {
            fetch('/')
                .then(() => {
                    window.location.reload();
                })
                .catch(() => {
                    // Seguimos sin conexión
                });
        }, 5000);
    </script>
</body>
</html>
```

## Implementación paso a paso

### Fase 1: Configuración del Manifest

1. Crear el archivo `manifest.json` en el directorio público
2. Generar los iconos en diferentes tamaños
3. Enlazar el manifest en todas las páginas HTML

```html
<link rel="manifest" href="/manifest.json">
```

### Fase 2: Registro del Service Worker

Actualizar el archivo [main.js](file:///home/laloaggro/Proyectos/flores-1/frontend/assets/js/main.js) para registrar el Service Worker:

```javascript
// Registrar el Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registrado con éxito:', registration.scope);
      })
      .catch((error) => {
        console.log('Error al registrar el Service Worker:', error);
      });
  });
}
```

### Fase 3: Manejo del estado online/offline

Implementar detección de conectividad en la aplicación:

```javascript
// Detectar cambios en el estado de la red
window.addEventListener('online', () => {
  showNotification('Conexión restablecida', 'success');
});

window.addEventListener('offline', () => {
  showNotification('Conexión perdida. Trabajando en modo offline.', 'warning');
});

// Función para verificar conectividad
function checkConnectivity() {
  if (!navigator.onLine) {
    showNotification('Trabajando en modo offline', 'info');
  }
}
```

### Fase 4: Estrategias de cacheo avanzadas

Implementar estrategias de cacheo más sofisticadas:

```javascript
// Estrategia de cacheo para API
self.addEventListener('fetch', (event) => {
  // Para llamadas a la API, usar estrategia "network first"
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Si la red responde, actualizar el cache
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          return response;
        })
        .catch(() => {
          // Si la red falla, usar el cache
          return caches.match(event.request);
        })
    );
  }
  // Para otros recursos, usar estrategia "cache first"
  else {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
    );
  }
});
```

## Consideraciones importantes

1. **HTTPS**: Las PWA requieren HTTPS en producción
2. **Responsive Design**: La aplicación debe funcionar en todos los dispositivos
3. **Velocidad**: Optimizar el tiempo de carga inicial
4. **Experiencia de instalación**: Proporcionar indicaciones claras para instalar la aplicación
5. **Actualizaciones**: Implementar mecanismos para mantener la aplicación actualizada
6. **Pruebas**: Probar en diferentes navegadores y dispositivos

## Validación de PWA

### Lighthouse

Usar Lighthouse para validar que la aplicación cumple con los criterios de PWA:

1. Ejecutar auditoría de PWA en Chrome DevTools
2. Verificar que se obtenga una puntuación alta (>90)
3. Corregir cualquier problema identificado

### Checklist de PWA

- [ ] Manifest file con todas las propiedades requeridas
- [ ] Service Worker registrado y funcional
- [ ] Iconos en todos los tamaños requeridos
- [ ] Página offline funcional
- [ ] Estrategias de cacheo apropiadas
- [ ] HTTPS en producción
- [ ] Responsive design
- [ ] Sin errores de consola
- [ ] Tiempo de carga rápido
- [ ] Indicador de instalación

## Cronograma estimado

| Fase | Duración | Descripción |
|------|----------|-------------|
| Fase 1 | 1-2 días | Configuración del Manifest y generación de iconos |
| Fase 2 | 2-3 días | Implementación del Service Worker |
| Fase 3 | 1-2 días | Manejo del estado online/offline |
| Fase 4 | 2-3 días | Estrategias de cacheo avanzadas y pruebas |
| **Total** | **6-10 días** | **Tiempo estimado completo** |

## Recursos

1. [Documentación oficial de PWA](https://web.dev/progressive-web-apps/)
2. [Guía de Service Workers](https://developers.google.com/web/fundamentals/primers/service-workers)
3. [Web.dev PWA Checklist](https://web.dev/pwa-checklist/)
4. [Lighthouse PWA Audits](https://web.dev/lighthouse-pwa/)
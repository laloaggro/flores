// register-sw.js
// Registro del Service Worker

// Verificar si el service worker está soportado
if ('serviceWorker' in navigator) {
  // Registrar el service worker solo en producción o en un entorno específico
  const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] es la dirección IPv6 localhost
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 son considerados localhost para IPv4
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );

  // Solo registrar el service worker en localhost
  if (isLocalhost && window.location.hostname !== '127.0.0.1') {
    window.addEventListener('load', () => {
      // Determinar la ruta correcta del service worker
      const swPath = window.location.pathname.includes('/frontend/') 
        ? '/frontend/service-worker.js' 
        : '/service-worker.js';
      
      navigator.serviceWorker.register(swPath)
        .then(registration => {
          console.log('Service Worker registrado con éxito:', registration.scope);
          
          // Comprobar si hay una actualización disponible
          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // Nueva actualización disponible
                  console.log('Nueva actualización disponible');
                  // Aquí podrías mostrar una notificación al usuario
                  showUpdateNotification();
                } else {
                  // Primera instalación
                  console.log('Service Worker instalado por primera vez');
                }
              }
            });
          });
        })
        .catch(error => {
          console.log('Error al registrar el Service Worker:', error);
        });
    });
    
    // Comprobar actualizaciones periódicamente
    setInterval(() => {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({action: 'checkUpdate'});
      }
    }, 1000 * 60 * 30); // Cada 30 minutos
  } else {
    // En entornos de desarrollo remotos, mostrar información en consola
    console.info('Service Worker no registrado en entornos de desarrollo remotos');
    console.info('Para pruebas locales, usa: http://localhost');
  }
} else {
  console.log('Service Worker no soportado en este navegador');
}

// Función para mostrar notificación de actualización
function showUpdateNotification() {
  // Crear una notificación en la página solo si estamos en localhost
  const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );
  
  if (!isLocalhost) {
    return;
  }
  
  // Crear una notificación en la página
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="position: fixed; bottom: 20px; right: 20px; background: #4CAF50; color: white; padding: 15px; border-radius: 5px; z-index: 1000;">
      <p>Nueva versión disponible. <button id="updateButton" style="background: white; color: #4CAF50; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Actualizar</button></p>
    </div>
  `;
  document.body.appendChild(notification);
  
  // Añadir evento al botón de actualización
  document.getElementById('updateButton').addEventListener('click', () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({action: 'skipWaiting'});
          window.location.reload();
        }
      });
    }
  });
}
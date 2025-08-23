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

  // Solo registrar el service worker en producción o en localhost
  if (!isLocalhost || window.location.hostname === 'localhost') {
    window.addEventListener('load', () => {
      // Determinar la ruta correcta del service worker
      const swPath = window.location.pathname.includes('/frontend/') 
        ? '/frontend/service-worker.js' 
        : '/service-worker.js';
      
      navigator.serviceWorker.register(swPath)
        .then(registration => {
          console.log(`Service Worker registrado con éxito: ${registration.scope}`);
          
          // Comprobar si hay una actualización disponible
          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // Nueva actualización disponible
                  console.log('Nueva versión disponible para actualizar');
                  // Mostrar notificación al usuario
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
          console.error('Error al registrar el Service Worker:', error);
        });
    });
    
    // Comprobar actualizaciones periódicamente
    setInterval(() => {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ action: 'checkUpdate' });
      }
    }, 1000 * 60 * 30); // Cada 30 minutos
  } else {
    // En localhost, mostrar información detallada en consola
    console.info('Service Worker:');
    console.info('- No se registra en entornos de desarrollo remotos');
    console.info('- Para pruebas locales, usa: http://localhost');
  }
} else {
  console.log('Service Worker no soportado en este navegador');
}

// Función para mostrar notificación de actualización
function showUpdateNotification() {
  // Crear una notificación en la página solo si no estamos en localhost
  const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );
  
  if (isLocalhost && window.location.hostname !== 'localhost') {
    return;
  }
  
  // Crear una notificación más visible y mejor posicionada
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="position: fixed; top: 20px; right: 20px; background: #2196F3; color: white; padding: 15px 20px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); z-index: 10000; transition: opacity 0.3s; font-family: Arial, sans-serif;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="margin-right: 20px;">
          <strong>Actualización disponible</strong>
          <p style="margin: 5px 0 0;">Haga clic en el botón para recargar y usar la nueva versión.</p>
        </div>
        <button id="updateButton" style="background: #fff; color: #2196F3; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; transition: background 0.3s;">
          Recargar
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Añadir evento al botón de actualización
  document.getElementById('updateButton').addEventListener('click', () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ action: 'skipWaiting' });
          window.location.reload();
        }
      });
    }
  });
  
  // Agregar efecto de desvanecimiento suave
  setTimeout(() => {
    if (notification && notification.style) {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification && notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }, 10000); // Ocultar después de 10 segundos
}
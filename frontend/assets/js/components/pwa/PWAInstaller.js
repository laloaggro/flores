// PWAInstaller.js - Componente para gestionar la instalación de la PWA

class PWAInstaller extends HTMLElement {
  constructor() {
    super();
    this.deferredPrompt = null;
    this.isInstallable = false;
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="pwa-installer" style="display: none;">
        <div class="install-banner">
          <div class="install-content">
            <img src="/assets/images/logo.png" alt="Arreglos Victoria" class="install-logo">
            <div class="install-text">
              <h3>Instala Arreglos Victoria</h3>
              <p>Accede rápidamente a nuestra tienda desde tu pantalla de inicio</p>
            </div>
          </div>
          <div class="install-actions">
            <button class="btn btn-outline dismiss-install">Ahora no</button>
            <button class="btn btn-primary install-button">Instalar</button>
          </div>
        </div>
      </div>
    `;
    
    // Añadir event listeners
    this.querySelector('.install-button').addEventListener('click', () => {
      this.installPWA();
    });
    
    this.querySelector('.dismiss-install').addEventListener('click', () => {
      this.hideInstallBanner();
    });
    
    // Registrar eventos
    this.registerEvents();
  }

  registerEvents() {
    // Detectar cuando la PWA es instalable
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevenir que el navegador muestre automáticamente el prompt
      e.preventDefault();
      
      // Guardar el evento para usarlo más tarde
      this.deferredPrompt = e;
      this.isInstallable = true;
      
      // Mostrar el banner de instalación si no ha sido descartado
      if (!localStorage.getItem('pwa-install-dismissed')) {
        this.showInstallBanner();
      }
    });
    
    // Detectar cuando la PWA ha sido instalada
    window.addEventListener('appinstalled', () => {
      console.log('PWA instalada exitosamente');
      this.hideInstallBanner();
      
      // Limpiar el prompt diferido
      this.deferredPrompt = null;
      this.isInstallable = false;
      
      // Registrar la instalación en analytics
      if (typeof webAnalytics !== 'undefined') {
        webAnalytics.trackEvent('PWA', 'Installed');
      }
    });
  }

  showInstallBanner() {
    const banner = this.querySelector('.pwa-installer');
    if (banner) {
      banner.style.display = 'block';
      
      // Registrar visualización en analytics
      if (typeof webAnalytics !== 'undefined') {
        webAnalytics.trackEvent('PWA', 'InstallBannerShown');
      }
    }
  }

  hideInstallBanner() {
    const banner = this.querySelector('.pwa-installer');
    if (banner) {
      banner.style.display = 'none';
      
      // Marcar como descartado
      localStorage.setItem('pwa-install-dismissed', 'true');
      
      // Registrar descarte en analytics
      if (typeof webAnalytics !== 'undefined') {
        webAnalytics.trackEvent('PWA', 'InstallBannerDismissed');
      }
    }
  }

  async installPWA() {
    if (!this.deferredPrompt) {
      console.log('No hay prompt de instalación disponible');
      return;
    }
    
    // Registrar intento de instalación en analytics
    if (typeof webAnalytics !== 'undefined') {
      webAnalytics.trackEvent('PWA', 'InstallAttempted');
    }
    
    // Mostrar el prompt de instalación
    this.deferredPrompt.prompt();
    
    // Esperar a que el usuario responda al prompt
    const { outcome } = await this.deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Usuario aceptó la instalación de la PWA');
      
      // Registrar aceptación en analytics
      if (typeof webAnalytics !== 'undefined') {
        webAnalytics.trackEvent('PWA', 'InstallAccepted');
      }
    } else {
      console.log('Usuario rechazó la instalación de la PWA');
      
      // Registrar rechazo en analytics
      if (typeof webAnalytics !== 'undefined') {
        webAnalytics.trackEvent('PWA', 'InstallRejected');
      }
    }
    
    // Limpiar el prompt diferido
    this.deferredPrompt = null;
    this.hideInstallBanner();
  }

  // Método para verificar si hay una actualización disponible
  checkForUpdates() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nueva versión disponible
                this.showUpdateBanner();
              }
            });
          });
        }
      });
    }
  }

  showUpdateBanner() {
    // Crear banner de actualización si no existe
    let updateBanner = document.querySelector('.pwa-update-banner');
    if (!updateBanner) {
      updateBanner = document.createElement('div');
      updateBanner.className = 'pwa-update-banner';
      updateBanner.innerHTML = `
        <div class="update-content">
          <span>Nueva versión disponible</span>
          <button class="btn btn-small btn-primary update-button">Actualizar</button>
        </div>
      `;
      
      document.body.appendChild(updateBanner);
      
      // Añadir event listener para el botón de actualización
      updateBanner.querySelector('.update-button').addEventListener('click', () => {
        this.updateApp();
      });
    }
    
    updateBanner.style.display = 'block';
  }

  updateApp() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          // Enviar mensaje al service worker para que se salte la espera
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }
    
    // Recargar la página para aplicar la actualización
    window.location.reload();
  }
}

// Registrar el componente
if (!customElements.get('pwa-installer')) {
  customElements.define('pwa-installer', PWAInstaller);
}

// Registrar el service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registrado con éxito:', registration.scope);
      })
      .catch((error) => {
        console.log('Error al registrar el Service Worker:', error);
      });
  });
}

export default PWAInstaller;
/**
 * PushNotifications.js - Componente para notificaciones push
 * 
 * Este componente implementa la funcionalidad de notificaciones push
 * para mejorar la comunicación con los usuarios.
 */

class PushNotifications extends HTMLElement {
  constructor() {
    super();
    this.permission = 'default'; // 'default', 'granted', 'denied'
    this.swRegistration = null;
  }

  connectedCallback() {
    this.checkPermission();
    this.setupServiceWorker();
  }

  /**
   * Verificar el estado del permiso de notificaciones
   */
  async checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
      console.log('Estado de permiso de notificaciones:', this.permission);
    } else {
      console.warn('Este navegador no soporta notificaciones push');
    }
  }

  /**
   * Solicitar permiso para enviar notificaciones
   */
  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('Este navegador no soporta notificaciones push');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      
      if (permission === 'granted') {
        console.log('Permiso de notificaciones concedido');
        this.dispatchEvent(new CustomEvent('push-permission-granted'));
      } else {
        console.log('Permiso de notificaciones denegado');
        this.dispatchEvent(new CustomEvent('push-permission-denied'));
      }
    } catch (error) {
      console.error('Error al solicitar permiso de notificaciones:', error);
      this.dispatchEvent(new CustomEvent('push-permission-error', { detail: error }));
    }
  }

  /**
   * Configurar el Service Worker para notificaciones push
   */
  async setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        // Registrar el service worker
        this.swRegistration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker registrado correctamente');
        
        // Esperar a que el service worker esté listo
        await navigator.serviceWorker.ready;
        
        // Configurar notificaciones push si hay permiso
        if (this.permission === 'granted') {
          await this.subscribeToPush();
        }
      } catch (error) {
        console.error('Error al registrar el Service Worker:', error);
      }
    } else {
      console.warn('Este navegador no soporta Service Workers');
    }
  }

  /**
   * Suscribirse a notificaciones push
   */
  async subscribeToPush() {
    if (!this.swRegistration) {
      console.warn('No hay registro de Service Worker disponible');
      return;
    }

    try {
      // Crear una suscripción push
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlB64ToUint8Array(this.getApplicationServerKey())
      });

      // Enviar la suscripción al servidor
      await this.sendSubscriptionToServer(subscription);
      
      console.log('Suscripción push creada correctamente');
      this.dispatchEvent(new CustomEvent('push-subscribed'));
    } catch (error) {
      console.error('Error al suscribirse a notificaciones push:', error);
      this.dispatchEvent(new CustomEvent('push-subscription-error', { detail: error }));
    }
  }

  /**
   * Enviar la suscripción al servidor
   * @param {Object} subscription - Suscripción push
   */
  async sendSubscriptionToServer(subscription) {
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userId: this.getUserId()
        })
      });

      if (!response.ok) {
        throw new Error('Error al enviar la suscripción al servidor');
      }

      console.log('Suscripción enviada al servidor correctamente');
    } catch (error) {
      console.error('Error al enviar la suscripción al servidor:', error);
    }
  }

  /**
   * Obtener el ID de usuario (simulado)
   * @returns {string|null} ID de usuario o null si no hay usuario
   */
  getUserId() {
    // En una implementación real, esto obtendría el ID del usuario autenticado
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.id || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * Convertir una cadena base64 URL a Uint8Array
   * @param {string} base64String - Cadena base64 URL
   * @returns {Uint8Array} Array de bytes
   */
  urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * Obtener la clave pública del servidor de aplicaciones (simulado)
   * @returns {string} Clave pública en formato base64 URL
   */
  getApplicationServerKey() {
    // En una implementación real, esta sería la clave pública real del servidor
    // Esta es una clave de ejemplo
    return 'BK3Za3KZxZ3zZ3zZ3zZ3zZ3zZ3zZ3zZ3zZ3zZ3zZ3zZ3zZ3zZ3zZ3zZ3zZ3zZ3zZ3zZ3zZ3zZ3zZ3zZ3zZ3zZ3z';
  }

  /**
   * Mostrar una notificación
   * @param {string} title - Título de la notificación
   * @param {Object} options - Opciones de la notificación
   */
  showNotification(title, options = {}) {
    if (this.permission !== 'granted') {
      console.warn('No se puede mostrar notificación: permiso no concedido');
      return;
    }

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Enviar mensaje al service worker para mostrar la notificación
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title,
        options
      });
    } else if ('Notification' in window) {
      // Fallback: usar la API de notificaciones directamente
      new Notification(title, options);
    }
  }
}

// Registrar el componente
if (!customElements.get('push-notifications')) {
  customElements.define('push-notifications', PushNotifications);
}

export default PushNotifications;
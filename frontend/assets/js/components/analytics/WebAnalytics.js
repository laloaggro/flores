/**
 * WebAnalytics.js - Componente para análisis web
 * 
 * Este componente implementa funciones básicas de análisis web
 * para rastrear el comportamiento de los usuarios en el sitio.
 */

class WebAnalytics {
  constructor() {
    this.trackingId = null;
    this.userId = null;
    this.pageViews = [];
    this.events = [];
  }

  /**
   * Inicializar el sistema de análisis
   * @param {string} trackingId - ID de seguimiento
   */
  init(trackingId) {
    this.trackingId = trackingId;
    this.userId = this.generateUserId();
    
    // Registrar la visita a la página actual
    this.trackPageView();
    
    // Registrar eventos de clic en enlaces externos
    this.trackExternalLinks();
    
    // Registrar tiempo en la página
    this.trackTimeOnPage();
    
    console.log('Sistema de análisis web inicializado');
  }

  /**
   * Generar un ID de usuario único
   * @returns {string} ID de usuario
   */
  generateUserId() {
    // Verificar si ya existe un ID de usuario en localStorage
    let userId = localStorage.getItem('analytics_user_id');
    
    if (!userId) {
      // Generar un nuevo ID de usuario
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('analytics_user_id', userId);
    }
    
    return userId;
  }

  /**
   * Registrar una visita a la página
   */
  trackPageView() {
    const pageView = {
      url: window.location.href,
      title: document.title,
      timestamp: new Date().toISOString(),
      userId: this.userId
    };
    
    this.pageViews.push(pageView);
    
    // Enviar datos a un servicio de análisis (simulado)
    this.sendToAnalyticsService('pageview', pageView);
  }

  /**
   * Registrar un evento personalizado
   * @param {string} category - Categoría del evento
   * @param {string} action - Acción del evento
   * @param {string} label - Etiqueta del evento
   * @param {number} value - Valor del evento
   */
  trackEvent(category, action, label = '', value = 0) {
    const event = {
      category,
      action,
      label,
      value,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      url: window.location.href
    };
    
    this.events.push(event);
    
    // Enviar datos a un servicio de análisis (simulado)
    this.sendToAnalyticsService('event', event);
  }

  /**
   * Registrar clics en enlaces externos
   */
  trackExternalLinks() {
    // Seleccionar todos los enlaces externos
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
    
    externalLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        this.trackEvent('Enlace', 'Clic en enlace externo', link.href);
      });
    });
  }

  /**
   * Registrar tiempo en la página
   */
  trackTimeOnPage() {
    let startTime = new Date();
    
    // Registrar tiempo cuando el usuario abandona la página
    window.addEventListener('beforeunload', () => {
      const endTime = new Date();
      const timeSpent = Math.round((endTime - startTime) / 1000); // segundos
      
      this.trackEvent('Página', 'Tiempo en página', document.title, timeSpent);
    });
  }

  /**
   * Registrar conversiones (por ejemplo, compras)
   * @param {string} conversionType - Tipo de conversión
   * @param {Object} conversionData - Datos de la conversión
   */
  trackConversion(conversionType, conversionData) {
    this.trackEvent('Conversión', conversionType, '', conversionData.value || 0);
    
    // Enviar datos a un servicio de análisis (simulado)
    this.sendToAnalyticsService('conversion', {
      type: conversionType,
      data: conversionData,
      timestamp: new Date().toISOString(),
      userId: this.userId
    });
  }

  /**
   * Enviar datos a un servicio de análisis
   * @param {string} type - Tipo de datos
   * @param {Object} data - Datos a enviar
   */
  async sendToAnalyticsService(type, data) {
    try {
      // En un entorno real, esto enviaría los datos a un servicio como Google Analytics
      // Por ahora, solo lo registramos en la consola
      console.log(`[Analytics] ${type}:`, data);
      
      // Simular envío a un servicio externo
      /*
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type,
          data,
          trackingId: this.trackingId
        })
      });
      */
    } catch (error) {
      console.warn('No se pudieron enviar datos de análisis:', error);
    }
  }

  /**
   * Obtener estadísticas de uso
   * @returns {Object} Estadísticas
   */
  getStats() {
    return {
      pageViews: this.pageViews.length,
      events: this.events.length,
      userId: this.userId
    };
  }
}

// Crear una instancia global
const webAnalytics = new WebAnalytics();

// Exportar la instancia y la clase
export { WebAnalytics, webAnalytics };
export default webAnalytics;
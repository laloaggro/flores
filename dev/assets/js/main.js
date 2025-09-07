/**
 * Punto de entrada principal de la aplicación Arreglos Victoria Florería
 * 
 * Este archivo importa e inicializa todos los componentes y funcionalidades
 * necesarios para el funcionamiento del sitio web, incluyendo la integración
 * de nuevos componentes migrados a módulos ES6.
 */

// Importar utilidades
import { initializeTheme } from '/assets/js/components/utils/theme.js';
import { initializeLazyLoading } from '/assets/js/components/utils/lazyLoad.js';
import { initializeUserMenu } from '/assets/js/components/utils/userMenu.js';
import { initializeAccessibility } from '/components/utils/accessibility.js';
import { initializeI18n } from '/components/utils/i18n.js';

// Importar componentes de página
import { initializeHomeProducts } from '/assets/js/components/pages/homeProducts.js';

// Importar componentes migrados
import '/components/header/Header.js';
import '/components/header/Footer.js';
// import '/components/ui/Testimonials.js'; // Componente no encontrado, comentado temporalmente
import '/components/cart/CartItem.js';
import '/components/product/ProductSearch.js';
import '/components/product/ProductFilters.js';
import '/components/product/ProductRating.js';
import '/components/header/MobileMenu.js';
import '/components/utils/notifications.js';
import '/components/utils/analytics.js';
import '/components/utils/errorMonitoring.js';

// Registrar el Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/assets/js/sw.js')
      .then((registration) => {
        console.log('[Service Worker] Registrado con éxito:', registration.scope);
      })
      .catch((error) => {
        console.log('[Service Worker] Error en el registro:', error);
      });
  });
}

// Función para esperar a que los componentes personalizados se carguen
function waitForComponents() {
  return new Promise((resolve) => {
    const checkComponents = () => {
      // Verificar si los componentes personalizados están registrados
      if (customElements.get('site-header') && customElements.get('site-footer')) {
        resolve();
      } else {
        // Reintentar en 100ms
        setTimeout(checkComponents, 100);
      }
    };
    checkComponents();
  });
}

// Función para inicializar la aplicación
async function initializeApp() {
  try {
    console.log('🚀 Inicializando aplicación...');
        
    // Esperar a que los componentes se carguen
    await waitForComponents();
        
    // Inicializar utilidades
    initializeTheme();
    console.log('✅ Tema cargado correctamente');
        
    initializeLazyLoading();
    console.log('✅ Lazy loading inicializado correctamente');
        
    initializeUserMenu();
    console.log('✅ Menú de usuario inicializado correctamente');
        
    initializeAccessibility();
    console.log('✅ Accesibilidad inicializada correctamente');
        
    initializeI18n();
    console.log('✅ Internacionalización inicializada correctamente');
        
    // Inicializar componentes de página
    initializeHomeProducts();
    console.log('✅ Sección de productos de la página principal inicializada');
        
    console.log('✅ Aplicación inicializada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar la aplicación:', error);
    // Registrar el error en el sistema de monitoreo
    if (typeof window !== 'undefined' && window.errorMonitoring) {
      window.errorMonitoring.logError(error);
    }
  }
}

// Manejar errores no capturados
window.addEventListener('error', (event) => {
  console.error('❌ Error no capturado:', event.error);
  // Registrar el error en el sistema de monitoreo
  if (typeof window !== 'undefined' && window.errorMonitoring) {
    window.errorMonitoring.logError(event.error);
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Promesa rechazada no manejada:', event.reason);
  // Registrar el error en el sistema de monitoreo
  if (typeof window !== 'undefined' && window.errorMonitoring) {
    window.errorMonitoring.logError(event.reason);
  }
});

// Inicializar la aplicación cuando el DOM esté cargado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Exportar funciones para uso global
export { initializeApp };
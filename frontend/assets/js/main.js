/**
 * Punto de entrada principal de la aplicación Arreglos Victoria Florería
 * 
 * Este archivo importa e inicializa todos los componentes y funcionalidades
 * necesarios para el funcionamiento del sitio web, incluyendo la integración
 * de nuevos componentes migrados a módulos ES6.
 */

// Importar estilos
import '../css/combined.css';

// Importar utilidades
import { initializeTheme } from './components/utils/theme.js';
import { initializeLazyLoading } from './components/utils/lazyLoad.js';
import { initializeUserMenu } from './components/utils/userMenu.js';
import webAnalytics from './components/analytics/WebAnalytics.js';
import stateManager from './components/utils/stateManager.js';

// Importar componentes de página
import { initializeHomeProducts } from './components/pages/homeProducts.js';

// Importar componentes migrados
import Header from './components/ui/Header.js';
import Footer from './components/ui/Footer.js';
import Testimonials from './components/ui/Testimonials.js';
import CartItem from './components/cart/CartItem.js';

// Función para esperar a que los componentes personalizados se carguen
function waitForComponents() {
    return new Promise((resolve) => {
        const checkComponents = () => {
            // Verificar si los componentes personalizados están registrados
            if (customElements.get('header-component') && customElements.get('footer-component')) {
                resolve();
            } else {
                // Reintentar en 100ms
                setTimeout(checkComponents, 100);
            }
        };
        checkComponents();
    });
}

// Función para registrar componentes personalizados
function registerCustomComponents() {
    // Registrar componentes migrados como componentes personalizados
    if (!customElements.get('header-component')) {
        customElements.define('header-component', Header);
    }
    
    if (!customElements.get('footer-component')) {
        customElements.define('footer-component', Footer);
    }
    
    if (!customElements.get('testimonials-component')) {
        customElements.define('testimonials-component', Testimonials);
    }
    
    if (!customElements.get('cart-item-component')) {
        customElements.define('cart-item-component', CartItem);
    }
}

// Función para inicializar la aplicación
async function initializeApp() {
    try {
        console.log('🚀 Inicializando aplicación...');
        
        // Registrar componentes personalizados
        registerCustomComponents();
        
        // Esperar a que los componentes se carguen
        await waitForComponents();
        
        // Inicializar utilidades
        initializeTheme();
        initializeLazyLoading();
        initializeUserMenu();
        
        // Inicializar sistema de análisis web
        webAnalytics.init('AV-001'); // ID de seguimiento de ejemplo
        
        // Registrar evento de inicio de la aplicación
        webAnalytics.trackEvent('Aplicación', 'Inicialización', 'Inicio de la aplicación');
        
        // Inicializar el estado de la aplicación
        initializeAppState();
        
        // Inicializar componentes de página
        initializeHomeProducts();
        
        console.log('✅ Aplicación inicializada correctamente');
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
    }
}

// Inicializar el estado de la aplicación
function initializeAppState() {
    // Cargar el usuario del localStorage si existe
    const user = localStorage.getItem('user');
    if (user) {
        try {
            stateManager.set('user', JSON.parse(user));
        } catch (e) {
            console.error('Error al parsear usuario del localStorage:', e);
        }
    }
    
    // Cargar el carrito del localStorage si existe
    const cart = localStorage.getItem('cart');
    if (cart) {
        try {
            stateManager.set('cart', JSON.parse(cart));
        } catch (e) {
            console.error('Error al parsear carrito del localStorage:', e);
        }
    }
    
    // Cargar la lista de deseos del localStorage si existe
    const wishlist = localStorage.getItem('wishlist');
    if (wishlist) {
        try {
            stateManager.set('wishlist', JSON.parse(wishlist));
        } catch (e) {
            console.error('Error al parsear lista de deseos del localStorage:', e);
        }
    }
    
    // Suscribirse a cambios en el estado del usuario
    stateManager.subscribe('user', (user) => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    });
    
    // Suscribirse a cambios en el estado del carrito
    stateManager.subscribe('cart', (cart) => {
        localStorage.setItem('cart', JSON.stringify(cart));
    });
    
    // Suscribirse a cambios en el estado de la lista de deseos
    stateManager.subscribe('wishlist', (wishlist) => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    });
}

// Inicializar la aplicación cuando el DOM esté cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Exportar funciones para uso global
export { initializeApp };
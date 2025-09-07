/**
 * Punto de entrada principal de la aplicación Arreglos Victoria Florería
 * 
 * Este archivo importa e inicializa todos los componentes y funcionalidades
 * necesarios para el funcionamiento del sitio web, incluyendo la integración
 * de nuevos componentes migrados a módulos ES6.
 */

// Función para cargar archivos CSS mediante etiquetas link
function loadCSS(href) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
    });
}

// Función para cargar todos los estilos necesarios
async function loadAllCSS() {
    try {
        // Cargar los archivos CSS
        await Promise.all([
            loadCSS('../assets/css/styles.css'),
            loadCSS('../assets/css/index.css')
        ]);
        
        console.log('✅ Estilos cargados correctamente');
    } catch (error) {
        console.error('❌ Error al cargar los estilos:', error);
    }
}

// Importar utilidades
import { initializeTheme } from './components/utils/theme.js';
import { initializeLazyLoading } from './components/utils/lazyLoad.js';
import { initializeUserMenu } from './components/utils/userMenu.js';

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

// Función para inicializar la aplicación
async function initializeApp() {
    try {
        console.log('🚀 Inicializando aplicación...');
        
        // Cargar estilos primero
        await loadAllCSS();
        
        // Esperar a que los componentes se carguen
        await waitForComponents();
        
        // Inicializar utilidades
        initializeTheme();
        initializeLazyLoading();
        initializeUserMenu();
        
        // Inicializar componentes de página
        initializeHomeProducts();
        
        console.log('✅ Aplicación inicializada correctamente');
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
    }
}

// Inicializar la aplicación cuando el DOM esté cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Exportar funciones para uso global
export { initializeApp };
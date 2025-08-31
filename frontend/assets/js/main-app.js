// sw.js - Service Worker para la aplicación

const CACHE_NAME = 'flores-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/assets/js/main-app.js',
    '/assets/js/products.js',
    '/assets/js/cart.js',
    '/assets/images/icons/icon-192x192.png',
    '/assets/images/icons/icon-512x512.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker: Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Cachando recursos básicos');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker: Activando...');
    // Eliminar caches antiguas
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
    return self.clients.claim();
});

// Fetch event - Usar cache cuando esté disponible
self.addEventListener('fetch', event => {
    // Solo interceptar solicitudes GET
    if (event.request.method !== 'GET') {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Devolver caché si existe
                if (response) {
                    return response;
                }
                
                // Clonar la solicitud ya que será consumida al hacer fetch
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then(response => {
                    // Verificar que la respuesta es válida
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clonar la respuesta para almacenarla en el caché
                    const responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                        
                    return response;
                });
            })
    );
});
/**
 * main-app.js - Archivo principal de JavaScript para la aplicación Flores-1
 * Contiene funciones globales y de inicialización para toda la aplicación
 * 
 * Estructura:
 * 1. Funciones de UI y utilidades
 * 2. Registro de Service Worker y manejo de caché
 * 3. Inicialización de la aplicación
 * 4. Funciones de inicialización específica por página
 * 5. Configuración global y exportaciones
 */

/**
 * Muestra una notificación visual al usuario
 * 
 * @param {string} message - Mensaje a mostrar en la notificación
 * @param {string} [type='info'] - Tipo de notificación ('info', 'success', 'warning', 'error')
 * 
 * Ejemplo:
 * showNotification('Producto agregado al carrito', 'success');
 */
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    
    // Agregar estilo
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '5px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '10000',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        opacity: '0',
        transform: 'translateY(-20px)',
        transition: 'opacity 0.3s, transform 0.3s'
    });
    
    // Estilos por tipo
    if (type === 'success') {
        notification.style.backgroundColor = '#2e7d32';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#c62828';
    } else if (type === 'warning') {
        notification.style.backgroundColor = '#ef6c00';
    } else {
        notification.style.backgroundColor = '#2196f3';
    }
    
    // Agregar al documento
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Formatea un valor numérico como precio en formato CLP (pesos chilenos)
 * 
 * @param {number|string} price - Precio a formatear, puede ser número o string
 * @returns {string} Precio formateado con símbolo $ y separadores de miles
 * 
 * Ejemplo:
 * formatPrice(15000) retorna "$15.000"
 */
function formatPrice(price) {
    // Convertir a número si es string
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // Verificar si es un número válido
    if (isNaN(numericPrice)) {
        return '$0';
    }
    
    // Formatear como moneda CLP
    return '$' + numericPrice.toLocaleString('es-CL');
}

/**
 * Carga los productos desde el servidor (simulación)
 * En la implementación real, esta función haría una llamada a un endpoint API
 * 
 * @returns {Promise} Promesa que se resuelve con los datos de productos
 */
function loadProducts() {
    console.log('Cargando productos...');
    // Esta función se implementará completamente en products.js
}

/**
 * Registra el Service Worker para caché de recursos
 * Permite que la aplicación funcione offline y mejore el rendimiento
 * 
 * El Service Worker maneja:
 * - Caché de recursos estáticos
 * - Sincronización en segundo plano
 * - Notificaciones push
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registrado con éxito:', registration.scope);
                })
                .catch(error => {
                    console.log('Error al registrar el Service Worker:', error);
                });
        });
    }
}

/**
 * Inicializa la aplicación principal
 * Configura componentes globales y funcionalidades básicas
 * 
 * Esta función:
 * 1. Configura la carga diferida de imágenes
 * 2. Registra el Service Worker
 * 3. Inicializa componentes específicos según la página actual
 * 4. Maneja errores globales de inicialización
 */
function initApp() {
    console.log('Inicializando aplicación...');
    
    try {
        // Configurar carga diferida de imágenes
        setupLazyLoading();
        
        // Registrar Service Worker si está disponible
        registerServiceWorker();
        
        // Inicializar componentes según la página actual
        const page = document.body.dataset.page;
        
        switch(page) {
            case 'home':
                initHomePage();
                break;
            case 'products':
                initProductsPage();
                break;
            case 'product-detail':
                initProductDetailPage();
                break;
            case 'cart':
                initCartPage();
                break;
            case 'checkout':
                initCheckoutPage();
                break;
            case 'profile':
                initProfilePage();
                break;
            case 'orders':
                initOrdersPage();
                break;
            case 'contact':
                initContactPage();
                break;
            default:
                console.log('Página no reconocida o no requiere inicialización especial');
        }
        
        console.log('Inicialización completa');
    } catch (error) {
        console.error('Error durante la inicialización:', error);
        showNotification('Hubo un problema al cargar la aplicación', 'error');
    }
}

/**
 * Configura la carga diferida de imágenes usando Intersection Observer
 * Mejora el rendimiento de la aplicación al cargar solo las imágenes visibles
 * 
 * Utiliza técnicas modernas de lazy loading y proporciona un fallback
 * para navegadores más antiguos que no soporten Intersection Observer
 */
function setupLazyLoading() {
    // Verificar si el navegador soporta Intersection Observer
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    
                    if (src) {
                        img.src = src;
                    }
                    
                    img.classList.remove('lazy');
                    img.classList.add('lazy-loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '0px 0px 200px 0px' // Cargar imágenes cuando estén a 200px del viewport
        });
        
        // Observar todas las imágenes con la clase 'lazy'
        const lazyImages = document.querySelectorAll('img.lazy');
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores que no soportan Intersection Observer
        const lazyImages = document.querySelectorAll('img.lazy');
        lazyImages.forEach(img => {
            const src = img.dataset.src;
            
            if (src) {
                img.src = src;
            }
            
            img.classList.remove('lazy');
            img.classList.add('lazy-loaded');
        });
    }
}

/**
 * Inicializa funcionalidades específicas para la página de inicio
 * 
 * Esta función contiene código que solo se ejecuta en la página de inicio
 * y que podría incluir:
 * - Carruseles de productos destacados
 * - Anuncios promocionales
 * - Integración con redes sociales
 */
function initHomePage() {
    console.log('Inicializando página de inicio');
    // Funcionalidades específicas de la página de inicio
}

/**
 * Inicializa funcionalidades específicas para la página de productos
 * 
 * Esta función contiene código que solo se ejecuta en la página de productos
 * e incluye:
 * - Filtros de categoría
 * - Ordenamiento por precio
 * - Paginación de resultados
 */
function initProductsPage() {
    console.log('Inicializando página de productos');
    // Funcionalidades específicas de la página de productos
}

/**
 * Inicializa funcionalidades específicas para la página de detalle de producto
 * 
 * Esta función contiene código que solo se ejecuta en la página de detalle
 * de producto y que podría incluir:
 * - Galería de imágenes
 * - Selector de cantidad
 * - Agregar al carrito
 */
function initProductDetailPage() {
    console.log('Inicializando página de detalle de producto');
    // Funcionalidades específicas de la página de detalle de producto
}

/**
 * Inicializa funcionalidades específicas para la página del carrito
 * 
 * Esta función contiene código que solo se ejecuta en la página del carrito
 * y que permite:
 * - Modificar cantidades
 * - Eliminar productos
 * - Aplicar cupones de descuento
 */
function initCartPage() {
    console.log('Inicializando página de carrito');
    // Funcionalidades específicas de la página de carrito
}

/**
 * Inicializa funcionalidades específicas para la página de checkout
 * 
 * Esta función contiene código que solo se ejecuta en la página de pago
 * y maneja:
 * - Validación de formularios
 * - Selección de método de pago
 * - Confirmación de pedido
 */
function initCheckoutPage() {
    console.log('Inicializando página de checkout');
    // Funcionalidades específicas de la página de checkout
}

/**
 * Inicializa funcionalidades específicas para la página de perfil
 * 
 * Esta función contiene código que solo se ejecuta en la página de perfil
 * y permite:
 * - Edición de datos personales
 * - Cambio de contraseña
 * - Gestión de direcciones
 */
function initProfilePage() {
    console.log('Inicializando página de perfil');
    // Funcionalidades específicas de la página de perfil
}

/**
 * Inicializa funcionalidades específicas para la página de órdenes
 * 
 * Esta función contiene código que solo se ejecuta en la página de historial
 * de órdenes y muestra:
 * - Lista de pedidos anteriores
 * - Estado de cada pedido
 * - Detalles de envío y pago
 */
function initOrdersPage() {
    console.log('Inicializando página de órdenes');
    // Funcionalidades específicas de la página de órdenes
}

/**
 * Inicializa funcionalidades específicas para la página de contacto
 * 
 * Esta función contiene código que solo se ejecuta en la página de contacto
 * y maneja:
 * - Formulario de contacto
 * - Validación de campos
 * - Integración con mapa
 */
function initContactPage() {
    console.log('Inicializando página de contacto');
    // Funcionalidades específicas de la página de contacto
}

/**
 * Inicializa la aplicación cuando el DOM esté completamente cargado
 * También añade una clase CSS para indicar que JavaScript está activo
 * Esta clase permite estilos condicionales basados en la disponibilidad de JS
 */
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    
    // Añadir clase para indicar que JavaScript está activo
    document.body.classList.add('js-enabled');
});

/**
 * Exportar funciones globales para uso en otros scripts
 * Estas funciones están disponibles globalmente a través del objeto window
 */
window.showNotification = showNotification;
window.formatPrice = formatPrice;
window.loadProducts = loadProducts;
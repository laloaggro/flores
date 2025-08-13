// utils.js - Funciones de utilidad compartidas

// Determinar la URL base del API según el entorno
const getApiBaseUrl = () => {
  // En producción, usar la URL del backend en Render
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // Cambia esta URL por la URL real de tu backend en Render
    return 'https://arreglos-victoria-backend.onrender.com';
  }
  
  // En desarrollo, usar localhost
  return 'http://localhost:5000';
};

const API_BASE_URL = getApiBaseUrl();

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear el contenedor de notificaciones si no existe
    let notificationContainer = document.getElementById('notificationContainer');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notificationContainer';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            width: 300px;
        `;
        document.body.appendChild(notificationContainer);
    }
    
    // Crear la notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : '#2196f3'};
        color: white;
        padding: 16px;
        margin-bottom: 10px;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    notification.textContent = message;
    
    // Añadir al contenedor
    notificationContainer.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Función para formatear precios
function formatPrice(price) {
    // Asegurarse de que el precio sea un número
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // Verificar que sea un número válido
    if (isNaN(numericPrice)) {
        return '$0';
    }
    
    // Formatear como moneda chilena sin decimales
    return '$' + Math.round(numericPrice).toLocaleString('es-CL');
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    
    if (cartCount) {
        // Actualizar contador
        if (totalItems > 0) {
            cartCount.textContent = totalItems;
            cartCount.classList.remove('hidden');
        } else {
            cartCount.classList.add('hidden');
        }
    }
}

// Función para cargar imágenes a través del proxy
function loadImageWithProxy(imageUrl) {
    // Si ya está usando el proxy, devolverla tal cual
    if (imageUrl.includes('/api/image-proxy')) {
        return imageUrl;
    }
    
    // Si es una imagen local o de datos, devolverla tal cual
    if (imageUrl.startsWith('data:') || imageUrl.startsWith('/') || imageUrl.startsWith('./') || imageUrl.startsWith('../')) {
        return imageUrl;
    }
    
    // Verificar si es una URL válida
    try {
        const url = new URL(imageUrl);
        // Usar el proxy para dominios de Unsplash
        if (url.hostname === 'images.unsplash.com' || url.hostname === 'source.unsplash.com') {
            return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
        }
        // Para otras imágenes externas, intentar usar el proxy también
        return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
    } catch (e) {
        // Si no es una URL válida, devolverla tal cual
        return imageUrl;
    }
}

// Funciones de autenticación de usuario
function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function isAuthenticated() {
    return !!getUser();
}

function logout() {
    localStorage.removeItem('user');
    showNotification('Sesión cerrada correctamente', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Función para verificar autenticación
function requireAuth(redirectUrl = '/login.html') {
    if (!isAuthenticated()) {
        showNotification('Debes iniciar sesión para acceder a esta página', 'error');
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 2000);
        return false;
    }
    return true;
}

// Función para obtener el token de autenticación
function getAuthToken() {
    const user = getUser();
    return user ? user.token : null;
}

// Función para manejar errores de red
function handleNetworkError(error) {
    console.error('Error de red:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
        showNotification('Error de conexión. Por favor, verifica tu conexión a internet.', 'error');
    } else {
        showNotification('Ocurrió un error. Por favor, inténtalo de nuevo.', 'error');
    }
}

// Función para realizar solicitudes HTTP con manejo de errores
async function apiRequest(endpoint, options = {}) {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        // Agregar token de autenticación si existe
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        const response = await fetch(url, config);
        
        // Manejar respuestas no exitosas
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        handleNetworkError(error);
        throw error;
    }
}

// Exportar funciones
export { 
    showNotification, 
    updateCartCount, 
    formatPrice, 
    loadImageWithProxy,
    getUser, 
    isAuthenticated, 
    requireAuth, 
    logout, 
    getAuthToken,
    apiRequest,
    API_BASE_URL
};
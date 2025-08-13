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

// Formatear precio
const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(price);
};

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
            return `${API_BASE_URL}/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
        }
        // Para otras imágenes externas, intentar usar el proxy también
        return `${API_BASE_URL}/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
    } catch (e) {
        // Si no es una URL válida, devolverla tal cual
        return imageUrl;
    }
}

// Función para validar formato de email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para validar formato de teléfono
function validatePhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone);
}

// Verificar si el usuario está autenticado
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Verificar si el usuario es administrador
const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role === 'admin';
};

// Requerir autenticación
const requireAuth = () => {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
};

// Requerir rol de administrador
const requireAdmin = () => {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
    return false;
  }
  
  if (!isAdmin()) {
    showNotification('Acceso denegado. Se requiere rol de administrador.', 'error');
    window.location.href = 'index.html';
    return false;
  }
  
  return true;
};

// Función para obtener el token de autenticación
const getAuthToken = () => {
  return localStorage.getItem('token');
};

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

// Exportar funciones y constantes
export { 
  API_BASE_URL, 
  showNotification, 
  isAuthenticated, 
  isAdmin,
  requireAuth,
  requireAdmin,
  formatPrice
};
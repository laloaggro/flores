// utils.js - Funciones de utilidad compartidas

// Limpiar datos residuales al cargar la aplicación
(function() {
  // Forzar limpieza completa de datos de usuario
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  // Si no hay token pero hay datos de usuario, limpiarlos
  if (!token && user) {
    localStorage.removeItem('user');
  }
  
  // Si hay token pero es inválido, limpiar ambos
  if (token) {
    try {
      // Intentar parsear como JWT
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      if (payload.exp < currentTime) {
        // Token expirado, limpiar
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (e) {
      // No es un JWT válido, verificar longitud
      if (token.length < 10) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }
  
  // Limpiar cualquier otro dato sospechoso
  if (user) {
    try {
      const userData = JSON.parse(user);
      // Si los datos del usuario no tienen las propiedades esperadas, limpiar
      if (!userData.id && !userData.email && !userData.name) {
        localStorage.removeItem('user');
      }
    } catch (e) {
      // Si no se puede parsear como JSON, limpiar
      localStorage.removeItem('user');
    }
  }
})();

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
  if (!token) {
    // Si no hay token, asegurarse de limpiar cualquier dato de usuario residual
    localStorage.removeItem('user');
    return false;
  }
  
  // Verificar si el token es válido (no está expirado)
  try {
    // Si el token es un JWT, verificar su expiración
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    if (payload.exp < currentTime) {
      // Token expirado, limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
    return true;
  } catch (e) {
    // Si no es un JWT válido, asumir que es un token simple
    // Pero verificar que tenga una longitud razonable
    if (token.length < 10) {
      // Token demasiado corto, probablemente inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
    return true;
  }
};

// Verificar si el usuario es administrador
const isAdmin = () => {
  if (!isAuthenticated()) return false;
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role === 'admin';
};

// Función para obtener el usuario actual
const getUser = () => {
  if (!isAuthenticated()) return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
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
        const token = getAuthToken();
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        // Agregar token de autenticación si existe
        if (token) {
            defaultOptions.headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Combinar opciones
        const mergedOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, mergedOptions);
        
        // Manejar respuestas no exitosas
        if (!response.ok) {
            if (response.status === 401) {
                // Token inválido o expirado
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'login.html';
                throw new Error('No autorizado');
            }
            
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error HTTP: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        handleNetworkError(error);
        throw error;
    }
}

// Función para cerrar sesión
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Exportar funciones y constantes
export { 
  showNotification, 
  formatPrice, 
  updateCartCount, 
  loadImageWithProxy,
  validateEmail,
  validatePhone,
  isAuthenticated, 
  isAdmin, 
  getUser, 
  requireAuth, 
  requireAdmin, 
  getAuthToken, 
  handleNetworkError, 
  apiRequest,
  logout,
  API_BASE_URL
};
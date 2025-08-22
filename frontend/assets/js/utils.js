// utils.js - Funciones de utilidad compartidas

// Determinar la URL base del API según el entorno
const getApiBaseUrl = () => {
  // En producción, usar la URL del backend en Render
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // URL real del backend en Render
    return 'https://arreglos-victoria-backend.onrender.com';
  }
  
  // En desarrollo, usar localhost
  return 'http://localhost:5000';
};

const API_BASE_URL = getApiBaseUrl();

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Registrar el error en la consola si es de tipo error
    if (type === 'error') {
        console.error('Error notification:', message);
    } else if (type === 'warning') {
        console.warn('Warning notification:', message);
    } else {
        console.log('Info notification:', message);
    }
    
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
        background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : type === 'warning' ? '#ff9800' : '#2196f3'};
        color: white;
        padding: 16px;
        margin-bottom: 10px;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        position: relative;
        cursor: pointer;
        transition: opacity 0.3s, transform 0.3s;
        opacity: 1;
        transform: translateX(0);
    `;
    
    notification.innerHTML = `
        ${message}
        <span style="position: absolute; top: 5px; right: 10px; cursor: pointer; font-weight: bold;">&times;</span>
    `;
    
    // Añadir evento para cerrar la notificación al hacer clic
    notification.addEventListener('click', function() {
        this.style.opacity = '0';
        this.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        }, 300);
    });
    
    // Añadir la notificación al contenedor
    notificationContainer.appendChild(notification);
    
    // Eliminar automáticamente la notificación después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
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
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCountElements = document.querySelectorAll('.cart-count');
  cartCountElements.forEach(element => {
    element.textContent = count;
  });
}

// Validar email
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validar teléfono
const validatePhone = (phone) => {
  // Aceptar formatos chilenos: +56 9 1234 5678, +56912345678, 9 1234 5678, etc.
  const re = /^(\+56)?[\s\-]?[9\d][\s\-]?\d{4}[\s\-]?\d{4}$/;
  return re.test(phone.replace(/\s+/g, ' ').trim());
};

// Verificar si el usuario está autenticado
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Intentar parsear como JWT
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    if (payload.exp < currentTime) {
      // Token expirado, limpiar
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
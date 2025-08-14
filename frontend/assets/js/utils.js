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

// Función para mostrar notificaciones
function showNotification(message, type) {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Agregar estilo a la notificación
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 5px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
  `;
  
  // Estilos específicos por tipo
  if (type === 'success') {
    notification.style.background = '#4caf50';
  } else if (type === 'error') {
    notification.style.background = '#f44336';
  } else {
    notification.style.background = '#2196f3';
  }
  
  // Agregar al body
  document.body.appendChild(notification);
  
  // Mostrar con animación
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Eliminar después de 3 segundos
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Función para actualizar el contador del carrito
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((total, item) => total + (item.quantity || 0), 0);
  const cartCountElements = document.querySelectorAll('.cart-count');
  
  cartCountElements.forEach(element => {
    if (totalItems > 0) {
      element.textContent = totalItems;
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden');
    }
  });
}

// Función para obtener información del usuario
function getUser() {
  return JSON.parse(localStorage.getItem('user')) || null;
}

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
  return !!getUser();
}

// Función para cerrar sesión
function logout() {
  localStorage.removeItem('user');
  updateCartCount();
  console.log('Usuario desconectado');
}

// Función para formatear precios en formato chileno
function formatPrice(price) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(price);
}

// Función para realizar solicitudes HTTP con token
async function apiRequest(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  // Configuración por defecto
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };
  
  // Agregar token de autenticación si existe
  const user = getUser();
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  
  try {
    const response = await fetch(url, config);
    
    // Manejar respuestas no exitosas
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en la solicitud API:', error);
    throw error;
  }
}

// Exportar funciones
export { 
  showNotification, 
  updateCartCount, 
  getUser, 
  isAuthenticated, 
  logout,
  formatPrice,
  apiRequest,
  getApiBaseUrl
};
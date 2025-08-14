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

// URL base del API
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

// Función para actualizar el contador del carrito
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('arreglosVictoriaCart')) || [];
  const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCountElements = document.querySelectorAll('.cart-count');
  
  cartCountElements.forEach(element => {
    element.textContent = totalCount;
  });
  
  // Mostrar información de depuración
  console.log('Carrito actualizado. Total de productos:', totalCount);
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

// Exportar funciones y constantes
export { 
  API_BASE_URL, 
  showNotification, 
  isAuthenticated, 
  isAdmin,
  requireAuth,
  requireAdmin,
  formatPrice,
  logout,
  validateEmail,
  validatePhone,
  loadImageWithProxy
};
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
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
  `;
  
  // Colores según el tipo
  if (type === 'success') {
    notification.style.backgroundColor = '#48bb78';
  } else if (type === 'error') {
    notification.style.backgroundColor = '#e53e3e';
  } else {
    notification.style.backgroundColor = '#3182ce';
  }
  
  // Agregar notificación al cuerpo
  document.body.appendChild(notification);
  
  // Animar entrada
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Eliminar notificación después de 3 segundos
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
  
  // Mostrar información de depuración
  console.log('Notificación mostrada:', message, 'Tipo:', type);
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

// Exportar funciones
export { 
  showNotification, 
  updateCartCount, 
  getUser, 
  isAuthenticated, 
  logout,
  formatPrice
};
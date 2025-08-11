// utils.js - Funciones de utilidad compartidas

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
    const cart = JSON.parse(localStorage.getItem('arreglosVictoriaCart')) || [];
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
    // Si la imagen ya es una URL de proxy, devolverla tal cual
    if (imageUrl.includes('/api/image-proxy')) {
        return imageUrl;
    }
    
    // Si es una imagen local, devolverla tal cual
    if (imageUrl.startsWith('data:') || imageUrl.startsWith('/') || imageUrl.startsWith('assets/')) {
        return imageUrl;
    }
    
    // Para imágenes externas, usar el proxy
    return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
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
}

// Exportar funciones
export { showNotification, formatPrice, updateCartCount, loadImageWithProxy, getUser, isAuthenticated, logout };
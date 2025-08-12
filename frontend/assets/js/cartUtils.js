// Utilidades para el carrito de compras

class CartUtils {
  static CART_KEY = 'arreglosVictoriaCart';

  // Obtener el carrito del localStorage
  static getCart() {
    try {
      const cart = localStorage.getItem(this.CART_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
      return [];
    }
  }

  // Guardar el carrito en localStorage
  static saveCart(cart) {
    try {
      localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error al guardar el carrito:', error);
    }
  }

  // Agregar producto al carrito
  static addToCart(product) {
    const cart = this.getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.image,
        quantity: 1
      });
    }
    
    this.saveCart(cart);
    this.updateCartCount();
    
    // Mostrar notificación de éxito
    this.showNotification(`${product.name} agregado al carrito`, 'success');
    
    return cart;
  }
  
  // Mostrar notificación
  static showNotification(message, type = 'info') {
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
    notification.className = `notification notification-${type} notification-slide-down`;
    notification.style.cssText = `
      background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : '#2196f3'};
      color: white;
      padding: 16px;
      margin-bottom: 10px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease-in-out;
      cursor: pointer;
      font-weight: 500;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
      </div>
    `;
    notificationContainer.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Eliminar automáticamente después de 5 segundos
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
    
    // Eliminar al hacer clic
    notification.addEventListener('click', () => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    });
  }
  
  // Formatear precio
  static formatPrice(price) {
    // Asegurarse de que el precio sea un número
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    if (isNaN(numericPrice)) {
      return '$0';
    }
    
    // Formatear con separadores de miles y sin decimales
    return '$' + Math.round(numericPrice).toLocaleString('es-CL');
  }

  // Eliminar producto del carrito
  static removeFromCart(productId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.id !== productId);
    this.saveCart(cart);
    this.updateCartCount();
    
    // Mostrar notificación de éxito
    const item = this.getCart().find(item => item.id === productId);
    if (!item) {
      this.showNotification('Producto eliminado del carrito', 'success');
    }
    
    return cart;
  }

  // Actualizar cantidad de un producto
  static updateQuantity(productId, quantity) {
    const cart = this.getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
      const newQuantity = Math.max(1, parseInt(quantity));
      if (newQuantity !== item.quantity) {
        item.quantity = newQuantity;
        this.saveCart(cart);
        
        // Mostrar notificación de éxito
        this.showNotification(`Cantidad actualizada para ${item.name}`, 'success');
      }
      this.updateCartCount();
      return cart;
    }
    
    return cart;
  }

  // Obtener total de items en el carrito
  static getCartCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  // Obtener total del carrito
  static getCartTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Actualizar contador visual del carrito
  static updateCartCount() {
    const count = this.getCartCount();
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(element => {
      element.textContent = count;
      element.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  }

  // Limpiar carrito
  static clearCart() {
    localStorage.removeItem(this.CART_KEY);
    this.updateCartCount();
  }
}

// Actualizar contador del carrito cuando la página cargue
document.addEventListener('DOMContentLoaded', function() {
  CartUtils.updateCartCount();
});

export default CartUtils;
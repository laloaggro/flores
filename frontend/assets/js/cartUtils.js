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
    
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.id == product.id);
    
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
    return cart;
  }

  // Eliminar producto del carrito
  static removeFromCart(productId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.id != productId);
    this.saveCart(cart);
    this.updateCartCount();
    return cart;
  }

  // Actualizar cantidad de un producto
  static updateQuantity(productId, quantity) {
    const cart = this.getCart();
    const item = cart.find(item => item.id == productId);
    
    if (item) {
      item.quantity = parseInt(quantity);
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.saveCart(cart);
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
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
      const count = this.getCartCount();
      cartCountElement.textContent = count;
      cartCountElement.style.display = count > 0 ? 'flex' : 'none';
    }
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
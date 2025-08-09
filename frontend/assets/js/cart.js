import { showNotification, getUser, isAuthenticated, formatPrice } from './utils.js';
import CartUtils from './cartUtils.js';

// Funcionalidad del carrito de compras

document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const cartIcon = document.querySelector('.cart-icon');
  const cartModal = document.getElementById('cartModal');
  const cartClose = document.querySelector('.cart-close');
  const cartItems = document.querySelector('.cart-items');
  const totalAmount = document.querySelector('.total-amount');
  const checkoutButton = document.querySelector('.checkout-button');
  
  // Mostrar/ocultar carrito - solo si los elementos existen
  if (cartIcon && cartModal) {
    cartIcon.addEventListener('click', function() {
      loadCart();
      cartModal.style.display = 'block';
    });
  }
  
  if (cartClose && cartModal) {
    cartClose.addEventListener('click', function() {
      cartModal.style.display = 'none';
    });
  }
  
  if (cartModal) {
    window.addEventListener('click', function(event) {
      if (event.target === cartModal) {
        cartModal.style.display = 'none';
      }
    });
  }
  
  // Agregar funcionalidad al botón 'Proceder al pedido'
  if (checkoutButton) {
    checkoutButton.addEventListener('click', function() {
      const cart = CartUtils.getCart();
      
      if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'error');
        return;
      }
      
      // Verificar si el usuario está logueado
      if (!isAuthenticated()) {
        showNotification('Debes iniciar sesión para continuar con el pedido', 'error');
        // Mostrar información de depuración
        console.log('Usuario no autenticado, redirigiendo a login');
        
        // Redirigir a la página de login/registro
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
        return;
      }
      
      // Redirigir a la página de checkout
      window.location.href = 'checkout.html';
    });
  }
  
  // Función para cargar y mostrar el carrito
  function loadCart() {
    // Mostrar información de depuración
    console.log('Cargando carrito desde localStorage');
    
    const cart = CartUtils.getCart();
    renderCart(cart);
  }
  
  // Función para renderizar el carrito
  function renderCart(cartItemsData) {
    // Mostrar información de depuración
    console.log('Renderizando carrito con', cartItemsData.length, 'productos');
    
    if (cartItemsData.length === 0) {
      cartItems.innerHTML = '<p class="empty-cart-message">Tu carrito está vacío</p>';
      totalAmount.textContent = '$0';
      checkoutButton.disabled = true;
      return;
    }
    
    // Calcular total
    const total = CartUtils.getCartTotal();
    
    // Renderizar items del carrito
    cartItems.innerHTML = cartItemsData.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <h4 class="cart-item-name">${item.name}</h4>
          <p class="cart-item-price">${formatPrice(item.price)}</p>
          <div class="cart-item-quantity">
            <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
          </div>
        </div>
        <div class="cart-item-actions">
          <button class="remove-btn" data-id="${item.id}">×</button>
        </div>
      </div>
    `).join('');
    
    // Actualizar total
    totalAmount.textContent = formatPrice(total);
    checkoutButton.disabled = false;
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.decrease-btn').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.dataset.id;
        updateQuantity(id, -1);
      });
    });
    
    document.querySelectorAll('.increase-btn').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.dataset.id;
        updateQuantity(id, 1);
      });
    });
    
    document.querySelectorAll('.remove-btn').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.dataset.id;
        removeFromCart(id);
      });
    });
  }
  
  // Función para actualizar la cantidad de un producto
  function updateQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const productIndex = cart.findIndex(item => item.id == productId);
    
    if (productIndex !== -1) {
      cart[productIndex].quantity += change;
      
      // Si la cantidad es 0 o menos, eliminar el producto
      if (cart[parameter=productIndex].quantity <= 0) {
        cart.splice(productIndex, 1);
      }
      
      // Guardar carrito actualizado
      CartUtils.saveCart(cart);
      
      // Mostrar información de depuración
      console.log('Cantidad actualizada para producto', productId, 'Nueva cantidad:', cart[parameter=productIndex]?.quantity || 0);
      
      // Actualizar contador del carrito y volver a renderizar
      updateCartCount();
      renderCart(cart);
    }
  }
  
  // Función para eliminar un producto del carrito
  function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const initialLength = cart.length;
    cart = cart.filter(item => item.id != productId);
    
    // Guardar carrito actualizado
    CartUtils.saveCart(cart);
    
    // Mostrar información de depuración
    console.log('Producto eliminado del carrito', productId, 'Productos eliminados:', initialLength - cart.length);
    
    // Actualizar contador del carrito y volver a renderizar
    updateCartCount();
    renderCart(cart);
  }
  
  // Función para actualizar el contador del carrito
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(element => {
      element.textContent = totalCount;
    });
    
    // Mostrar información de depuración
    console.log('Carrito actualizado. Total de productos:', totalCount);
  }
  
  // Inicializar contador del carrito
  updateCartCount();
});
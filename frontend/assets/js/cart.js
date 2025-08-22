function Cart(cartItems = [], savedForLaterItems = []) {
  // Construir el HTML del carrito
  return `
    <div id="cartModal" class="cart-modal">
      <div class="cart-modal-content">
        <span class="cart-close">&times;</span>
        <h2>Tu Carrito</h2>
        
        <div class="cart-section">
          <h3>Productos en tu carrito</h3>
          <div class="cart-items">
            ${renderCartItems(cartItems)}
          </div>
        </div>
        
        <div class="cart-section">
          <h3>Guardados para más tarde</h3>
          <div class="saved-for-later">
            ${renderSavedForLater(savedForLaterItems)}
          </div>
        </div>
        
        <div class="cart-summary">
          <p>Total: <span class="total-amount">${formatPrice(CalculateCartTotal(cartItems))}</span></p>
          <button class="checkout-button">Proceder al pedido</button>
        </div>
      </div>
    </div>
  `;
}

function renderCartItems(items) {
  if (items.length === 0) {
    return '<p class="empty-cart-message">Tu carrito está vacío</p>';
  }
  
  return items.map(item => `
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
        <p class="cart-item-total">${formatPrice(item.price * item.quantity)}</p>
      </div>
      <div class="cart-item-actions">
        <button class="remove-btn" data-id="${item.id}">×</button>
        <button class="save-for-later" data-id="${item.id}">Guardar para más tarde</button>
      </div>
    </div>
  `).join('');
}

function renderSavedForLater(items) {
  if (items.length === 0) {
    return '<p>No tienes productos guardados</p>';
  }
  
  return items.map(item => `
    <div class="saved-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="saved-item-image">
      <div class="saved-item-details">
        <h4>${item.name}</h4>
        <p>${formatPrice(item.price)}</p>
      </div>
      <button class="move-to-cart" data-id="${item.id}">Mover al carrito</button>
    </div>
  `).join('');
}

function CalculateCartTotal(items) {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export default Cart;
import { showNotification, getUser, isAuthenticated, formatPrice } from './utils.js';
import CartUtils from './cartUtils.js';
import Cart from '../components/Cart.js';

// Funcionalidad del carrito de compras

document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const cartIcon = document.querySelector('.cart-icon');
  const cartClose = document.querySelector('.cart-close');
  const cartItemsContainer = document.querySelector('.cart-items');
  const totalAmount = document.querySelector('.total-amount');
  const checkoutButton = document.querySelector('.checkout-button');
  
  // Mostrar/ocultar carrito - solo si los elementos existen
  if (cartIcon) {
    cartIcon.addEventListener('click', function() {
      showCart();
    });
  }
  
  if (cartClose) {
    cartClose.addEventListener('click', function() {
      hideCart();
    });
  }
  
  // Cerrar carrito al hacer clic fuera
  document.addEventListener('click', function(event) {
    const cartModal = document.getElementById('cartModal');
    if (cartModal && event.target === cartModal) {
      hideCart();
    }
  });
  
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
  
  // Función para mostrar el carrito
  function showCart() {
    const cart = CartUtils.getCart();
    const savedForLater = CartUtils.getSavedForLater();
    
    // Crear o actualizar el modal del carrito
    let cartModal = document.getElementById('cartModal');
    if (!cartModal) {
      // Crear el contenedor para el carrito si no existe
      const cartContainer = document.createElement('div');
      cartContainer.id = 'cartContainer';
      document.body.appendChild(cartContainer);
      
      // Renderizar el carrito
      cartContainer.innerHTML = Cart(cart, savedForLater);
    } else {
      // Actualizar el contenido del carrito existente
      cartModal.outerHTML = Cart(cart, savedForLater);
    }
    
    // Mostrar el carrito
    const modal = document.getElementById('cartModal');
    if (modal) {
      modal.style.display = 'block';
      
      // Añadir event listeners a los nuevos elementos
      attachCartEventListeners();
    }
  }
  
  // Función para ocultar el carrito
  function hideCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
      cartModal.style.display = 'none';
    }
  }
  
  // Función para adjuntar event listeners a los elementos del carrito
  function attachCartEventListeners() {
    // Botones de cerrar
    const closeButtons = document.querySelectorAll('.cart-close');
    closeButtons.forEach(button => {
      button.addEventListener('click', hideCart);
    });
    
    // Botones de cantidad
    const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease-btn, .decrease-quantity');
    decreaseButtons.forEach(button => {
      button.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        updateCartItemQuantity(id, -1);
      });
    });
    
    const increaseButtons = document.querySelectorAll('.quantity-btn.increase-btn, .increase-quantity');
    increaseButtons.forEach(button => {
      button.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        updateCartItemQuantity(id, 1);
      });
    });
    
    // Botones de eliminar
    const removeButtons = document.querySelectorAll('.remove-item, .remove-from-cart');
    removeButtons.forEach(button => {
      button.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        removeFromCart(id);
      });
    });
    
    // Botones de guardar para más tarde
    const saveForLaterButtons = document.querySelectorAll('.save-for-later');
    saveForLaterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        saveItemForLater(id);
      });
    });
    
    // Botones de mover al carrito
    const moveToCartButtons = document.querySelectorAll('.move-to-cart');
    moveToCartButtons.forEach(button => {
      button.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        moveItemToCart(id);
      });
    });
  }
  
  // Función para actualizar la cantidad de un item en el carrito
  function updateCartItemQuantity(id, change) {
    const cart = CartUtils.getCart();
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
      cart[itemIndex].quantity += change;
      
      // Si la cantidad es menor a 1, eliminar el item
      if (cart[itemIndex].quantity < 1) {
        cart.splice(itemIndex, 1);
      }
      
      // Guardar el carrito actualizado
      CartUtils.saveCart(cart);
      
      // Actualizar el contador del carrito
      updateCartCount();
      
      // Volver a mostrar el carrito
      showCart();
    }
  }
  
  // Función para eliminar un item del carrito
  function removeFromCart(id) {
    const cart = CartUtils.getCart();
    const updatedCart = cart.filter(item => item.id !== id);
    
    // Guardar el carrito actualizado
    CartUtils.saveCart(updatedCart);
    
    // Actualizar el contador del carrito
    updateCartCount();
    
    // Volver a mostrar el carrito
    showCart();
  }
  
  // Función para guardar un item para más tarde
  function saveItemForLater(id) {
    const cart = CartUtils.getCart();
    const savedForLater = CartUtils.getSavedForLater();
    
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      const item = cart[itemIndex];
      
      // Eliminar del carrito
      cart.splice(itemIndex, 1);
      
      // Añadir a guardados para más tarde
      savedForLater.push(item);
      
      // Guardar ambos arrays
      CartUtils.saveCart(cart);
      CartUtils.saveSavedForLater(savedForLater);
      
      // Actualizar el contador del carrito
      updateCartCount();
      
      // Volver a mostrar el carrito
      showCart();
    }
  }
  
  // Función para mover un item guardado al carrito
  function moveItemToCart(id) {
    const cart = CartUtils.getCart();
    const savedForLater = CartUtils.getSavedForLater();
    
    const itemIndex = savedForLater.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      const item = savedForLater[itemIndex];
      
      // Eliminar de guardados para más tarde
      savedForLater.splice(itemIndex, 1);
      
      // Añadir al carrito
      cart.push(item);
      
      // Guardar ambos arrays
      CartUtils.saveCart(cart);
      CartUtils.saveSavedForLater(savedForLater);
      
      // Actualizar el contador del carrito
      updateCartCount();
      
      // Volver a mostrar el carrito
      showCart();
    }
  }
  
  // Función para actualizar el contador del carrito
  function updateCartCount() {
    const cart = CartUtils.getCart();
    const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
      element.textContent = totalCount;
    });
  }
});
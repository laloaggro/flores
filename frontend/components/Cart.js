import CartUtils from '../assets/js/cartUtils.js';
import { showNotification, formatPrice } from '../assets/js/utils.js';

/**
 * Cart - Componente para el carrito de compras
 * @param {Array} cartItems - Array de items en el carrito
 * @param {Array} savedForLater - Array de items guardados para más tarde
 * @returns {string} - HTML del carrito
 */
function Cart(cartItems = [], savedForLater = []) {
  // Validar que cartItems y savedForLater sean arrays
  if (!Array.isArray(cartItems)) {
    console.error('Cart component: cartItems should be an array', cartItems);
    cartItems = [];
  }
  
  if (!Array.isArray(savedForLater)) {
    console.error('Cart component: savedForLater should be an array', savedForLater);
    savedForLater = [];
  }

  // Calcular totales
  const cartTotal = calculateCartTotal(cartItems);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Generar HTML del carrito
  return `
    <div class="cart-modal" id="cartModal">
      <div class="cart-content">
        <div class="cart-header">
          <h2>Carrito de Compras</h2>
          <button class="btn btn-icon cart-close" aria-label="Cerrar carrito">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="cart-body">
          <div class="cart-items-section">
            <h3>Tus Productos (${itemCount} ${itemCount === 1 ? 'item' : 'items'})</h3>
            <div class="cart-items">
              ${renderCartItems(cartItems)}
            </div>
          </div>
          
          <div class="saved-for-later-section">
            <h3>Guardados para más tarde</h3>
            <div class="saved-items">
              ${renderSavedItems(savedForLater)}
            </div>
          </div>
        </div>
        
        <div class="cart-footer">
          <div class="cart-summary">
            <div class="summary-row">
              <span>Total:</span>
              <span class="total-amount">${formatPrice(cartTotal)}</span>
            </div>
          </div>
          <div class="cart-actions">
            <button class="btn btn-secondary clear-cart">Vaciar carrito</button>
            <button class="btn btn-primary checkout-button" ${cartItems.length === 0 ? 'disabled' : ''}>
              Proceder al pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}


// Función para calcular el total del carrito
function calculateCartTotal(items) {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Función para renderizar items guardados para más tarde
function renderSavedItems(items) {
  if (items.length === 0) {
    return '<p class="empty-saved">No hay productos guardados para más tarde</p>';
  }

  return items.map(item => `
    <div class="saved-item" data-id="${item.id}">
      <div class="item-image">
        <img src="${item.image || './assets/images/placeholder.svg'}" 
             alt="${item.name}" 
             onerror="this.src='./assets/images/placeholder.svg'">
      </div>
      <div class="item-info">
        <h4>${item.name}</h4>
        <p class="item-price">${formatPrice(item.price)}</p>
      </div>
      <div class="item-actions">
        <button class="btn btn-secondary move-to-cart" data-id="${item.id}">
          <i class="fas fa-shopping-cart"></i> Mover al carrito
        </button>
        <button class="btn btn-danger remove-saved-item" data-id="${item.id}">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </div>
    </div>
  `).join('');
}

// Función para renderizar items del carrito
function renderCartItems(items) {
  if (items.length === 0) {
    return `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart fa-3x"></i>
        <h3>Tu carrito está vacío</h3>
        <p>Agrega productos para comenzar</p>
        <a href="products.html" class="btn btn-primary">Ver productos</a>
      </div>
    `;
  }

  return items.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="item-image">
        <img src="${item.image || './assets/images/placeholder.svg'}" 
             alt="${item.name}" 
             onerror="this.src='./assets/images/placeholder.svg'">
      </div>
      <div class="item-info">
        <h4>${item.name}</h4>
        <p class="item-price">${formatPrice(item.price)}</p>
      </div>
      <div class="item-quantity">
        <button class="btn btn-quantity decrease" data-id="${item.id}" aria-label="Disminuir cantidad">
          <i class="fas fa-minus"></i>
        </button>
        <span class="quantity">${item.quantity}</span>
        <button class="btn btn-quantity increase" data-id="${item.id}" aria-label="Aumentar cantidad">
          <i class="fas fa-plus"></i>
        </button>
      </div>
      <div class="item-total">
        <span>${formatPrice(item.price * item.quantity)}</span>
      </div>
      <div class="item-actions">
        <button class="btn btn-icon save-for-later" data-id="${item.id}" aria-label="Guardar para más tarde">
          <i class="fas fa-save"></i>
        </button>
        <button class="btn btn-icon remove-item" data-id="${item.id}" aria-label="Eliminar del carrito">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// Función para adjuntar event listeners al carrito
Cart.attachEventListeners = function() {
  // Asegurarse de que el carrito exista
  const cartModal = document.getElementById('cartModal');
  if (!cartModal) return;

  // Botón de cerrar carrito
  const closeCartButton = cartModal.querySelector('.cart-close');
  if (closeCartButton) {
    closeCartButton.removeEventListener('click', handleCloseCart);
    closeCartButton.addEventListener('click', handleCloseCart);
  }

  // Botones de aumentar cantidad
  cartModal.querySelectorAll('.increase').forEach(button => {
    button.removeEventListener('click', handleIncreaseQuantity);
    button.addEventListener('click', handleIncreaseQuantity);
  });

  // Botones de disminuir cantidad
  cartModal.querySelectorAll('.decrease').forEach(button => {
    button.removeEventListener('click', handleDecreaseQuantity);
    button.addEventListener('click', handleDecreaseQuantity);
  });

  // Botones de eliminar item
  cartModal.querySelectorAll('.remove-item').forEach(button => {
    button.removeEventListener('click', handleRemoveItem);
    button.addEventListener('click', handleRemoveItem);
  });

  // Botones de guardar para más tarde
  cartModal.querySelectorAll('.save-for-later').forEach(button => {
    button.removeEventListener('click', handleSaveForLater);
    button.addEventListener('click', handleSaveForLater);
  });

  // Botones de mover al carrito (desde guardados para más tarde)
  cartModal.querySelectorAll('.move-to-cart').forEach(button => {
    button.removeEventListener('click', handleMoveToCart);
    button.addEventListener('click', handleMoveToCart);
  });

  // Botones de eliminar de guardados para más tarde
  cartModal.querySelectorAll('.remove-saved-item').forEach(button => {
    button.removeEventListener('click', handleRemoveSavedItem);
    button.addEventListener('click', handleRemoveSavedItem);
  });

  // Botón de vaciar carrito
  const clearCartButton = cartModal.querySelector('.clear-cart');
  if (clearCartButton) {
    clearCartButton.removeEventListener('click', handleClearCart);
    clearCartButton.addEventListener('click', handleClearCart);
  }

  // Botón de checkout
  const checkoutButton = cartModal.querySelector('.checkout-button');
  if (checkoutButton) {
    checkoutButton.removeEventListener('click', handleCheckout);
    checkoutButton.addEventListener('click', handleCheckout);
  }

  console.log('Event listeners del carrito adjuntados');
};

// Funciones controladoras para los eventos
function handleCloseCart() {
  const cartModal = document.getElementById('cartModal');
  if (cartModal) {
    cartModal.style.display = 'none';
  }
}

function handleIncreaseQuantity(e) {
  e.preventDefault();
  e.stopPropagation();
  const productId = parseInt(e.currentTarget.getAttribute('data-id'));
  const cartItems = CartUtils.getCartItems();
  const item = cartItems.find(item => item.id == productId);
  
  if (item) {
    // Llamar a la utilidad para actualizar la cantidad
    CartUtils.updateQuantity(productId, item.quantity + 1);
    
    // Actualizar la UI
    updateCartUI();
  }
}

function handleDecreaseQuantity(e) {
  e.preventDefault();
  e.stopPropagation();
  const productId = parseInt(e.currentTarget.getAttribute('data-id'));
  const cartItems = CartUtils.getCartItems();
  const item = cartItems.find(item => item.id == productId);
  
  if (item) {
    if (item.quantity > 1) {
      // Llamar a la utilidad para actualizar la cantidad
      CartUtils.updateQuantity(productId, item.quantity - 1);
    } else {
      // Eliminar el item del carrito
      CartUtils.removeFromCart(productId);
    }
    
    // Actualizar la UI
    updateCartUI();
  }
}

function handleRemoveItem(e) {
  e.preventDefault();
  e.stopPropagation();
  const productId = parseInt(e.currentTarget.getAttribute('data-id'));
  CartUtils.removeFromCart(productId);
  
  // Actualizar la UI
  updateCartUI();
}

function handleSaveForLater(e) {
  e.preventDefault();
  e.stopPropagation();
  const productId = parseInt(e.currentTarget.getAttribute('data-id'));
  CartUtils.saveForLater(productId);
  
  // Actualizar la UI
  updateCartUI();
}

function handleMoveToCart(e) {
  e.preventDefault();
  e.stopPropagation();
  const productId = parseInt(e.currentTarget.getAttribute('data-id'));
  CartUtils.moveToCart(productId);
  
  // Actualizar la UI
  updateCartUI();
}

function handleRemoveSavedItem(e) {
  e.preventDefault();
  e.stopPropagation();
  const productId = parseInt(e.currentTarget.getAttribute('data-id'));
  CartUtils.removeFromSaved(productId);
  
  // Actualizar la UI
  updateCartUI();
}

function handleClearCart(e) {
  e.preventDefault();
  e.stopPropagation();
  if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
    CartUtils.clearCart();
    // Actualizar la UI para mostrar el carrito vacío
    updateCartUI();
  }
}

// Función para actualizar solo la UI del carrito sin recrearlo
function updateCartUI() {
  const cart = CartUtils.getCartItems();
  const savedForLater = CartUtils.getSavedItems();
  
  const cartModal = document.getElementById('cartModal');
  if (!cartModal) return;
  
  // Asegurarse de que el carrito permanezca visible
  cartModal.style.display = 'block';
  
  // Actualizar sección de items del carrito
  const cartItemsSection = cartModal.querySelector('.cart-items');
  if (cartItemsSection) {
    cartItemsSection.innerHTML = renderCartItems(cart);
  }
  
  // Actualizar contador de items
  const itemsHeader = cartModal.querySelector('.cart-items-section h3');
  if (itemsHeader) {
    itemsHeader.textContent = `Tus Productos (${cart.length} ${cart.length === 1 ? 'item' : 'items'})`;
  }
  
  // Actualizar items guardados para más tarde
  const savedItemsSection = cartModal.querySelector('.saved-items');
  if (savedItemsSection) {
    savedItemsSection.innerHTML = renderSavedItems(savedForLater);
  }
  
  // Actualizar total
  const totalAmount = cartModal.querySelector('.total-amount');
  if (totalAmount) {
    totalAmount.textContent = formatPrice(calculateCartTotal(cart));
  }
  
  // Actualizar estado del botón de checkout
  const checkoutButton = cartModal.querySelector('.checkout-button');
  if (checkoutButton) {
    if (cart.length === 0) {
      checkoutButton.setAttribute('disabled', 'disabled');
    } else {
      checkoutButton.removeAttribute('disabled');
    }
  }
  
  // Volver a adjuntar event listeners
  Cart.attachEventListeners();
}

// Asegurar que estas funciones estén disponibles globalmente
window.renderCartItems = renderCartItems;
window.renderSavedItems = renderSavedItems;
window.updateCartUI = updateCartUI;
window.updateCartUI = updateCartUI;

function handleCheckout(e) {
  e.preventDefault();
  e.stopPropagation();
  const cart = CartUtils.getCartItems();
  
  if (cart.length === 0) {
    // Mostrar notificación de que el carrito está vacío
    showNotification('Tu carrito está vacío', 'error');
    return;
  }
  
  const cartModal = document.getElementById('cartModal');
  if (cartModal) {
    cartModal.style.display = 'none';
    // Aquí podrías redirigir a la página de checkout
    window.location.href = 'checkout.html';
  }
}

// Exportar componente y funciones
export default Cart;
export { renderCartItems, renderSavedItems };

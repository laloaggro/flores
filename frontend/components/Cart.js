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

  // Generar HTML del carrito con mejor accesibilidad
  return `
    <div class="cart-modal" id="cartModal" role="dialog" aria-labelledby="cart-title" aria-modal="true">
      <div class="cart-content" tabindex="0">
        <div class="cart-header">
          <h2 id="cart-title">Carrito de Compras</h2>
          <button class="btn btn-icon cart-close" aria-label="Cerrar carrito">
            <i class="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>
        
        <div class="cart-body">
          <div class="cart-items-section">
            <h3 id="cart-items-title">Tus Productos (${itemCount} ${itemCount === 1 ? 'item' : 'items'})</h3>
            <div class="cart-items" role="list" aria-labelledby="cart-items-title">
              ${renderCartItems(cartItems)}
            </div>
          </div>
          
          <div class="saved-for-later-section">
            <h3 id="saved-items-title">Guardados para más tarde</h3>
            <div class="saved-items" role="list" aria-labelledby="saved-items-title">
              ${renderSavedItems(savedForLater)}
            </div>
          </div>
        </div>
        
        <div class="cart-footer">
          <div class="cart-summary">
            <div class="summary-row">
              <span>Total:</span>
              <span class="cart-total" aria-live="polite">${formatPrice(cartTotal)}</span>
            </div>
          </div>
          <div class="cart-actions">
            <button class="btn btn-secondary" id="continueShopping" aria-label="Seguir comprando">
              Seguir Comprando
            </button>
            <button class="btn btn-primary" id="checkoutButton" ${itemCount === 0 ? 'disabled' : ''} aria-label="Proceder al pago">
              Proceder al Pago
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

/**
 * Renderiza los items guardados para más tarde
 * @param {Array} items - Array de items guardados
 * @returns {string} - HTML de los items guardados
 */
function renderSavedItems(items) {
  if (!items || items.length === 0) {
    return '<p class="empty-saved-message">No hay items guardados</p>';
  }

  return items.map(item => `
    <div class="saved-item" role="listitem">
      <div class="item-image">
        <img src="${item.image || './assets/images/default-product.jpg'}" 
             alt="${item.name}" 
             loading="lazy"
             onerror="this.src='./assets/images/default-product.jpg'">
      </div>
      <div class="item-info">
        <h4>${item.name}</h4>
        <p class="item-price">${formatPrice(item.price)}</p>
      </div>
      <div class="item-actions">
        <button class="btn-icon move-to-cart" 
                aria-label="Mover ${item.name} al carrito" 
                data-id="${item.id}">
          <i class="fas fa-cart-plus" aria-hidden="true"></i>
        </button>
        <button class="btn-icon remove-saved-item" 
                aria-label="Eliminar ${item.name} de guardados" 
                data-id="${item.id}">
          <i class="fas fa-trash" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  `).join('');
}

/**
 * Renderiza los items del carrito
 * @param {Array} items - Array de items del carrito
 * @returns {string} - HTML de los items del carrito
 */
function renderCartItems(items) {
  if (!items || items.length === 0) {
    return '<p class="empty-cart-message">Tu carrito está vacío</p>';
  }

  return items.map(item => `
    <div class="cart-item" role="listitem">
      <div class="item-image">
        <img src="${item.image || './assets/images/default-product.jpg'}" 
             alt="${item.name}" 
             loading="lazy"
             onerror="this.src='./assets/images/default-product.jpg'">
      </div>
      <div class="item-info">
        <h4>${item.name}</h4>
        <p class="item-price">${formatPrice(item.price)}</p>
        <div class="item-quantity">
          <button class="quantity-btn decrease" 
                  aria-label="Disminuir cantidad de ${item.name}" 
                  data-id="${item.id}">
            <i class="fas fa-minus" aria-hidden="true"></i>
          </button>
          <span class="quantity-display" id="quantity-${item.id}">${item.quantity}</span>
          <button class="quantity-btn increase" 
                  aria-label="Aumentar cantidad de ${item.name}" 
                  data-id="${item.id}">
            <i class="fas fa-plus" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      <div class="item-actions">
        <button class="btn-icon save-for-later" 
                aria-label="Guardar ${item.name} para más tarde" 
                data-id="${item.id}">
          <i class="fas fa-save" aria-hidden="true"></i>
        </button>
        <button class="btn-icon remove-item" 
                aria-label="Eliminar ${item.name} del carrito" 
                data-id="${item.id}">
          <i class="fas fa-trash" aria-hidden="true"></i>
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

  // Botón de "Seguir comprando"
  const continueShoppingButton = cartModal.querySelector('#continueShopping');
  if (continueShoppingButton) {
    continueShoppingButton.removeEventListener('click', handleContinueShopping);
    continueShoppingButton.addEventListener('click', handleContinueShopping);
  }

  // Botón de checkout
  const checkoutButton = cartModal.querySelector('#checkoutButton');
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

// Función para continuar comprando
function handleContinueShopping(e) {
  e.preventDefault();
  e.stopPropagation();
  const cartModal = document.getElementById('cartModal');
  if (cartModal) {
    cartModal.style.display = 'none';
  }
}

// Asegurar que estas funciones estén disponibles globalmente
window.renderCartItems = renderCartItems;
window.renderSavedItems = renderSavedItems;
window.updateCartUI = updateCartUI;

// Exportar componente
export default Cart;

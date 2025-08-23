// components/Cart.js

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

  // Función para calcular el total del carrito
  function calculateCartTotal(items) {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Función para formatear precios
  function formatPrice(price) {
    return `$${price.toLocaleString()}`;
  }

  // Función para renderizar items del carrito
  function renderCartItems(items) {
    if (items.length === 0) {
      return `
        <div class="empty-cart">
          <i class="fas fa-shopping-cart fa-3x"></i>
          <h3>Tu carrito está vacío</h3>
          <p>Agrega productos para comenzar</p>
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
          <div class="item-price">${formatPrice(item.price)}</div>
          <div class="item-quantity">
            <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
          </div>
        </div>
        <div class="item-actions">
          <button class="save-for-later" data-id="${item.id}">
            <i class="fas fa-save"></i> Guardar
          </button>
          <button class="remove-item" data-id="${item.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  // Función para renderizar items guardados para más tarde
  function renderSavedForLater(items) {
    if (items.length === 0) {
      return '';
    }

    return `
      <h3>Guardado para más tarde</h3>
      ${items.map(item => `
        <div class="saved-item" data-id="${item.id}">
          <div class="item-image">
            <img src="${item.image || './assets/images/placeholder.svg'}" 
                 alt="${item.name}" 
                 onerror="this.src='./assets/images/placeholder.svg'">
          </div>
          <div class="item-info">
            <h4>${item.name}</h4>
            <div class="item-price">${formatPrice(item.price)}</div>
          </div>
          <div class="item-actions">
            <button class="move-to-cart" data-id="${item.id}">
              <i class="fas fa-shopping-cart"></i> Mover al carrito
            </button>
            <button class="remove-saved-item" data-id="${item.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `).join('')}
    `;
  }

  // Función para actualizar la cantidad de un producto
  function updateQuantity(productId, newQuantity) {
    // Esta función se implementa en cartUtils.js
    console.warn('updateQuantity should be called from CartUtils');
  }

  // Función para eliminar un producto del carrito
  function removeFromCart(productId) {
    // Esta función se implementa en cartUtils.js
    console.warn('removeFromCart should be called from CartUtils');
  }

  // Función para guardar un producto para más tarde
  function saveForLater(productId) {
    // Esta función se implementa en cartUtils.js
    console.warn('saveForLater should be called from CartUtils');
  }

  // Función para mover un producto del guardado al carrito
  function moveToCart(productId) {
    // Esta función se implementa en cartUtils.js
    console.warn('moveToCart should be called from CartUtils');
  }

  // Renderizar el carrito completo
  return `
    <div id="cartModal" class="cart-modal">
      <div class="cart-header">
        <h2 class="cart-title">Tu Carrito</h2>
        <button class="cart-close">&times;</button>
      </div>
      <div class="cart-items">
        ${renderCartItems(cartItems)}
        ${renderSavedForLater(savedForLater)}
      </div>
      <div class="cart-footer">
        <div class="cart-total">
          <span>Total:</span>
          <span class="total-amount">${formatPrice(calculateCartTotal(cartItems))}</span>
        </div>
        <button class="checkout-button">Proceder al Pedido</button>
      </div>
    </div>
    <div class="overlay" id="overlay"></div>
  `;
}

// Funciones para guardar y cargar el carrito desde localStorage
function saveCartToLocalStorage(cart) {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
}

function loadCartFromLocalStorage() {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
}

export default Cart;
export { saveCartToLocalStorage, loadCartFromLocalStorage };
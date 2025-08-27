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
    // Formatear como moneda chilena sin decimales
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
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
          <button class="quantity-btn decrease" data-id="${item.id}" aria-label="Disminuir cantidad">
            <i class="fas fa-minus"></i>
          </button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn increase" data-id="${item.id}" aria-label="Aumentar cantidad">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <div class="item-total">
          <span>${formatPrice(item.price * item.quantity)}</span>
        </div>
        <div class="item-actions">
          <button class="save-for-later" data-id="${item.id}" aria-label="Guardar para más tarde">
            <i class="fas fa-save"></i>
          </button>
          <button class="remove-item" data-id="${item.id}" aria-label="Eliminar del carrito">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
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
        <div class="saved-item-actions">
          <button class="move-to-cart" data-id="${item.id}" aria-label="Mover al carrito">
            <i class="fas fa-shopping-cart"></i> Mover al carrito
          </button>
          <button class="remove-saved-item" data-id="${item.id}" aria-label="Eliminar">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
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
          <button class="cart-close" aria-label="Cerrar carrito">
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

// Función para mostrar el carrito
function showCart() {
  // Esta función será implementada en cart.js
  console.log('Mostrar carrito');
}

// Exportar componente y función
export default Cart;
export { showCart };
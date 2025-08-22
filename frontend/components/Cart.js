// Componente para el carrito de compras
const Cart = (cartItems = [], savedForLater = []) => {
  // Validar que cartItems y savedForLater sean arrays
  if (!Array.isArray(cartItems)) {
    console.error('Cart component: cartItems should be an array', cartItems);
    cartItems = [];
  }
  
  if (!Array.isArray(savedForLater)) {
    console.error('Cart component: savedForLater should be an array', savedForLater);
    savedForLater = [];
  }

  // Calcular el precio total
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Generar HTML para los items del carrito
  const cartItemsHTML = cartItems.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image || 'https://images.unsplash.com/photo-1593617133396-03503508724d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <h4 class="cart-item-name">${item.name}</h4>
        <p class="cart-item-price">${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(item.price)}</p>
        <div class="cart-item-quantity">
          <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
        </div>
      </div>
      <div class="cart-item-actions">
        <button class="save-for-later" data-id="${item.id}">
          <i class="fas fa-save"></i> Guardar
        </button>
        <button class="remove-from-cart" data-id="${item.id}">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </div>
    </div>
  `).join('');

  // Generar HTML para los items guardados para más tarde
  const savedItemsHTML = savedForLater.map(item => `
    <div class="saved-item" data-id="${item.id}">
      <img src="${item.image || 'https://images.unsplash.com/photo-1593617133396-03503508724d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'}" alt="${item.name}" class="saved-item-image">
      <div class="saved-item-details">
        <h4 class="saved-item-name">${item.name}</h4>
        <p class="saved-item-price">${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(item.price)}</p>
      </div>
      <div class="saved-item-actions">
        <button class="move-to-cart" data-id="${item.id}">
          <i class="fas fa-cart-plus"></i> Mover al carrito
        </button>
        <button class="remove-from-saved" data-id="${item.id}">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </div>
    </div>
  `).join('');

  return `
    <div id="cartModal" class="cart-modal" role="dialog" aria-labelledby="cartTitle" aria-modal="true">
      <div class="cart-content">
        <div class="cart-header">
          <h2 id="cartTitle">Tu Carrito (${cartItems.length})</h2>
          <span class="cart-close" role="button" tabindex="0" aria-label="Cerrar carrito">&times;</span>
        </div>
        <div class="cart-body">
          ${cartItems.length > 0 ? `
            <div class="cart-items">
              ${cartItemsHTML}
            </div>
          ` : `
            <div class="empty-cart-message">
              <i class="fas fa-shopping-cart fa-3x"></i>
              <h3>Tu carrito está vacío</h3>
              <p>Agrega productos para comenzar</p>
              <button class="btn btn-primary continue-shopping">Continuar comprando</button>
            </div>
          `}
          
          ${savedForLater.length > 0 ? `
            <div class="saved-for-later">
              <h3>Guardado para más tarde (${savedForLater.length})</h3>
              <div class="saved-items">
                ${savedItemsHTML}
              </div>
            </div>
          ` : ''}
          
          ${cartItems.length > 0 ? `
            <div class="cart-summary">
              <div class="cart-total">
                <span>Total:</span>
                <span class="total-amount">${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalPrice)}</span>
              </div>
              <button class="btn btn-primary checkout-button">Proceder al Pedido</button>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
};

// Función para guardar el carrito en localStorage
function saveCartToLocalStorage(cartItems) {
  try {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error al guardar el carrito en localStorage:', error);
  }
}

// Función para cargar el carrito desde localStorage
function loadCartFromLocalStorage() {
  try {
    const cartItems = localStorage.getItem('cartItems');
    return cartItems ? JSON.parse(cartItems) : [];
  } catch (error) {
    console.error('Error al cargar el carrito desde localStorage:', error);
    return [];
  }
}

// Añadir las funciones al objeto Cart para que estén disponibles desde el HTML
Cart.updateQuantity = updateQuantity;
Cart.removeFromCart = removeFromCart;
Cart.saveForLater = saveForLater;
Cart.moveToCart = moveToCart;

export default Cart;
export { saveCartToLocalStorage, loadCartFromLocalStorage };
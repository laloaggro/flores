const Cart = (cartItems = []) => {
  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Generate HTML for cart items
  const cartItemsHTML = cartItems.length ? cartItems.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <h4 class="cart-item-name">${item.name}</h4>
        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
        <div class="cart-item-quantity">
          <button class="quantity-btn decrease-btn">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn increase-btn">+</button>
        </div>
      </div>
      <div class="cart-item-actions">
        <button class="remove-btn">×</button>
      </div>
    </div>
  `).join('') : '<p class="empty-cart-message">Tu carrito está vacío</p>';

  return `
    <div id="cartModal" class="cart-modal">
      <div class="cart-content">
        <div class="cart-header">
          <h2>Tu Carrito</h2>
          <span class="cart-close">&times;</span>
        </div>
        <div class="cart-body">
          <div class="cart-items">
            ${cartItemsHTML}
          </div>
          <div class="cart-summary">
            <div class="cart-total">
              <span>Total:</span>
              <span class="total-amount">$${totalPrice.toFixed(2)}</span>
            </div>
            <button class="btn btn-primary checkout-button" ${cartItems.length ? '' : 'disabled'}>Proceder al Pedido</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

export default Cart;
// Componente para el carrito de compras
const Cart = (cartItems = []) => {
  // Validar que cartItems sea un array
  if (!Array.isArray(cartItems)) {
    console.error('Cart component: cartItems should be an array', cartItems);
    cartItems = [];
  }

  // Calcular el precio total con validación
  const totalPrice = cartItems.reduce((sum, item) => {
    // Validar que el item tenga las propiedades necesarias
    if (!item || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
      console.warn('Cart component: Invalid item in cart', item);
      return sum;
    }
    return sum + (item.price * item.quantity);
  }, 0);
  
  // Generar HTML para los items del carrito
  const cartItemsHTML = cartItems.length ? cartItems.map(item => {
    // Validar que el item tenga las propiedades necesarias
    if (!item || !item.id || !item.name || !item.image || 
        typeof item.price !== 'number' || typeof item.quantity !== 'number') {
      console.warn('Cart component: Invalid item structure', item);
      return ''; // Omitir items inválidos
    }
    
    return `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='/assets/images/products/product_1.jpg'">
        <div class="cart-item-details">
          <h4 class="cart-item-name">${item.name}</h4>
          <p class="cart-item-price">$${item.price.toLocaleString('es-CL')}</p>
          <div class="cart-item-quantity">
            <button class="quantity-btn decrease-btn" aria-label="Disminuir cantidad">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn increase-btn" aria-label="Aumentar cantidad">+</button>
          </div>
        </div>
        <div class="cart-item-actions">
          <button class="remove-btn" aria-label="Eliminar producto">×</button>
        </div>
      </div>
    `;
  }).join('') : '<p class="empty-cart-message">Tu carrito está vacío</p>';

  return `
    <div id="cartModal" class="cart-modal" role="dialog" aria-labelledby="cartTitle" aria-modal="true">
      <div class="cart-content">
        <div class="cart-header">
          <h2 id="cartTitle">Tu Carrito</h2>
          <span class="cart-close" role="button" tabindex="0" aria-label="Cerrar carrito">&times;</span>
        </div>
        <div class="cart-body">
          <div class="cart-items">
            ${cartItemsHTML}
          </div>
          <div class="cart-summary">
            <div class="cart-total">
              <span>Total:</span>
              <span class="total-amount">$${totalPrice.toLocaleString('es-CL')}</span>
            </div>
            <button class="btn btn-primary checkout-button" ${cartItems.length ? '' : 'disabled'} aria-disabled="${cartItems.length ? 'false' : 'true'}">Proceder al Pedido</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

export default Cart;
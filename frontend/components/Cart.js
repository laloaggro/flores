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

  // Función para actualizar la cantidad de un producto en el carrito
  const updateQuantity = (id, change) => {
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    );
    saveCartToLocalStorage(updatedCart);
    // Actualizar el DOM (esto sería más fácil con un framework como React)
    document.querySelector('.cart-modal').outerHTML = Cart(updatedCart, savedForLater);
  };

  // Función para eliminar un producto del carrito
  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    saveCartToLocalStorage(updatedCart);
    // Actualizar el DOM
    document.querySelector('.cart-modal').outerHTML = Cart(updatedCart, savedForLater);
  };

  // Función para guardar un producto para más tarde
  const saveForLater = (id) => {
    const itemToSave = cartItems.find(item => item.id === id);
    const updatedCart = cartItems.filter(item => item.id !== id);
    const updatedSavedForLater = [...savedForLater, itemToSave];
    
    saveCartToLocalStorage(updatedCart);
    // Actualizar el DOM
    document.querySelector('.cart-modal').outerHTML = Cart(updatedCart, updatedSavedForLater);
  };

  // Función para mover un producto guardado de vuelta al carrito
  const moveToCart = (id) => {
    const itemToMove = savedForLater.find(item => item.id === id);
    const updatedSavedForLater = savedForLater.filter(item => item.id !== id);
    const updatedCart = [...cartItems, itemToMove];
    
    saveCartToLocalStorage(updatedCart);
    // Actualizar el DOM
    document.querySelector('.cart-modal').outerHTML = Cart(updatedCart, updatedSavedForLater);
  };

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
        <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='/assets/images/products/product_1.jpg'" loading="lazy">
        <div class="cart-item-details">
          <h4 class="cart-item-name">${item.name}</h4>
          <p class="cart-item-price">$${item.price.toLocaleString('es-CL')}</p>
          <div class="cart-item-quantity">
            <button class="quantity-btn decrease-btn" aria-label="Disminuir cantidad" onclick="Cart(cartItems, savedForLater).updateQuantity(${item.id}, -1)">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn increase-btn" aria-label="Aumentar cantidad" onclick="Cart(cartItems, savedForLater).updateQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
        <div class="cart-item-actions">
          <button class="save-for-later-btn" aria-label="Guardar para más tarde" title="Guardar para más tarde" onclick="Cart(cartItems, savedForLater).saveForLater(${item.id})">
            <i class="fas fa-save"></i>
          </button>
          <button class="remove-btn" aria-label="Eliminar producto" title="Eliminar" onclick="Cart(cartItems, savedForLater).removeFromCart(${item.id})">×</button>
        </div>
      </div>
    `;
  }).join('') : '<p class="empty-cart-message">Tu carrito está vacío</p>';
  
  // Generar HTML para items guardados para más tarde
  const savedItemsHTML = savedForLater.length ? savedForLater.map(item => {
    // Validar que el item tenga las propiedades necesarias
    if (!item || !item.id || !item.name || !item.image || 
        typeof item.price !== 'number' || typeof item.quantity !== 'number') {
      console.warn('Cart component: Invalid saved item structure', item);
      return ''; // Omitir items inválidos
    }
    
    return `
      <div class="saved-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="saved-item-image" onerror="this.src='/assets/images/products/product_1.jpg'" loading="lazy">
        <div class="saved-item-details">
          <h4 class="saved-item-name">${item.name}</h4>
          <p class="saved-item-price">$${item.price.toLocaleString('es-CL')}</p>
        </div>
        <div class="saved-item-actions">
          <button class="move-to-cart-btn" aria-label="Mover al carrito" title="Mover al carrito" onclick="Cart(cartItems, savedForLater).moveToCart(${item.id})">
            <i class="fas fa-cart-plus"></i>
          </button>
          <button class="remove-saved-btn" aria-label="Eliminar" title="Eliminar" onclick="Cart(cartItems, [...savedForLater.filter(item => item.id !== ${item.id})])">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('') : '';

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
          ${savedForLater.length ? `
            <div class="saved-for-later">
              <h3>Guardado para más tarde</h3>
              <div class="saved-items">
                ${savedItemsHTML}
              </div>
            </div>
          ` : ''}
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
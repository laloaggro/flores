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

  // Hacer una copia profunda de los items para evitar mutaciones directas
  let cart = [...cartItems];
  let savedItems = [...savedForLater];

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

  // Función para actualizar el carrito y guardarlo en localStorage
  function updateCart() {
    const cartTotal = calculateCartTotal(cart);
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Actualizar el HTML del carrito
    const cartContainer = document.querySelector('.cart-content');
    if (cartContainer) {
      cartContainer.innerHTML = `
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
              ${renderCartItems(cart)}
            </div>
          </div>
          
          <div class="saved-for-later-section">
            <h3>Guardados para más tarde</h3>
            <div class="saved-items">
              ${renderSavedItems(savedItems)}
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
            <button class="btn btn-primary checkout-button" ${cart.length === 0 ? 'disabled' : ''}>
              Proceder al pedido
            </button>
          </div>
        </div>
      `;
      
      // Volver a agregar los event listeners
      addEventListeners();
    }
    
    // Guardar en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('savedForLater', JSON.stringify(savedItems));
    
    // Disparar evento de actualización del carrito
    window.dispatchEvent(new Event('cartUpdated'));
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

  // Función para agregar un item al carrito
  function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({...item, quantity: 1});
    }
    
    updateCart();
  }

  // Función para aumentar la cantidad de un item
  function increaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
      item.quantity += 1;
      updateCart();
    }
  }

  // Función para disminuir la cantidad de un item
  function decreaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
      updateCart();
    }
  }

  // Función para remover un item del carrito
  function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
  }

  // Función para guardar un item para más tarde
  function saveForLater(id) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      const [item] = cart.splice(itemIndex, 1);
      const existingInSaved = savedItems.find(savedItem => savedItem.id === id);
      
      if (!existingInSaved) {
        savedItems.push(item);
      }
      
      updateCart();
    }
  }

  // Función para mover un item guardado al carrito
  function moveToCart(id) {
    const itemIndex = savedItems.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      const [item] = savedItems.splice(itemIndex, 1);
      addToCart(item);
    }
  }

  // Función para limpiar el carrito
  function clearCart() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      cart = [];
      updateCart();
    }
  }

  // Función para mostrar el carrito
  function showCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
      cartModal.style.display = 'block';
      
      // Agregar event listeners si no están ya agregados
      if (!cartModal.dataset.listenersAdded) {
        addEventListeners();
        cartModal.dataset.listenersAdded = 'true';
      }
    }
  }

  // Función para ocultar el carrito
  function hideCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
      cartModal.style.display = 'none';
    }
  }

  // Función para agregar todos los event listeners
  function addEventListeners() {
    // Event listener para botones de aumentar cantidad
    document.querySelectorAll('.quantity-btn.increase').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        increaseQuantity(e.target.closest('.quantity-btn').dataset.id);
      });
    });

    // Event listener para botones de disminuir cantidad
    document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        decreaseQuantity(e.target.closest('.quantity-btn').dataset.id);
      });
    });

    // Event listener para botones de eliminar item
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        removeItem(e.target.closest('.remove-item').dataset.id);
      });
    });

    // Event listener para botones de guardar para más tarde
    document.querySelectorAll('.save-for-later').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        saveForLater(e.target.closest('.save-for-later').dataset.id);
      });
    });

    // Event listener para botones de mover al carrito desde guardados
    document.querySelectorAll('.move-to-cart').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        moveToCart(e.target.closest('.move-to-cart').dataset.id);
      });
    });

    // Event listener para botones de eliminar item guardado
    document.querySelectorAll('.remove-saved-item').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const id = e.target.closest('.remove-saved-item').dataset.id;
        savedItems = savedItems.filter(item => item.id !== id);
        updateCart();
      });
    });

    // Event listener para botón de cerrar carrito
    document.querySelector('.cart-close')?.addEventListener('click', () => {
      hideCart();
    });

    // Event listener para botón de vaciar carrito
    document.querySelector('.clear-cart')?.addEventListener('click', (e) => {
      e.preventDefault();
      clearCart();
    });

    // Event listener para hacer clic fuera del carrito para cerrarlo
    document.getElementById('cartModal')?.addEventListener('click', (e) => {
      if (e.target === document.getElementById('cartModal')) {
        hideCart();
      }
    });
  }

  // Inicializar el carrito
  function initCart() {
    // Verificar si hay carrito guardado en localStorage
    const savedCart = localStorage.getItem('cart');
    const savedLater = localStorage.getItem('savedForLater');
    
    if (savedCart) {
      cart = JSON.parse(savedCart);
    }
    
    if (savedLater) {
      savedItems = JSON.parse(savedLater);
    }
    
    // Actualizar el carrito para mostrar los items guardados
    updateCart();
  }

  // Inicializar el carrito cuando se carga el componente
  initCart();

  // Generar HTML inicial del carrito
  const cartTotal = calculateCartTotal(cart);
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Devolver el HTML inicial
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
              ${renderCartItems(cart)}
            </div>
          </div>
          
          <div class="saved-for-later-section">
            <h3>Guardados para más tarde</h3>
            <div class="saved-items">
              ${renderSavedItems(savedItems)}
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
            <button class="btn btn-primary checkout-button" ${cart.length === 0 ? 'disabled' : ''}>
              Proceder al pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Exportar componente y función
export default Cart;
export { showCart };
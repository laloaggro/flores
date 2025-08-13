import { showNotification, isAuthenticated, formatPrice } from './utils.js';
import CartUtils from './cartUtils.js';
import CartComponent from '../../components/Cart.js';

// Funcionalidad del carrito de compras

// Función para crear e insertar el modal del carrito en el DOM
function createCartModal() {
  // Verificar si el modal ya existe
  const existingModal = document.getElementById('cartModal');
  if (existingModal) {
    return existingModal;
  }
  
  // Crear el modal usando el componente Cart
  const cart = CartUtils.getCart();
  const cartHTML = CartComponent(cart);
  
  // Insertar el modal al final del body
  document.body.insertAdjacentHTML('beforeend', cartHTML);
  
  // Devolver el elemento creado
  return document.getElementById('cartModal');
}

// Función para configurar los event listeners del carrito
function setupCartEventListeners() {
  console.log('Configurando event listeners del carrito');
  const cartIcon = document.querySelector('.cart-icon');
  console.log('Elemento cart-icon encontrado:', cartIcon);
  
  // Mostrar/ocultar carrito - solo si los elementos existen
  if (cartIcon) {
    console.log('Añadiendo event listener al icono del carrito');
    cartIcon.addEventListener('click', function(e) {
      console.log('Icono del carrito clickeado');
      e.preventDefault();
      e.stopPropagation();
      
      const cartModal = createCartModal();
      console.log('Modal del carrito creado/obtenido:', cartModal);
      
      if (cartModal) {
        const cartClose = cartModal.querySelector('.cart-close');
        const checkoutButton = cartModal.querySelector('.checkout-button');
        console.log('Elementos del modal encontrados:', { cartClose, checkoutButton });
        
        // Cargar y mostrar el carrito
        loadCart();
        cartModal.style.display = 'block';
        console.log('Modal del carrito mostrado');
        
        // Configurar el botón de cierre con event listener único
        if (cartClose) {
          console.log('Configurando event listener para botón de cierre');
          // Remover event listeners anteriores para evitar duplicados
          const newCartClose = cartClose.cloneNode(true);
          cartClose.parentNode.replaceChild(newCartClose, cartClose);
          newCartClose.addEventListener('click', function() {
            console.log('Botón de cierre clickeado');
            cartModal.style.display = 'none';
          });
        }
        
        // Configurar botón de checkout
        if (checkoutButton) {
          console.log('Configurando event listener para botón de checkout');
          // Remover event listeners anteriores para evitar duplicados
          const newCheckoutButton = checkoutButton.cloneNode(true);
          checkoutButton.parentNode.replaceChild(newCheckoutButton, checkoutButton);
          newCheckoutButton.addEventListener('click', function() {
            console.log('Botón de checkout clickeado');
            handleCheckout();
          });
        }
        
        // Cerrar al hacer clic fuera del modal
        const closeModalHandler = function(event) {
          console.log('Evento de clic detectado:', event.target);
          if (event.target === cartModal) {
            console.log('Cerrando modal por clic fuera');
            cartModal.style.display = 'none';
            document.removeEventListener('click', closeModalHandler);
          }
        };
        
        // Añadir event listener para cerrar al hacer clic fuera
        console.log('Añadiendo event listener para cerrar al hacer clic fuera');
        document.addEventListener('click', closeModalHandler);
      } else {
        console.error('No se pudo crear/obtener el modal del carrito');
      }
    });
  } else {
    console.warn('No se encontró el elemento cart-icon');
  }
}

// Función para cargar y mostrar el carrito
function loadCart() {
  const cart = CartUtils.getCart();
  renderCart(cart);
}

// Función para renderizar el carrito
function renderCart(cartItemsData) {
  const cartModal = document.getElementById('cartModal');
  if (!cartModal) return;
  
  const cartItems = cartModal.querySelector('.cart-items');
  const totalAmount = cartModal.querySelector('.total-amount');
  const checkoutButton = cartModal.querySelector('.checkout-button');
  
  if (!cartItems || !totalAmount || !checkoutButton) {
    return;
  }
  
  if (cartItemsData.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart-message">Tu carrito está vacío</p>';
    totalAmount.textContent = '$0';
    checkoutButton.disabled = true;
    return;
  }
  
  // Calcular total
  const total = CartUtils.getCartTotal();
  
  // Renderizar items del carrito
  cartItems.innerHTML = cartItemsData.map(item => `
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
      </div>
      <div class="cart-item-actions">
        <button class="remove-btn" data-id="${item.id}" aria-label="Eliminar producto">×</button>
      </div>
    </div>
  `).join('');
  
  // Actualizar total
  totalAmount.textContent = formatPrice(total);
  
  // Habilitar botón de checkout
  checkoutButton.disabled = false;
  
  // Añadir event listeners a los botones con protección contra duplicados
  const addClickListener = (selector, handler) => {
    const elements = cartModal.querySelectorAll(selector);
    elements.forEach(element => {
      // Crear una copia del elemento para eliminar event listeners anteriores
      const newElement = element.cloneNode(true);
      element.parentNode.replaceChild(newElement, element);
      newElement.addEventListener('click', handler);
    });
  };
  
  // Añadir event listeners a los botones
  addClickListener('.increase-btn', function() {
    const id = this.dataset.id;
    updateQuantity(id, 1);
  });
  
  addClickListener('.decrease-btn', function() {
    const id = this.dataset.id;
    updateQuantity(id, -1);
  });
  
  addClickListener('.remove-btn', function() {
    const id = this.dataset.id;
    removeFromCart(id);
  });
}

// Función para actualizar la cantidad de un producto
function updateQuantity(productId, change) {
  let cart = CartUtils.getCart();
  
  const productIndex = cart.findIndex(item => item.id == productId);
  
  if (productIndex !== -1) {
    cart[productIndex].quantity += change;
    
    // Si la cantidad es 0 o menos, eliminar el producto
    if (cart[productIndex].quantity <= 0) {
      cart.splice(productIndex, 1);
    }
    
    // Guardar carrito actualizado
    CartUtils.saveCart(cart);
    
    // Actualizar contador del carrito y volver a renderizar
    updateCartCount();
    renderCart(cart);
  }
}

// Función para eliminar un producto del carrito
function removeFromCart(productId) {
  let cart = CartUtils.getCart();
  cart = cart.filter(item => item.id != productId);
  
  // Guardar carrito actualizado
  CartUtils.saveCart(cart);
  
  // Actualizar contador del carrito y volver a renderizar
  updateCartCount();
  renderCart(cart);
}

// Función para manejar el checkout
function handleCheckout() {
  // Verificar si el usuario está autenticado
  if (!isAuthenticated()) {
    showNotification('Debes iniciar sesión para continuar con el pedido', 'error');
    
    // Redirigir a la página de login/registro
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
    return;
  }
  
  // Redirigir a la página de checkout
  window.location.href = 'checkout.html';
}

// Función para actualizar el contador del carrito
function updateCartCount() {
  try {
    const cart = CartUtils.getCart();
    const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(element => {
      element.textContent = totalCount;
    });
  } catch (error) {
    console.error('Error actualizando el carrito:', error);
  }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
  setupCartEventListeners();
  updateCartCount();
});

// Exportar funciones necesarias
export { updateCartCount };
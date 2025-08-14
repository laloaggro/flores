import { showNotification, updateCartCount, formatPrice } from './utils.js';
import productManager from './productManager.js';
import CartUtils from './cartUtils.js';

// Variables de estado
let currentPage = 1;
const limit = 8;
let currentCategory = '';
let currentSearch = '';
let isLoading = false;
let totalProducts = 0;

// Elementos del DOM
let productGrid = null;
let categoryFilter = null;
let searchFilter = null;
let clearFiltersBtn = null;
let prevPage = null;
let nextPage = null;
let prevPageBottom = null;
let nextPageBottom = null;
let pageInfo = null;
let pageInfoBottom = null;
let resultsCount = null;

// Inicializar la página de productos
document.addEventListener('DOMContentLoaded', async function() {
  // Obtener elementos del DOM
  initializeDOMElements();
  
  // Cargar productos y categorías
  await Promise.all([
    loadProducts(),
    loadCategories()
  ]);
  
  // Configurar event listeners
  setupEventListeners();
  
  // Inicializar el carrito
  initializeCart();
});

// Inicializar elementos del DOM
function initializeDOMElements() {
  productGrid = document.getElementById('productGrid');
  categoryFilter = document.getElementById('categoryFilter');
  searchFilter = document.getElementById('searchFilter');
  clearFiltersBtn = document.getElementById('clearFilters');
  prevPage = document.getElementById('prevPage');
  nextPage = document.getElementById('nextPage');
  prevPageBottom = document.getElementById('prevPageBottom');
  nextPageBottom = document.getElementById('nextPageBottom');
  pageInfo = document.getElementById('pageInfo');
  pageInfoBottom = document.getElementById('pageInfoBottom');
  resultsCount = document.getElementById('resultsCount');
}

// Inicializar el carrito
function initializeCart() {
  const cartIcon = document.querySelector('.cart-icon');
  
  if (cartIcon) {
    cartIcon.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Crear y mostrar el modal del carrito
      createAndShowCartModal();
    });
  }
}

// Crear y mostrar el modal del carrito
function createAndShowCartModal() {
  // Verificar si el modal ya existe
  const existingModal = document.getElementById('cartModal');
  if (existingModal) {
    loadCartContent();
    existingModal.style.display = 'block';
    setupCartModalEvents(existingModal);
    return;
  }
  
  // Importar el componente del carrito
  import('../../components/Cart.js').then(({ default: CartComponent }) => {
    // Crear el modal usando el componente Cart
    const cart = CartUtils.getCart();
    const cartHTML = CartComponent(cart);
    
    // Insertar el modal al final del body
    document.body.insertAdjacentHTML('beforeend', cartHTML);
    
    // Mostrar el modal
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
      loadCartContent();
      cartModal.style.display = 'block';
      setupCartModalEvents(cartModal);
    }
  }).catch(error => {
    console.error('Error al cargar el componente del carrito:', error);
    
    // Fallback: Crear un modal básico si no se puede cargar el componente
    const fallbackCartHTML = `
      <div id="cartModal" class="cart-modal" role="dialog" aria-labelledby="cartTitle" aria-modal="true">
        <div class="cart-content">
          <div class="cart-header">
            <h2 id="cartTitle">Tu Carrito</h2>
            <span class="cart-close" role="button" tabindex="0" aria-label="Cerrar carrito">&times;</span>
          </div>
          <div class="cart-body">
            <div class="cart-items">
              <p class="empty-cart-message">Tu carrito está vacío</p>
            </div>
            <div class="cart-summary">
              <div class="cart-total">
                <span>Total:</span>
                <span class="total-amount">$0</span>
              </div>
              <button class="btn btn-primary checkout-button" disabled aria-disabled="true">Proceder al Pedido</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Insertar el modal al final del body
    document.body.insertAdjacentHTML('beforeend', fallbackCartHTML);
    
    // Mostrar el modal
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
      loadCartContent();
      cartModal.style.display = 'block';
      setupCartModalEvents(cartModal);
    }
  });
}

// Cargar contenido del carrito
function loadCartContent() {
  const cart = CartUtils.getCart();
  renderCartContent(cart);
}

// Renderizar contenido del carrito
function renderCartContent(cartItemsData) {
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
  
  // Añadir event listeners a los botones
  cartModal.querySelectorAll('.increase-btn').forEach(button => {
    button.addEventListener('click', function() {
      const id = this.dataset.id;
      updateCartItemQuantity(id, 1);
    });
  });
  
  cartModal.querySelectorAll('.decrease-btn').forEach(button => {
    button.addEventListener('click', function() {
      const id = this.dataset.id;
      updateCartItemQuantity(id, -1);
    });
  });
  
  cartModal.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', function() {
      const id = this.dataset.id;
      removeCartItem(id);
    });
  });
}

// Configurar eventos del modal del carrito
function setupCartModalEvents(cartModal) {
  const cartClose = cartModal.querySelector('.cart-close');
  const checkoutButton = cartModal.querySelector('.checkout-button');
  
  // Configurar el botón de cierre
  if (cartClose) {
    // Remover event listeners anteriores
    const newCartClose = cartClose.cloneNode(true);
    cartClose.parentNode.replaceChild(newCartClose, cartClose);
    
    newCartClose.addEventListener('click', function() {
      cartModal.style.display = 'none';
    });
  }
  
  // Configurar botón de checkout
  if (checkoutButton) {
    // Remover event listeners anteriores
    const newCheckoutButton = checkoutButton.cloneNode(true);
    checkoutButton.parentNode.replaceChild(newCheckoutButton, checkoutButton);
    
    newCheckoutButton.addEventListener('click', function() {
      handleCheckout();
    });
  }
  
  // Cerrar al hacer clic fuera del modal
  const closeModalHandler = function(event) {
    if (event.target === cartModal) {
      cartModal.style.display = 'none';
      document.removeEventListener('click', closeModalHandler);
    }
  };
  
  // Añadir event listener para cerrar al hacer clic fuera
  document.addEventListener('click', closeModalHandler);
}

// Actualizar cantidad de un item en el carrito
function updateCartItemQuantity(productId, change) {
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
    renderCartContent(cart);
  }
}

// Eliminar item del carrito
function removeCartItem(productId) {
  let cart = CartUtils.getCart();
  cart = cart.filter(item => item.id != productId);
  
  // Guardar carrito actualizado
  CartUtils.saveCart(cart);
  
  // Actualizar contador del carrito y volver a renderizar
  updateCartCount();
  renderCartContent(cart);
}

// Manejar checkout
function handleCheckout() {
  // Importar funciones de autenticación
  import('./utils.js').then(({ isAuthenticated }) => {
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
  });
}

// Adjuntar event listeners
function setupEventListeners() {
  // Filtros
  if (categoryFilter) {
    categoryFilter.addEventListener('change', handleCategoryChange);
  }
  
  if (searchFilter) {
    searchFilter.addEventListener('input', debounce(handleSearch, 300));
  }
  
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', clearFilters);
  }
  
  // Paginación
  if (prevPage) {
    prevPage.addEventListener('click', () => changePage(currentPage - 1));
  }
  
  if (nextPage) {
    nextPage.addEventListener('click', () => changePage(currentPage + 1));
  }
  
  if (prevPageBottom) {
    prevPageBottom.addEventListener('click', () => changePage(currentPage - 1));
  }
  
  if (nextPageBottom) {
    nextPageBottom.addEventListener('click', () => changePage(currentPage + 1));
  }
}

// Función para mostrar/ocultar indicador de carga
function showLoading(show) {
  const loadingElement = document.getElementById('loading');
  if (loadingElement) {
    loadingElement.style.display = show ? 'block' : 'none';
  }
}

// Función para poblar el filtro de categorías
function populateCategoryFilter(categories) {
  if (!categoryFilter) return;
  
  // Limpiar opciones existentes excepto la primera
  categoryFilter.innerHTML = '<option value="">Todas las categorías</option>';
  
  // Agregar categorías
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Función para mostrar productos
function displayProducts(products) {
  if (!productGrid) return;
  
  if (products.length === 0) {
    productGrid.innerHTML = '<p class="no-products">No se encontraron productos.</p>';
    return;
  }
  
  productGrid.innerHTML = products.map(product => `
    <div class="product-card">
      <img 
        src="${product.image_url}" 
        alt="${product.name}"
        onerror="window.handleImageError(this)"
      >
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-footer">
          <span class="product-price">${formatPrice(product.price)}</span>
          <button class="btn btn-secondary add-to-cart" data-product-id="${product.id}">
            <i class="fas fa-shopping-cart"></i> Agregar
          </button>
        </div>
      </div>
    </div>
  `).join('');
  
  // Agregar event listeners a los botones "Agregar al carrito"
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      const productId = parseInt(this.getAttribute('data-product-id'));
      const product = products.find(p => p.id === productId);
      if (product) {
        CartUtils.addToCart(product);
        updateCartCount();
        showNotification(`${product.name} agregado al carrito`, 'success');
      }
    });
  });
}

// Función para cargar productos
async function loadProducts() {
  if (isLoading) return;
  
  isLoading = true;
  showLoading(true);
  
  try {
    const data = await productManager.loadProducts(currentPage, currentCategory, currentSearch, limit);
    
    if (data) {
      displayProducts(data.products);
      updatePagination(data.pagination);
      totalProducts = data.pagination.totalProducts;
      updateResultsCount();
    }
  } catch (error) {
    console.error('Error al cargar productos:', error);
    showNotification('Error al cargar productos. Por favor, inténtalo de nuevo.', 'error');
  } finally {
    isLoading = false;
    showLoading(false);
  }
}

// Función para cargar categorías
async function loadCategories() {
  try {
    const categories = await productManager.getCategories();
    populateCategoryFilter(categories);
  } catch (error) {
    console.error('Error al cargar categorías:', error);
    showNotification('Error al cargar categorías. Por favor, inténtalo de nuevo.', 'error');
  }
}

// Manejar cambio de categoría
function handleCategoryChange() {
  currentCategory = this.value;
  currentPage = 1;
  loadProducts();
}

// Manejar búsqueda con debounce
function handleSearch() {
  currentSearch = this.value;
  currentPage = 1;
  loadProducts();
}

// Función debounce para evitar llamadas frecuentes a la API
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Limpiar filtros
function clearFilters() {
  if (categoryFilter) categoryFilter.value = '';
  if (searchFilter) searchFilter.value = '';
  currentCategory = '';
  currentSearch = '';
  currentPage = 1;
  loadProducts();
}

// Cambiar página
function changePage(page) {
  if (page < 1) return;
  
  currentPage = page;
  loadProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Actualizar información de paginación
function updatePagination(pagination) {
  const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;
  
  // Actualizar botones de paginación
  if (prevPage) prevPage.disabled = !hasPrevPage;
  if (nextPage) nextPage.disabled = !hasNextPage;
  if (prevPageBottom) prevPageBottom.disabled = !hasPrevPage;
  if (nextPageBottom) nextPageBottom.disabled = !hasNextPage;
  
  // Actualizar información de página
  const pageInfoText = `Página ${currentPage} de ${totalPages}`;
  if (pageInfo) pageInfo.textContent = pageInfoText;
  if (pageInfoBottom) pageInfoBottom.textContent = pageInfoText;
}

// Actualizar contador de resultados
function updateResultsCount() {
  if (resultsCount) {
    if (totalProducts === 0) {
      resultsCount.textContent = 'No se encontraron productos';
    } else if (totalProducts === 1) {
      resultsCount.textContent = 'Mostrando 1 producto';
    } else {
      resultsCount.textContent = `Mostrando ${totalProducts} productos`;
    }
  }
}

// Exportar la función handleImageError al ámbito global
window.handleImageError = function(imgElement) {
  console.warn('Error al cargar imagen:', imgElement.src);
  
  // Intentar con una imagen de respaldo verificada
  const fallbackImages = [
    '/assets/images/products/product_2.jpg',
    '/assets/images/products/product_1.jpg',
    '/assets/images/products/product_3.jpg',
    '/assets/images/products/product_4.jpg',
    '/assets/images/products/product_5.jpg'
  ];
  
  // Añadir imágenes de flores como respaldo adicional
  for (let i = 1; i <= 10; i++) {
    fallbackImages.push(`/assets/images/flowers/flower${i}.svg`);
  }
  
  // Filtrar imágenes que no sean las que ya fallaron y que probablemente existan
  const workingFallback = fallbackImages.find(img => {
    // Verificar que no sea la imagen que ya falló
    if (img === imgElement.src) return false;
    
    // Verificar que la imagen tenga una extensión válida
    return img.endsWith('.jpg') || img.endsWith('.svg');
  });
  
  if (workingFallback) {
    imgElement.src = workingFallback;
  } else {
    // Fallback absoluto
    imgElement.src = '/assets/images/default-avatar.svg';
  }
  
  imgElement.alt = 'Imagen no disponible';
  imgElement.onerror = null; // Prevenir bucle infinito si también falla la imagen de marcador de posición
};

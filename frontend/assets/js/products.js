import { showNotification, updateCartCount, formatPrice } from './utils.js';
import productManager from './productManager.js';

// Variables de estado
let currentPage = 1;
const limit = 8;
let currentCategory = '';
let currentSearch = '';
let isLoading = false;

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

// Inicializar la página de productos
document.addEventListener('DOMContentLoaded', async function() {
  // Obtener elementos del DOM
  initializeDOMElements();
  
  // Cargar productos y categorías
  await Promise.all([
    loadProducts(),
    loadCategories()
  ]);
  
  // Adjuntar event listeners
  attachEventListeners();
});

// Inicializar elementos del DOM
function initializeDOMElements() {
  productGrid = document.getElementById('productGrid');
  categoryFilter = document.getElementById('categoryFilter');
  searchFilter = document.getElementById('searchFilter');
  clearFiltersBtn = document.getElementById('clearFilters');
  // Usar selectores más generales y verificar elementos por clase
  prevPage = document.querySelector('.prev-page');
  nextPage = document.querySelector('.next-page');
  prevPageBottom = document.querySelector('.prev-page.bottom');
  nextPageBottom = document.querySelector('.next-page.bottom');
  // Buscar primero por clase específica, si no existe, buscar por clase genérica
  pageInfo = document.querySelector('.page-info.top') || document.querySelector('.page-info');
  pageInfoBottom = document.querySelector('.page-info.bottom');
}

// Adjuntar event listeners
function attachEventListeners() {
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

// Función para cargar productos
async function loadProducts() {
  if (isLoading) return;
  
  isLoading = true;
  showLoading();
  
  try {
    const data = await productManager.loadProducts(currentPage, limit, currentCategory, currentSearch);
    
    if (data) {
      renderProducts(data.products);
      updatePagination(data.pagination); // Pasar el objeto pagination completo
    }
  } catch (error) {
    console.error('Error al cargar productos:', error);
    showError('Error al cargar productos. Por favor, inténtelo más tarde.');
  } finally {
    isLoading = false;
  }
}

// Función para cargar categorías
async function loadCategories() {
  try {
    const categories = await productManager.getCategories();
    
    // Limpiar opciones existentes excepto la primera
    while (categoryFilter.options.length > 1) {
      categoryFilter.remove(1);
    }
    
    // Agregar categorías al select
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar categorías:', error);
  }
}

// Función para mostrar mensaje de carga
function showLoading() {
  if (productGrid) {
    productGrid.innerHTML = '<div class="loading-message">Cargando productos...</div>';
  }
}

// Función para mostrar mensaje de error
function showError(message) {
  if (productGrid) {
    productGrid.innerHTML = `<div class="error-message">${message}</div>`;
  }
}

// Función para renderizar productos
async function renderProducts(products) {
  try {
    if (!products || products.length === 0) {
      if (productGrid) {
        productGrid.innerHTML = '<div class="no-products-message">No hay productos disponibles en este momento.</div>';
      }
      return;
    }
    
    // Generar HTML de productos
    const productsHTML = products.map(product => `
      <div class="product-card">
        <div class="product-image">
          <img src="${product.image_url}" alt="${product.name}" loading="lazy" onerror="this.src='/assets/images/products/product_1.jpg'">
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-details">
            <span class="detail-item"><i class="fas fa-tag"></i> ${product.category}</span>
            <span class="detail-item"><i class="fas fa-calendar-alt"></i> ${new Date(product.created_at).toLocaleDateString('es-CL')}</span>
          </div>
          <span class="price">$${parseInt(product.price).toLocaleString('es-CL')}</span>
          <button class="btn btn-secondary add-to-cart" 
                  data-id="${product.id}" 
                  data-name="${product.name}" 
                  data-price="${product.price}"
                  data-image="${product.image_url}">
            <i class="fas fa-shopping-cart"></i> Agregar
          </button>
        </div>
      </div>
    `).join('');
    
    if (productGrid) {
      productGrid.innerHTML = productsHTML;
    }
    
    // Adjuntar event listeners a los botones "Agregar al carrito"
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', function() {
        const product = {
          id: this.dataset.id,
          name: this.dataset.name,
          price: parseFloat(this.dataset.price),
          image: this.dataset.image,
          quantity: 1
        };
        
        addToCart(product);
      });
    });
  } catch (error) {
    console.error('Error al cargar productos:', error);
    if (productGrid) {
      productGrid.innerHTML = '<div class="error-message">Error al cargar productos. Por favor, inténtelo más tarde.</div>';
    }
  }
}

// Función para actualizar la paginación
function updatePagination(pagination) {
  // Verificar que se haya pasado el objeto de paginación
  if (!pagination) {
    console.error('No se proporcionó el objeto de paginación');
    return;
  }
  
  // Actualizar información de página
  const pageInfoText = `Página ${pagination.currentPage} de ${pagination.totalPages}`;
  if (pageInfo) pageInfo.textContent = pageInfoText;
  if (pageInfoBottom) pageInfoBottom.textContent = pageInfoText;
  
  // Actualizar estado de botones
  if (prevPage) prevPage.disabled = !pagination.hasPrevPage;
  if (nextPage) nextPage.disabled = !pagination.hasNextPage;
  if (prevPageBottom) prevPageBottom.disabled = !pagination.hasPrevPage;
  if (nextPageBottom) nextPageBottom.disabled = !pagination.hasNextPage;
}

// Función para cambiar de página
function changePage(page) {
  if (page < 1) return;
  currentPage = page;
  loadProducts();
}

// Función para manejar el cambio de categoría
function handleCategoryChange() {
  currentCategory = categoryFilter.value;
  currentPage = 1;
  loadProducts();
}

// Función para manejar la búsqueda
function handleSearch() {
  currentSearch = searchFilter.value;
  currentPage = 1;
  loadProducts();
}

// Función para limpiar filtros
function clearFilters() {
  if (categoryFilter) categoryFilter.value = '';
  if (searchFilter) searchFilter.value = '';
  currentCategory = '';
  currentSearch = '';
  currentPage = 1;
  loadProducts();
}

// Función para agregar al carrito
function addToCart(product) {
  // Usar una clave constante para el carrito y verificar si existe
  const CART_KEY = 'arreglosVictoriaCart';
  
  // Obtener carrito actual del localStorage
  let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  
  // Verificar si el producto ya está en el carrito
  const existingProductIndex = cart.findIndex(item => item.id == product.id);
  
  if (existingProductIndex !== -1) {
    // Si el producto ya existe, aumentar la cantidad
    cart[existingProductIndex].quantity += 1;
  } else {
    // Si es un producto nuevo, agregarlo al carrito
    cart.push(product);
  }
  
  // Guardar carrito actualizado en localStorage
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  
  // Mostrar notificación
  alert(`Producto agregado al carrito: ${product.name}`);
  
  // Actualizar contador del carrito si existe la función
  if (typeof updateCartCount === 'function') {
    updateCartCount();
  }
}

// Función de debounce para la búsqueda
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
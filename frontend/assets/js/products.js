import { showNotification, updateCartCount, formatPrice } from './utils.js';
import productManager, { handleImageError } from './productManager.js';
import CartUtils from './cartUtils.js';

// Variables de estado
let currentPage = 1;
const limit = 8;
let currentCategory = '';
let currentSearch = '';
let isLoading = false;
let totalProducts = 0;
let searchTimeout = null;

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
  
  // Adjuntar event listeners
  attachEventListeners();
  
  // Inicializar event listeners del carrito
  productManager.initCartEventListeners();
  
  // Actualizar contador del carrito
  updateCartCount();
  
  // Vincular la función handleImageError al ámbito global con imagen SVG por defecto
  window.handleImageError = function (img) {
    img.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\' viewBox=\'0 0 600 400\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23eee\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' fill=\'%23aaa\' font-size=\'30\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3ENo Image%3C/text%3E%3C/svg%3E';
  };
});

// Inicializar elementos del DOM
function initializeDOMElements() {
  productGrid = document.getElementById('productsContainer');
  categoryFilter = document.getElementById('categoryFilter');
  searchFilter = document.getElementById('searchFilter');
  clearFiltersBtn = document.getElementById('clearFilters');
  prevPage = document.querySelector('.prev-page');
  nextPage = document.querySelector('.next-page');
  prevPageBottom = document.querySelector('.prev-page-bottom');
  nextPageBottom = document.querySelector('.next-page-bottom');
  pageInfo = document.querySelector('.page-info.top');
  pageInfoBottom = document.querySelector('.page-info.bottom');
  resultsCount = document.getElementById('resultsCount');
}

// Adjuntar event listeners
function attachEventListeners() {
  // Filtros
  if (categoryFilter) {
    categoryFilter.addEventListener('change', handleCategoryChange);
  }
  
  if (searchFilter) {
    searchFilter.addEventListener('input', handleSearch);
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
      totalProducts = data.pagination.totalProducts;
      renderProducts(data.products);
      updatePagination(data.pagination);
      updateResultsCount();
    }
  } catch (error) {
    console.error('Error al cargar productos:', error);
    showError('Error al cargar productos. Por favor, intente nuevamente.');
  } finally {
    isLoading = false;
    hideLoading();
  }
}

// Función para mostrar mensaje de carga
function showLoading() {
  const loadingElement = document.getElementById('loadingIndicator');
  if (loadingElement) {
    loadingElement.style.display = 'block';
  }
}

// Función para ocultar mensaje de carga
function hideLoading() {
  const loadingElement = document.getElementById('loadingIndicator');
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
}

// Función para mostrar mensaje de error
function showError(message) {
  const errorElement = document.getElementById('errorContainer');
  if (errorElement) {
    errorElement.style.display = 'block';
    errorElement.innerHTML = `<p><i class="fas fa-exclamation-triangle"></i> ${message}</p>`;
  }
  
  if (productGrid) {
    productGrid.innerHTML = '';
  }
}

// Función para ocultar mensaje de error
function hideError() {
  const errorElement = document.getElementById('errorContainer');
  if (errorElement) {
    errorElement.style.display = 'none';
  }
}

// Función para renderizar productos
async function renderProducts(products) {
  try {
    hideError();
    
    if (!products || products.length === 0) {
      if (productGrid) {
        productGrid.innerHTML = '<div class="no-products-message"><p>No hay productos disponibles en este momento.</p></div>';
      }
      return;
    }
    
    // Generar HTML de productos
    const productsHTML = products.map(product => `
      <div class="product-card">
        <div class="product-image">
          <img src="${product.image_url || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\' viewBox=\'0 0 600 400\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23eee\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' fill=\'%23aaa\' font-size=\'30\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3ENo Image%3C/text%3E%3C/svg%3E'}" alt="${product.name}" loading="lazy" onerror="handleImageError(this)">
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
          <div class="product-card-notification" id="notification-${product.id}" style="display: none; margin-top: 10px; padding: 5px; background-color: #48bb78; color: white; border-radius: 4px; font-size: 0.8rem;">
            ¡Agregado al carrito!
          </div>
        </div>
      </div>
    `).join('');
    
    if (productGrid) {
      productGrid.innerHTML = productsHTML;
    }
  } catch (error) {
    console.error('Error al renderizar productos:', error);
    showError('Error al cargar productos. Por favor, intente nuevamente.');
  }
}

// Función para cargar categorías
async function loadCategories() {
  try {
    const data = await productManager.loadCategories();
    const categories = data.categories;
    
    if (categories && categoryFilter) {
      // Limpiar el filtro antes de cargar nuevas categorías
      categoryFilter.innerHTML = '<option value="">Todas las categorías</option>';
      
      // Agregar las categorías ordenadas
      categories.sort().forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error al cargar categorías:', error);
    showError('Error al cargar categorías. Por favor, intente nuevamente.');
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
  // Clear the previous timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  // Set a new timeout
  searchTimeout = setTimeout(() => {
    currentSearch = this.value;
    currentPage = 1;
    loadProducts();
  }, 300); // 300ms delay
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
      resultsCount.textContent = `Mostrando ${Math.min(limit, totalProducts)} de ${totalProducts} productos`;
    }
  }
}
import { showNotification, updateCartCount, formatPrice } from './utils.js';
import productManager from './productManager.js';

document.addEventListener('DOMContentLoaded', function() {
  // Variables para la paginación y filtrado
  let currentPage = 1;
  const limit = 12;
  let currentCategory = '';
  let currentSearch = '';
  let isLoading = false;
  
  // Elementos del DOM
  const productGrid = document.getElementById('productGrid');
  const categoryFilter = document.getElementById('categoryFilter');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const prevPage = document.getElementById('prevPage');
  const nextPage = document.getElementById('nextPage');
  const prevPageBottom = document.getElementById('prevPageBottom');
  const nextPageBottom = document.getElementById('nextPageBottom');
  const pageInfo = document.getElementById('pageInfo');
  const pageInfoBottom = document.getElementById('pageInfoBottom');
  
  // Cargar productos iniciales
  loadProducts();
  
  // Cargar categorías en el filtro
  loadCategories();
  
  // Event listeners
  categoryFilter.addEventListener('change', function() {
    currentCategory = this.value;
    currentPage = 1;
    loadProducts();
  });
  
  searchButton.addEventListener('click', function() {
    currentSearch = searchInput.value;
    currentPage = 1;
    loadProducts();
  });
  
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      currentSearch = searchInput.value;
      currentPage = 1;
      loadProducts();
    }
  });
  
  prevPage.addEventListener('click', function() {
    if (currentPage > 1) {
      currentPage--;
      loadProducts();
    }
  });
  
  nextPage.addEventListener('click', function() {
    currentPage++;
    loadProducts();
  });
  
  prevPageBottom.addEventListener('click', function() {
    if (currentPage > 1) {
      currentPage--;
      loadProducts();
    }
  });
  
  nextPageBottom.addEventListener('click', function() {
    currentPage++;
    loadProducts();
  });

  // Función para cargar productos
  async function loadProducts() {
    if (isLoading) return;
    
    isLoading = true;
    showLoading();
    
    try {
      const data = await productManager.loadProducts(currentPage, limit, currentCategory, currentSearch);
      
      if (data) {
        renderProducts(data.products);
        updatePagination(data.pagination); // Actualizar paginación con el objeto de paginación recibido
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
      const data = await productManager.getCategories();
      const categories = data; // getCategories ya devuelve el array directamente
      
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
      productGrid.innerHTML = '<div class="loading">Cargando productos...</div>';
    }
  }
  
  // Función para mostrar error
  function showError(message) {
    if (productGrid) {
      productGrid.innerHTML = `<div class="error-message">${message}</div>`;
    }
  }
  
  // Función para renderizar productos
  function renderProducts(products) {
    try {
      if (products.length === 0) {
        productGrid.innerHTML = '<div class="no-products">No se encontraron productos.</div>';
        return;
      }
      
      productGrid.innerHTML = products.map(product => `
        <div class="product-card">
          <div class="product-image">
            <img src="${product.image_url}" alt="${product.name}" loading="lazy">
          </div>
          <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">${formatPrice(product.price)}</p>
            <button class="btn add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image_url}">
              <i class="fas fa-shopping-cart"></i> Agregar al carrito
            </button>
          </div>
        </div>
      `).join('');
      
      // Agregar event listeners a los botones "Agregar al carrito"
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
      
      // Actualizar paginación (sin parámetros ya que se maneja en loadProducts)
    } catch (error) {
      console.error('Error al cargar productos:', error);
      productGrid.innerHTML = '<div class="error-message">Error al cargar productos. Por favor, inténtelo más tarde.</div>';
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
  
  // Función para agregar productos al carrito
  function addToCart(product) {
    // Obtener carrito actual del localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
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
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Actualizar contador del carrito
    updateCartCount();
    
    // Mostrar notificación
    showNotification(`${product.name} agregado al carrito`, 'success');
  }
  
  // Inicializar contador del carrito
  updateCartCount();
});
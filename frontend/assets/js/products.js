import { showNotification, updateCartCount, formatPrice } from './utils.js';

document.addEventListener('DOMContentLoaded', function() {
  // Variables para la paginación y filtrado
  let currentPage = 1;
  const limit = 12;
  let currentCategory = '';
  let currentSearch = '';
  
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
  function loadProducts() {
    // Mostrar mensaje de carga
    productGrid.innerHTML = '<div class="loading">Cargando productos...</div>';
    
    // Construir URL de la API
    let url = `/api/products?page=${currentPage}&limit=${limit}`;
    
    if (currentCategory) {
      url = `/api/products/category/${currentCategory}?page=${currentPage}&limit=${limit}`;
    } else if (currentSearch) {
      url = `/api/products/search/${currentSearch}?page=${currentPage}&limit=${limit}`;
    }
    
    // Realizar solicitud a la API
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Renderizar productos
        renderProducts(data.products);
        
        // Actualizar información de paginación
        updatePagination(data.pagination);
      })
      .catch(error => {
        console.error('Error al cargar productos:', error);
        productGrid.innerHTML = '<div class="error">Error al cargar productos. Por favor, intente nuevamente.</div>';
      });
  }
  
  // Función para renderizar productos
  function renderProducts(products) {
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
  }
  
  // Función para actualizar la paginación
  function updatePagination(pagination) {
    // Actualizar información de página
    pageInfo.textContent = `Página ${pagination.currentPage} de ${pagination.totalPages}`;
    pageInfoBottom.textContent = `Página ${pagination.currentPage} de ${pagination.totalPages}`;
    
    // Actualizar estado de botones
    prevPage.disabled = !pagination.hasPrevPage;
    nextPage.disabled = !pagination.hasNextPage;
    prevPageBottom.disabled = !pagination.hasPrevPage;
    nextPageBottom.disabled = !pagination.hasNextPage;
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
  
  // Función para actualizar el contador del carrito
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(element => {
      element.textContent = totalCount;
    });
  }
  
  // Función para mostrar notificaciones
  function showNotification(message, type) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Agregar notificación al cuerpo
    document.body.appendChild(notification);
    
    // Eliminar notificación después de 3 segundos
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
  
  // Actualizar contador del carrito al cargar la página
  updateCartCount();
});
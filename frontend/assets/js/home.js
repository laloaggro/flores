import { updateCartCount, showNotification, API_BASE_URL } from './utils.js';
import productManager from './productManager.js';
import CartUtils from './cartUtils.js';
import { initUserMenu } from './auth.js';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
  console.log('DOM cargado en home.js');
  
  // Initialize cart utilities
  CartUtils.init();
  
  // Initialize user menu
  try {
    initUserMenu();
    console.log('Menú de usuario inicializado en home.js');
  } catch (error) {
    console.error('Error al inicializar el menú de usuario en home.js:', error);
  }
  
  // Initialize event listeners for adding products to cart
  productManager.initCartEventListeners();
  
  // Update cart count
  updateCartCount();
  
  // Load featured products
  await loadFeaturedProducts();
});

// Load featured products for the home page
async function loadFeaturedProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products?limit=4`);
    if (!response.ok) {
      throw new Error('Failed to load products');
    }
    
    const data = await response.json();
    const products = data.products || data;
    
    const featuredProductsContainer = document.getElementById('featuredProducts');
    
    if (products && products.length > 0) {
      featuredProductsContainer.innerHTML = products.map(product => 
        `<div class="product-card">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/300x300?text=Imagen+no+disponible'">
            <button class="add-to-cart" data-product-id="${product.id}">
              <i class="fas fa-shopping-cart"></i> Agregar al carrito
            </button>
          </div>
          <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">$${product.price.toLocaleString()}</div>
          </div>
        </div>`
      ).join('');
    } else {
      featuredProductsContainer.innerHTML = '<p class="no-products">No hay productos destacados disponibles.</p>';
    }
  } catch (error) {
    console.error('Error loading featured products:', error);
    showNotification('Error al cargar productos destacados', 'error');
  }
}
import { updateCartCount, showNotification } from './utils.js';
import productManager from './productManager.js';
import CartUtils from './cartUtils.js';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
  // Initialize cart utilities
  CartUtils.init();
  
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
    const response = await fetch('/api/products?limit=4');
    if (!response.ok) {
      throw new Error('Failed to load products');
    }
    
    const data = await response.json();
    const products = data.products || data;
    
    const featuredProductsContainer = document.getElementById('featuredProducts');
    if (featuredProductsContainer) {
      // Generate HTML for featured products
      let productsHTML = '';
      products.forEach(product => {
        productsHTML += `
          <div class="product-card">
            <div class="product-image">
              <img src="${product.image_url || '/assets/images/default-avatar.svg'}" 
                   alt="${product.name}" 
                   loading="lazy"
                   onerror="this.src='/assets/images/default-avatar.svg'">
            </div>
            <div class="product-info">
              <h3>${product.name}</h3>
              <p>${product.description}</p>
              <span class="price">$${parseInt(product.price).toLocaleString('es-CL')}</span>
              <button class="btn btn-secondary add-to-cart" 
                      data-id="${product.id}" 
                      data-name="${product.name}" 
                      data-price="${product.price}"
                      data-image="${product.image_url || '/assets/images/default-avatar.svg'}">
                <i class="fas fa-shopping-cart"></i> Agregar
              </button>
              <div class="product-card-notification" id="notification-${product.id}" style="display: none;">
                ¡Agregado al carrito!
              </div>
            </div>
          </div>
        `;
      });
      
      featuredProductsContainer.innerHTML = productsHTML;
    }
  } catch (error) {
    console.error('Error loading featured products:', error);
  }
}
// home.js - Funcionalidad de la página de inicio
import { updateCartCount, showNotification, API_BASE_URL } from './utils.js';
import { loadFeaturedProducts, initCartEventListeners } from './homeProducts.js';
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
    initCartEventListeners();
    
    // Update cart count
    updateCartCount();
    
    // Load featured products
    await loadFeaturedProducts();
});

// Exportar funciones para uso en otros módulos
export { loadFeaturedProducts, initCartEventListeners };
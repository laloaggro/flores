/**
 * Punto de entrada principal para la aplicación Arreglos Victoria Florería
 * 
 * Este archivo importa e inicializa todos los componentes y funcionalidades
 * necesarios para el funcionamiento del sitio web.
 */

// Importar utilidades
import { initializeTheme } from './components/utils/theme.js';
import { initializeLazyLoading } from './components/utils/lazyLoad.js';
import { initializeUserMenu } from './components/utils/userMenu.js';
import { initializeAuth } from './components/utils/auth.js';
import { formatPrice, debounce } from './components/utils/utils.js';

// Importar componentes de página
import { initializeContactForm } from './components/pages/contact.js';
import { initializeForgotPassword } from './components/pages/forgot-password.js';
import { initializeHomeProducts } from './components/pages/homeProducts.js';

// Importar componentes del carrito
import { initializeCart } from './components/cart/cart.js';
import { initializeCheckout } from './components/cart/checkout.js';

// Importar componentes del usuario
import { initializeProfile } from './components/pages/profile.js';
import { initializeOrders } from './components/pages/orders.js';
import { initializeWishlist } from './components/pages/wishlist.js';

// Importar componentes de administración
import { initializeAdmin } from './components/pages/admin.js';
import { initializeAdminOrders } from './components/pages/admin-orders.js';

// Inicializar todas las funcionalidades cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar utilidades
  initializeTheme();
  initializeLazyLoading();
  initializeUserMenu();
  initializeAuth();
  
  // Inicializar componentes de página
  initializeContactForm();
  initializeForgotPassword();
  initializeHomeProducts();
  
  // Inicializar componentes del carrito
  initializeCart();
  initializeCheckout();
  
  // Inicializar componentes del usuario
  initializeProfile();
  initializeOrders();
  initializeWishlist();
  
  // Inicializar componentes de administración
  initializeAdmin();
  initializeAdminOrders();
  
  console.log('✅ Todos los componentes han sido inicializados');
});

// Exportar funciones y utilidades que puedan ser necesarias globalmente
export {
  formatPrice,
  debounce
};
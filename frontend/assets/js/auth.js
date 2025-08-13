import { isAuthenticated, logout, isAdmin } from './utils.js';
import { updateCartCount } from './cart.js';

// Función para inicializar el menú de usuario
function initUserMenu() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userMenu = document.getElementById('userMenu');
  const loginLink = document.getElementById('loginLink');
  const userNameElement = document.getElementById('userName');
  const logoutLink = document.getElementById('logoutLink');
  const userInfo = document.querySelector('.user-info');
  const userDropdown = document.querySelector('.user-dropdown');
  
  if (isAuthenticated() && user && userMenu && loginLink) {
    // Mostrar el menú de usuario
    userMenu.classList.add('visible');
    userMenu.style.display = 'block';
    loginLink.style.display = 'none';
    
    // Mostrar el nombre del usuario
    if (userNameElement) {
      // Usar textContent para prevenir XSS
      userNameElement.textContent = user.name || 'Usuario';
    }
    
    // Mostrar enlace de administración si el usuario es administrador
    const adminLink = document.getElementById('adminLink');
    if (adminLink) {
      adminLink.style.display = isAdmin() ? 'block' : 'none';
    }
    
    // Configurar el cierre de sesión
    if (logoutLink) {
      logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
        window.location.reload();
      });
    }
    
    // Configurar el toggle del dropdown
    if (userInfo && userDropdown) {
      userInfo.addEventListener('click', function() {
        userDropdown.classList.toggle('show');
      });
      
      // Cerrar el dropdown al hacer clic fuera
      document.addEventListener('click', function(e) {
        if (!userInfo.contains(e.target)) {
          userDropdown.classList.remove('show');
        }
      });
    }
  } else if (loginLink) {
    // Asegurarse de que el enlace de login sea visible
    loginLink.style.display = 'block';
  }
}

// Función para verificar si el usuario está autenticado y redirigir si no lo está
function requireAuth(redirectUrl = '/login.html') {
  if (!isAuthenticated()) {
    window.location.href = redirectUrl;
    return false;
  }
  return true;
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
  initUserMenu();
  updateCartCount();
  
  // Aplicar protección a páginas que requieren autenticación
  if (window.location.pathname.includes('profile.html')) {
    requireAuth();
  }
});

// Exportar funciones
export { initUserMenu, requireAuth };
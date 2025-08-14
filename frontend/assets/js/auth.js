import { updateCartCount, getUser, isAuthenticated, logout } from './utils.js';

// Función para inicializar el menú de usuario
function initUserMenu() {
  const user = getUser();
  const userMenu = document.getElementById('userMenu');
  const loginLink = document.getElementById('loginLink');
  const userNameElement = document.getElementById('userName');
  const logoutLink = document.getElementById('logoutLink');
  
  if (isAuthenticated() && user && userMenu && loginLink) {
    // Mostrar el menú de usuario
    userMenu.style.display = 'block';
    loginLink.style.display = 'none';
    
    // Mostrar el nombre del usuario
    if (userNameElement) {
      userNameElement.textContent = user.name || 'Usuario';
    }
    
    // Configurar el cierre de sesión
    if (logoutLink) {
      logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        handleLogout();
      });
    }
  } else if (userMenu && loginLink) {
    // Ocultar el menú de usuario y mostrar el enlace de inicio de sesión
    userMenu.style.display = 'none';
    loginLink.style.display = 'block';
  }
}

// Función para manejar el cierre de sesión
function handleLogout() {
  logout();
  window.location.href = '/index.html';
}

// Función para verificar la autenticación del usuario
function checkAuth() {
  if (!isAuthenticated()) {
    // Redirigir al login si no está autenticado en páginas que lo requieren
    const protectedPages = ['profile.html'];

    if (protectedPages.some(page => window.location.pathname.includes(page))) {
      window.location.href = '/login.html';
    }
  }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function () {
  initUserMenu();
  checkAuth();
  updateCartCount();
});

// Exportar funciones
export { initUserMenu, handleLogout, checkAuth };
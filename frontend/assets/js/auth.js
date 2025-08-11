import { getUser, isAuthenticated, logout } from './utils.js';
import { updateCartCount } from './cart.js';

// Función para inicializar el menú de usuario
function initUserMenu() {
  console.log('Inicializando menú de usuario');
  const user = getUser();
  console.log('Usuario obtenido:', user);
  const userMenu = document.getElementById('userMenu');
  const loginLink = document.getElementById('loginLink');
  const userNameElement = document.getElementById('userName');
  const logoutLink = document.getElementById('logoutLink');
  const userInfo = document.querySelector('.user-info');
  const userDropdown = document.querySelector('.user-dropdown');
  
  console.log('Elementos del DOM:', { userMenu, loginLink, userNameElement, logoutLink, userInfo, userDropdown });
  
  if (isAuthenticated() && user && userMenu && loginLink) {
    console.log('Usuario autenticado, actualizando menú');
    // Mostrar el menú de usuario
    userMenu.classList.add('visible');
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
    
    // Configurar el dropdown del menú de usuario
    if (userInfo && userDropdown) {
      // Eliminar event listeners anteriores si existen
      userInfo.removeEventListener('click', toggleUserDropdown);
      userInfo.addEventListener('click', toggleUserDropdown);
      
      // Cerrar el dropdown cuando se hace clic fuera de él
      document.removeEventListener('click', closeUserDropdown);
      document.addEventListener('click', closeUserDropdown);
    }
  } else if (userMenu && loginLink) {
    console.log('Usuario no autenticado, mostrando enlace de login');
    // Ocultar el menú de usuario y mostrar el enlace de inicio de sesión
    userMenu.classList.remove('visible');
    userMenu.style.display = 'none';
    loginLink.style.display = 'block';
    
    // Asegurarse de que el dropdown esté oculto
    if (userDropdown) {
      userDropdown.classList.remove('show');
    }
  }
}

// Función para alternar el dropdown del menú de usuario
function toggleUserDropdown(e) {
  e.stopPropagation();
  const userDropdown = document.querySelector('.user-dropdown');
  if (userDropdown) {
    userDropdown.classList.toggle('show');
  }
}

// Función para cerrar el dropdown del menú de usuario
function closeUserDropdown(e) {
  const userDropdown = document.querySelector('.user-dropdown');
  const userInfo = document.querySelector('.user-info');
  
  if (userDropdown && userInfo && !userInfo.contains(e.target)) {
    userDropdown.classList.remove('show');
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
    if (window.location.pathname.includes('profile.html')) {
      window.location.href = '/login.html';
    }
  }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
  initUserMenu();
  checkAuth();
  updateCartCount();
});

// También ejecutar initUserMenu inmediatamente si el DOM ya está cargado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUserMenu);
} else {
  // DOM ya está cargado
  initUserMenu();
}

// Exportar funciones
export { initUserMenu, handleLogout, checkAuth, getUser, isAuthenticated };
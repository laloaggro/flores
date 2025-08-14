import { updateCartCount, getUser, isAuthenticated, logout, isAdmin } from './utils.js';

// Función para inicializar el menú de usuario
function initUserMenu() {
  const user = getUser();
  const userMenu = document.getElementById('userMenu');
  const loginLink = document.getElementById('loginLink');
  const userNameElement = document.getElementById('userName');
  const logoutLink = document.getElementById('logoutLink');
  const userInfo = document.querySelector('.user-info');
  const userDropdown = document.querySelector('.user-dropdown');
  
  if (isAuthenticated() && user && userMenu && loginLink) {
    // Mostrar el menú de usuario
    userMenu.style.display = 'block';
    loginLink.style.display = 'none';
    
    // Mostrar el nombre del usuario
    if (userNameElement) {
      userNameElement.textContent = user.name || 'Usuario';
    }
    
    // Agregar enlace al panel de administración si el usuario es administrador
    if (isAdmin()) {
      addAdminLinkToMenu();
    }
    
    // Configurar el cierre de sesión
    if (logoutLink) {
      logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        handleLogout();
      });
    }
    
    // Configurar el toggle del dropdown con clic
    if (userInfo && userDropdown) {
      // Prevenir que el clic en el botón cierre el dropdown inmediatamente
      userInfo.addEventListener('click', function(e) {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
      });
      
      // Cerrar el dropdown cuando se hace clic fuera de él
      document.addEventListener('click', function(e) {
        if (userDropdown.classList.contains('show')) {
          userDropdown.classList.remove('show');
        }
      });
      
      // Prevenir que el clic en el dropdown lo cierre cuando se está usando
      userDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }
  } else if (userMenu && loginLink) {
    // Ocultar el menú de usuario y mostrar el enlace de inicio de sesión
    userMenu.style.display = 'none';
    loginLink.style.display = 'block';
    
    // Asegurarse de que el dropdown esté oculto
    if (userDropdown) {
      userDropdown.classList.remove('show');
    }
  }
}

// Función para agregar enlace al panel de administración en el menú
function addAdminLinkToMenu() {
  const userDropdown = document.querySelector('.user-dropdown');
  if (userDropdown) {
    // Verificar si el enlace ya existe
    const existingAdminLink = document.querySelector('.admin-link');
    if (!existingAdminLink) {
      // Crear enlace al panel de administración
      const adminLink = document.createElement('a');
      adminLink.href = 'pages/admin.html';
      adminLink.className = 'admin-link';
      adminLink.innerHTML = '<i class="fas fa-cog"></i> Panel de Administración';
      
      // Insertar el enlace antes del enlace de cierre de sesión
      const logoutLink = document.getElementById('logoutLink');
      userDropdown.insertBefore(adminLink, logoutLink);
    }
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
export { initUserMenu, handleLogout, checkAuth };
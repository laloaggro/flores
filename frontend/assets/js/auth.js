import { updateCartCount, getUser, isAuthenticated, logout, isAdmin, API_BASE_URL } from './utils.js';

// Función para inicializar el menú de usuario
function initUserMenu() {
  // Forzar limpieza adicional
  if (!isAuthenticated()) {
    localStorage.removeItem('user');
  }
  
  const user = getUser();
  const userMenu = document.getElementById('userMenu');
  const loginLink = document.getElementById('loginLink');
  const userNameElement = document.getElementById('userNameDisplay');
  const logoutLink = document.getElementById('logoutLink');
  const userDropdown = document.querySelector('.user-dropdown');
  const userMenuButton = document.querySelector('.user-info');
  const caretIcon = userMenuButton ? userMenuButton.querySelector('.fas.fa-caret-down') : null;
  
  // Si no existen los elementos necesarios, salir de la función
  if (!userMenu && !loginLink) {
    return;
  }
  
  // Limpiar cualquier contenido previo
  if (userNameElement) {
    userNameElement.textContent = '';
  }
  
  // Verificar autenticación y mostrar elementos apropiados
  if (isAuthenticated() && user) {
    // Usuario autenticado - mostrar menú de usuario y ocultar login
    if (userMenu) {
      userMenu.style.display = 'block';
    }
    if (loginLink) {
      loginLink.style.display = 'none';
    }
    
    // Añadir atributos de accesibilidad al menú de usuario
    if (userMenuButton) {
      userMenuButton.setAttribute('aria-expanded', 'false');
      userMenuButton.setAttribute('aria-haspopup', 'true');
      userMenuButton.setAttribute('role', 'button');
      userMenuButton.setAttribute('tabindex', '0');
    }
    
    // Mostrar el nombre del usuario
    if (userNameElement) {
      userNameElement.textContent = user.name || 'Usuario';
    }
    
    // Mostrar el ícono del menú desplegable
    if (caretIcon) {
      caretIcon.style.display = 'inline';
      caretIcon.setAttribute('aria-hidden', 'true');
    }
    
    // Agregar enlace al panel de administración si el usuario es administrador
    if (isAdmin()) {
      addAdminLinkToMenu();
    }
    
    // Configurar el cierre de sesión
    if (logoutLink) {
      // Eliminar event listeners previos para evitar duplicados
      const newLogoutLink = logoutLink.cloneNode(true);
      logoutLink.parentNode.replaceChild(newLogoutLink, logoutLink);
      const freshLogoutLink = document.getElementById('logoutLink');
      
      freshLogoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        handleLogout();
      });
      
      // Añadir atributos de accesibilidad
      freshLogoutLink.setAttribute('role', 'menuitem');
      freshLogoutLink.setAttribute('tabindex', '-1');
    }
    
    // Manejar clic en el botón de usuario (si existe)
    if (userMenuButton && userDropdown) {
      // Eliminar event listeners previos para evitar duplicados
      const newUserMenuButton = userMenuButton.cloneNode(true);
      userMenuButton.parentNode.replaceChild(newUserMenuButton, userMenuButton);
      const freshUserMenuButton = document.querySelector('.user-info');
      
      freshUserMenuButton.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleUserDropdown();
      });
      
      // Manejar tecla Enter o Espacio para abrir/cerrar el menú
      freshUserMenuButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          toggleUserDropdown();
        }
      });
      
      // Añadir atributos de accesibilidad
      freshUserMenuButton.setAttribute('role', 'button');
      freshUserMenuButton.setAttribute('tabindex', '0');
      freshUserMenuButton.setAttribute('aria-expanded', 'false');
      freshUserMenuButton.setAttribute('aria-haspopup', 'true');
      
      // Cerrar el dropdown cuando se hace clic fuera de él
      document.removeEventListener('click', closeUserDropdown);
      document.addEventListener('click', closeUserDropdown);
      
      // Cerrar el dropdown cuando se presiona Escape
      document.removeEventListener('keydown', handleEscapeKey);
      document.addEventListener('keydown', handleEscapeKey);
    }
  } else {
    // Usuario no autenticado - mostrar enlace de login
    if (loginLink) {
      // Ocultar login si estamos en la página de login
      loginLink.style.display = window.location.pathname.includes('login.html') ? 'none' : 'block';
    }
    if (userMenu) {
      userMenu.style.display = 'none';
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

// Función para añadir enlace al panel de administración en el menú
function addAdminLinkToMenu() {
  const userDropdown = document.querySelector('.user-dropdown');
  if (userDropdown && !document.getElementById('adminLink')) {
    const adminLink = document.createElement('a');
    adminLink.id = 'adminLink';
    adminLink.href = '/pages/admin.html';
    adminLink.innerHTML = '<i class="fas fa-cog"></i> Panel de Administración';
    adminLink.setAttribute('role', 'menuitem');
    adminLink.setAttribute('tabindex', '-1');
    
    // Insertar el enlace de administración antes del enlace de cierre de sesión
    const logoutLink = document.getElementById('logoutLink');
    userDropdown.insertBefore(adminLink, logoutLink);
  }
}

// Función para alternar el menú desplegable del usuario
function toggleUserDropdown() {
  const userDropdown = document.querySelector('.user-dropdown');
  const userMenuButton = document.querySelector('.user-info');
  
  if (userDropdown && userMenuButton) {
    const isExpanded = userDropdown.classList.contains('show');
    
    // Cerrar todos los dropdowns
    closeAllDropdowns();
    
    if (!isExpanded) {
      // Abrir este dropdown
      userDropdown.classList.add('show');
      userMenuButton.setAttribute('aria-expanded', 'true');
      
      // Enfocar el primer elemento del menú
      const firstLink = userDropdown.querySelector('a');
      if (firstLink) {
        firstLink.setAttribute('tabindex', '0');
        // Esperar un momento para asegurar el enfoque
        setTimeout(() => firstLink.focus(), 10);
      }
    } else {
      // Cerrar este dropdown
      userDropdown.classList.remove('show');
      userMenuButton.setAttribute('aria-expanded', 'false');
    }
  }
}

// Función para cerrar el menú desplegable del usuario
function closeUserDropdown(e) {
  const userMenu = document.getElementById('userMenu');
  const userDropdown = document.querySelector('.user-dropdown');
  
  if (userMenu && userDropdown && !userMenu.contains(e.target)) {
    userDropdown.classList.remove('show');
    const userMenuButton = document.querySelector('.user-info');
    if (userMenuButton) {
      userMenuButton.setAttribute('aria-expanded', 'false');
    }
    
    // Quitar el foco de los elementos del menú
    const menuItems = userDropdown.querySelectorAll('a');
    menuItems.forEach(item => {
      item.setAttribute('tabindex', '-1');
    });
  }
}

// Función para manejar la tecla Escape
function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    closeAllDropdowns();
  }
}

// Función para cerrar todos los dropdowns
function closeAllDropdowns() {
  const openDropdowns = document.querySelectorAll('.user-dropdown.show');
  openDropdowns.forEach(dropdown => {
    dropdown.classList.remove('show');
  });
  
  const userMenuButtons = document.querySelectorAll('.user-info');
  userMenuButtons.forEach(button => {
    button.setAttribute('aria-expanded', 'false');
  });
  
  // Quitar el foco de los elementos del menú
  const menuItems = document.querySelectorAll('.user-dropdown a');
  menuItems.forEach(item => {
    item.setAttribute('tabindex', '-1');
  });
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
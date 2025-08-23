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
  
  // Ocultar el enlace de login en la página de login
  if (window.location.pathname.includes('login.html')) {
    if (loginLink) {
      loginLink.style.display = 'none';
    }
  }
  
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
    // Usuario autenticado - mostrar menú de usuario
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
      
      // Añadir atributos de accesibilidad
      freshUserMenuButton.setAttribute('aria-expanded', 'false');
    }
  } else {
    // Usuario no autenticado - mostrar enlace de login y ocultar menú de usuario
    if (userMenu) {
      userMenu.style.display = 'none';
    }
    if (loginLink) {
      loginLink.style.display = 'block';
    }
  }
  
  // Cerrar dropdowns al hacer clic fuera
  document.removeEventListener('click', closeUserDropdown);
  document.addEventListener('click', closeUserDropdown);
  
  // Manejar la tecla Escape
  document.removeEventListener('keydown', handleEscapeKey);
  document.addEventListener('keydown', handleEscapeKey);
}

// Función para cerrar el dropdown del usuario
function closeUserDropdown(e) {
  const userDropdown = document.querySelector('.user-dropdown');
  const userMenuButton = document.querySelector('.user-info');
  
  if (userDropdown && userMenuButton && 
      !userDropdown.contains(e.target) && 
      !userMenuButton.contains(e.target)) {
    userDropdown.style.display = 'none';
    userMenuButton.setAttribute('aria-expanded', 'false');
  }
}

// Función para manejar la tecla Escape
function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    const userDropdown = document.querySelector('.user-dropdown');
    const userMenuButton = document.querySelector('.user-info');
    
    if (userDropdown && userMenuButton) {
      userDropdown.style.display = 'none';
      userMenuButton.setAttribute('aria-expanded', 'false');
    }
  }
}

// Función para alternar el dropdown del usuario
function toggleUserDropdown() {
  const userDropdown = document.querySelector('.user-dropdown');
  const userMenuButton = document.querySelector('.user-info');
  
  if (userDropdown && userMenuButton) {
    const isExpanded = userMenuButton.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      userDropdown.style.display = 'none';
      userMenuButton.setAttribute('aria-expanded', 'false');
    } else {
      userDropdown.style.display = 'block';
      userMenuButton.setAttribute('aria-expanded', 'true');
      
      // Asegurar que los elementos del menú sean enfocables
      const menuItems = userDropdown.querySelectorAll('a');
      menuItems.forEach((item, index) => {
        item.setAttribute('tabindex', '0');
      });
    }
  }
}

// Función para añadir enlace al panel de administración en el menú
function addAdminLinkToMenu() {
  const userDropdown = document.querySelector('.user-dropdown');
  const adminLink = document.querySelector('[href="pages/admin.html"]');
  
  // Si ya existe el enlace, no hacer nada
  if (adminLink) return;
  
  // Crear enlace al panel de administración
  if (userDropdown) {
    const adminListItem = document.createElement('li');
    adminListItem.innerHTML = '<a href="pages/admin.html" role="menuitem"><i class="fas fa-cog" aria-hidden="true"></i> Panel de Administración</a>';
    // Insertar antes del enlace de cierre de sesión
    const logoutItem = userDropdown.querySelector('[id="logoutLink"]').parentNode;
    userDropdown.insertBefore(adminListItem, logoutItem);
  }
}

// Función para manejar el cierre de sesión
function handleLogout() {
  logout();
  window.location.href = 'index.html';
}

// Exportar funciones necesarias
export { initUserMenu };
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
  const userNameElement = document.getElementById('userName');
  const logoutLink = document.getElementById('logoutLink');
  const userDropdown = document.querySelector('.user-dropdown');
  const userMenuButton = document.querySelector('.user-info');
  const caretIcon = userMenuButton ? userMenuButton.querySelector('.fas.fa-caret-down') : null;
  
  // Si no existen los elementos necesarios, salir de la función
  if (!userMenu || !loginLink) {
    return;
  }
  
  // Limpiar cualquier contenido previo
  if (userNameElement) {
    userNameElement.textContent = '';
  }
  
  // Verificar autenticación y mostrar elementos apropiados
  if (isAuthenticated() && user) {
    // Usuario autenticado - mostrar menú de usuario
    userMenu.style.display = 'block';
    loginLink.style.display = 'none';
    
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
        userDropdown.classList.toggle('show');
        const isExpanded = userDropdown.classList.contains('show');
        freshUserMenuButton.setAttribute('aria-expanded', isExpanded);
        
        // Si el menú se abre, enfocar el primer elemento
        if (isExpanded) {
          const firstLink = userDropdown.querySelector('a');
          if (firstLink) {
            firstLink.focus();
          }
        }
      });
      
      // Manejar la navegación con teclado
      freshUserMenuButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          freshUserMenuButton.click();
        }
      });
      
      // Cerrar el menú si se hace clic fuera de él
      document.addEventListener('click', function(e) {
        if (userDropdown.classList.contains('show') && 
            !userDropdown.contains(e.target) && 
            e.target !== freshUserMenuButton) {
          userDropdown.classList.remove('show');
          freshUserMenuButton.setAttribute('aria-expanded', 'false');
        }
      });
      
      // Manejar navegación por teclado en el menú de usuario
      userDropdown.addEventListener('keydown', function(e) {
        const links = userDropdown.querySelectorAll('a');
        const currentIndex = Array.from(links).indexOf(document.activeElement);
        
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % links.length;
            links[nextIndex].focus();
            break;
          case 'ArrowUp':
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + links.length) % links.length;
            links[prevIndex].focus();
            break;
          case 'Escape':
            e.preventDefault();
            userDropdown.classList.remove('show');
            freshUserMenuButton.setAttribute('aria-expanded', 'false');
            freshUserMenuButton.focus();
            break;
        }
      });
      
      // Añadir roles y atributos de accesibilidad al dropdown
      userDropdown.setAttribute('role', 'menu');
    }
  } else {
    // Usuario no autenticado - mostrar enlace de inicio de sesión
    userMenu.style.display = 'none';
    loginLink.style.display = 'block';
    
    // Ocultar el ícono del menú desplegable
    if (caretIcon) {
      caretIcon.style.display = 'none';
    }
    
    // Asegurarse de que el dropdown esté oculto
    if (userDropdown && userDropdown.classList.contains('show')) {
      userDropdown.classList.remove('show');
    }
    
    // Limpiar cualquier contenido del nombre de usuario
    if (userNameElement) {
      userNameElement.textContent = '';
    }
    
    // Limpiar datos residuales de usuario en localStorage
    localStorage.removeItem('user');
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
  // Forzar limpieza de datos residuales
  if (!isAuthenticated()) {
    localStorage.removeItem('user');
  }
  
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
export { initUserMenu, handleLogout, checkAuth, API_BASE_URL };
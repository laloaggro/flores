import { updateCartCount, getUser, isAuthenticated, logout, isAdmin } from './utils.js';

// Función para inicializar el menú de usuario
function initUserMenu() {
  const user = getUser();
  const userMenu = document.getElementById('userMenu');
  const loginLink = document.getElementById('loginLink');
  const userNameElement = document.getElementById('userName');
  const logoutLink = document.getElementById('logoutLink');
  const userDropdown = document.querySelector('.user-dropdown');
  const userMenuButton = document.getElementById('userMenuButton');
  
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
    
    // Manejar clic en el botón de usuario (si existe)
    if (userMenuButton && userDropdown) {
      // Eliminar event listeners previos para evitar duplicados
      const newMenuButton = userMenuButton.cloneNode(true);
      userMenuButton.parentNode.replaceChild(newMenuButton, userMenuButton);
      const freshMenuButton = document.getElementById('userMenuButton');
      
      freshMenuButton.addEventListener('click', function(e) {
        e.stopPropagation();
        userMenu.classList.toggle('show');
        const isExpanded = userMenu.classList.contains('show');
        freshMenuButton.setAttribute('aria-expanded', isExpanded);
        
        // Si el menú se abre, enfocar el primer elemento
        if (isExpanded) {
          const firstLink = userDropdown.querySelector('a');
          if (firstLink) {
            firstLink.focus();
          }
        }
      });
      
      // Cerrar el menú si se hace clic fuera de él
      document.addEventListener('click', function(e) {
        if (userMenu.classList.contains('show') && 
            !userMenu.contains(e.target) && 
            e.target !== freshMenuButton) {
          userMenu.classList.remove('show');
          freshMenuButton.setAttribute('aria-expanded', 'false');
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
            userMenu.classList.remove('show');
            freshMenuButton.setAttribute('aria-expanded', 'false');
            freshMenuButton.focus();
            break;
        }
      });
    }
  } else {
    // Usuario no autenticado - mostrar enlace de inicio de sesión
    userMenu.style.display = 'none';
    loginLink.style.display = 'block';
    
    // Asegurarse de que el dropdown esté oculto
    if (userMenu.classList.contains('show')) {
      userMenu.classList.remove('show');
    }
    
    // Limpiar cualquier contenido del nombre de usuario
    if (userNameElement) {
      userNameElement.textContent = '';
    }
    
    // Limpiar datos residuales de usuario en localStorage
    localStorage.removeItem('user');
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
      if (logoutLink && logoutLink.parentNode) {
        userDropdown.insertBefore(adminLink, logoutLink);
      } else {
        userDropdown.appendChild(adminLink);
      }
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
export { initUserMenu, handleLogout, checkAuth };
// Forzar limpieza completa del localStorage al cargar este script
(function() {
  // Limpiar todos los datos de usuario almacenados
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('cart');
})();

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
      // Eliminar event listeners previos para evitar duplicados
      const newLogoutLink = logoutLink.cloneNode(true);
      logoutLink.parentNode.replaceChild(newLogoutLink, logoutLink);
      const freshLogoutLink = document.getElementById('logoutLink');
      
      freshLogoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        handleLogout();
      });
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
    }
  } else {
    // Usuario no autenticado - mostrar enlace de inicio de sesión
    userMenu.style.display = 'none';
    loginLink.style.display = 'block';
    
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
  // Enviar solicitud al servidor para cerrar sesión
  fetch(`${API_BASE_URL}/api/users/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(response => response.json())
  .then(data => {
    // Limpiar datos de sesión local
    logout();
    // Forzar limpieza completa
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/index.html';
  })
  .catch(error => {
    console.error('Error al cerrar sesión:', error);
    // Aún si hay error, limpiar datos locales
    logout();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/index.html';
  });
}

// Función para verificar la autenticación del usuario
function checkAuth() {
  if (!isAuthenticated()) {
    // Limpiar datos residuales
    localStorage.removeItem('user');
    
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
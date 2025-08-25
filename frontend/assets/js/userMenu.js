import { isAuthenticated, getUser, logout, isAdmin } from './utils.js';

/**
 * Clase para manejar el menú de usuario
 */
class UserMenu {
    /**
     * Inicializa el menú de usuario
     */
    static init() {
        // Verificar si estamos en la página de login
        const isLoginPage = window.location.pathname.includes('login.html');
        
        // Obtener elementos del DOM
        const loginLink = document.getElementById('loginLink');
        const userMenu = document.getElementById('userMenu');
        const userNameDisplay = document.getElementById('userNameDisplay');
        const logoutLink = document.getElementById('logoutLink');
        const userDropdown = document.querySelector('.user-dropdown');
        const userMenuButton = document.querySelector('.user-info');
        
        // Si no existen los elementos necesarios, salir de la función
        if ((!loginLink && !userMenu) || !isAuthenticated()) {
            // Mostrar login si no está autenticado
            if (loginLink) {
                loginLink.style.display = 'block';
            }
            if (userMenu) {
                userMenu.style.display = 'none';
            }
            return;
        }
        
        // Obtener información del usuario
        const user = getUser();
        const userLocalStorage = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Si estamos en la página de login, ocultar el enlace de login
        if (isLoginPage) {
            if (loginLink) {
                loginLink.style.display = 'none';
            }
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
            
            // Mostrar el nombre del usuario
            if (userNameDisplay) {
                userNameDisplay.textContent = user.name || 'Usuario';
            }
            
            // Mostrar imagen de perfil si está disponible (para usuarios de Google)
            if (userMenuButton && (userLocalStorage.imageUrl || userLocalStorage.image_url)) {
                // Verificar si ya existe un avatar para evitar duplicados
                const existingAvatar = userMenuButton.querySelector('.user-avatar');
                if (!existingAvatar) {
                    // Obtener la URL de la imagen (compatibilidad con ambos formatos)
                    const imageUrl = userLocalStorage.imageUrl || userLocalStorage.image_url;
                    
                    // Crear contenedor para la imagen
                    const imgContainer = document.createElement('div');
                    imgContainer.className = 'user-avatar';
                    imgContainer.innerHTML = `
                        <img src="${imageUrl}" alt="Foto de perfil" class="user-profile-image" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fas fa-user\\' aria-hidden=\\'true\\'></i>';">
                    `;
                    
                    // Verificar que userNameDisplay existe y tiene un padre antes de insertar
                    if (userNameDisplay && userNameDisplay.parentNode) {
                        // Insertar la imagen antes del nombre del usuario
                        userNameDisplay.parentNode.insertBefore(imgContainer, userNameDisplay);
                    } else if (userMenuButton) {
                        // Si no se puede insertar antes del nombre, agregar al final del botón
                        userMenuButton.appendChild(imgContainer);
                    }
                }
            }
            
            // Configurar el cierre de sesión
            if (logoutLink && logoutLink.parentNode) {
                // Eliminar event listeners previos para evitar duplicados
                const newLogoutLink = logoutLink.cloneNode(true);
                logoutLink.parentNode.replaceChild(newLogoutLink, logoutLink);
                
                newLogoutLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    handleLogout();
                });
            }
            
            // Agregar enlace al panel de administración si el usuario es administrador
            if (isAdmin()) {
                addAdminLinkToMenu();
            }
            
            // Manejar clic en el botón de usuario (si existe)
            if (userMenuButton && userDropdown) {
                // Eliminar event listeners previos para evitar duplicados
                const newUserMenuButton = userMenuButton.cloneNode(true);
                if (userMenuButton.parentNode) {
                    userMenuButton.parentNode.replaceChild(newUserMenuButton, userMenuButton);
                }
                
                newUserMenuButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    console.log('Alternando menú de usuario...');
                    toggleUserDropdown();
                });
                
                // Cerrar dropdown al hacer clic fuera
                document.addEventListener('click', function(e) {
                    if (userDropdown && !userDropdown.contains(e.target) && newUserMenuButton && !newUserMenuButton.contains(e.target)) {
                        userDropdown.style.display = 'none';
                        if (newUserMenuButton) {
                            newUserMenuButton.setAttribute('aria-expanded', 'false');
                        }
                    }
                });
                
                // Cerrar dropdown al presionar Escape
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape' && userDropdown && userDropdown.style.display === 'block') {
                        userDropdown.style.display = 'none';
                        if (newUserMenuButton) {
                            newUserMenuButton.setAttribute('aria-expanded', 'false');
                        }
                    }
                });
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
    }
}

/**
 * Función para cerrar sesión
 */
function handleLogout() {
    logout();
    // Recargar la página para actualizar la interfaz
    window.location.reload();
}

/**
 * Función para alternar el dropdown del usuario
 */
function toggleUserDropdown() {
    const userDropdown = document.querySelector('.user-dropdown');
    const userMenuButton = document.querySelector('.user-info');
    
    console.log('toggleUserDropdown llamado', { userDropdown, userMenuButton });
    
    if (userDropdown && userMenuButton) {
        const isExpanded = userMenuButton.getAttribute('aria-expanded') === 'true';
        console.log('Estado actual:', isExpanded);
        
        // Cerrar todos los dropdowns primero
        document.querySelectorAll('.user-dropdown').forEach(dropdown => {
            if (dropdown !== userDropdown) {
                dropdown.style.display = 'none';
            }
        });
        
        // Actualizar todos los botones de menú (excepto el actual)
        document.querySelectorAll('.user-info').forEach(button => {
            if (button !== userMenuButton) {
                button.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Alternar el actual
        if (isExpanded) {
            userDropdown.style.display = 'none';
            userMenuButton.setAttribute('aria-expanded', 'false');
            console.log('Menú cerrado');
        } else {
            userDropdown.style.display = 'block';
            userMenuButton.setAttribute('aria-expanded', 'true');
            console.log('Menú abierto');
        }
    } else {
        console.log('No se encontraron elementos de menú de usuario');
    }
}

/**
 * Función para añadir enlace al panel de administración en el menú
 */
function addAdminLinkToMenu() {
    const userDropdown = document.querySelector('.user-dropdown');
    const adminLink = document.querySelector('[href="admin.html"]');
    
    // Si ya existe el enlace, no hacer nada
    if (adminLink) return;
    
    // Crear enlace al panel de administración
    if (userDropdown) {
        const adminListItem = document.createElement('li');
        adminListItem.innerHTML = '<a href="admin.html"><i class="fas fa-cog" aria-hidden="true"></i> Panel de Administración</a>';
        // Insertar antes del enlace de cierre de sesión
        const logoutItem = userDropdown.querySelector('[id="logoutLink"]').parentNode;
        if (logoutItem && logoutItem.parentNode) {
            userDropdown.insertBefore(adminListItem, logoutItem);
        }
    }
}

// Inicializar automáticamente cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    UserMenu.init();
});

// Exportar la clase
export default UserMenu;
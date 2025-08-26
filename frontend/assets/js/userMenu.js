import { isAuthenticated, getUserInfoFromToken as getUser, logout, isAdmin } from './utils.js';

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
        const userProfileImage = document.getElementById('userProfileImage');
        
        // Si no existen los elementos necesarios, salir de la función
        if (!loginLink && !userMenu) {
            console.log('No se encontraron elementos de menú de usuario');
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
            return;
        }
        
        // Verificar autenticación y mostrar elementos apropiados
        if (isAuthenticated() && (user || Object.keys(userLocalStorage).length > 0)) {
            // Usuario autenticado - mostrar menú de usuario
            if (loginLink) {
                loginLink.style.display = 'none';
            }
            if (userMenu) {
                userMenu.style.display = 'block';
            }
            
            // Mostrar nombre de usuario
            const displayName = user ? user.name : userLocalStorage.name;
            if (userNameDisplay && displayName) {
                userNameDisplay.textContent = displayName;
            }
            
            // Mostrar avatar de usuario
            if (userProfileImage) {
                if (user && user.picture) {
                    // Avatar de Google
                    userProfileImage.src = user.picture;
                    userProfileImage.alt = `Avatar de ${displayName}`;
                    userProfileImage.onerror = function() {
                        // Si la imagen de Google no carga, usar avatar por defecto
                        this.src = './assets/images/default-avatar.svg';
                        this.alt = 'Avatar por defecto';
                    };
                } else if (userLocalStorage && userLocalStorage.picture) {
                    // Avatar de Google desde localStorage
                    userProfileImage.src = userLocalStorage.picture;
                    userProfileImage.alt = `Avatar de ${displayName}`;
                    userProfileImage.onerror = function() {
                        // Si la imagen de Google no carga, usar avatar por defecto
                        this.src = './assets/images/default-avatar.svg';
                        this.alt = 'Avatar por defecto';
                    };
                } else {
                    // Avatar por defecto
                    userProfileImage.src = './assets/images/default-avatar.svg';
                    userProfileImage.alt = 'Avatar por defecto';
                }
            }
            
            console.log('Usuario autenticado:', user || userLocalStorage);
        } else {
            // Usuario no autenticado - mostrar enlace de login
            if (loginLink) {
                loginLink.style.display = 'flex';
            }
            if (userMenu) {
                userMenu.style.display = 'none';
            }
            
            console.log('Usuario no autenticado');
        }
        
        // Configurar evento de cierre de sesión
        if (logoutLink) {
            // Eliminar event listeners previos para evitar duplicados
            const newLogoutLink = logoutLink.cloneNode(true);
            logoutLink.parentNode.replaceChild(newLogoutLink, logoutLink);
            
            newLogoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Cerrando sesión...');
                logout();
            });
        }
        
        // Configurar menú desplegable del usuario
        if (userMenuButton && userDropdown) {
            // Eliminar event listeners previos para evitar duplicados
            const newUserMenuButton = userMenuButton.cloneNode(true);
            if (userMenuButton.parentNode) {
                userMenuButton.parentNode.replaceChild(newUserMenuButton, userMenuButton);
            }
            
            newUserMenuButton.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                console.log('Click en menú de usuario...');
                
                // Cerrar todos los dropdowns primero
                document.querySelectorAll('.user-dropdown').forEach(dropdown => {
                    if (dropdown !== userDropdown) {
                        dropdown.style.display = 'none';
                    }
                });
                
                // Actualizar todos los botones (excepto el actual)
                document.querySelectorAll('.user-info').forEach(button => {
                    if (button !== newUserMenuButton) {
                        button.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Alternar estado del menú actual
                const isExpanded = newUserMenuButton.getAttribute('aria-expanded') === 'true';
                newUserMenuButton.setAttribute('aria-expanded', !isExpanded);
                
                // Forzar visibilidad del dropdown
                userDropdown.style.display = isExpanded ? 'none' : 'block';
                userDropdown.style.visibility = isExpanded ? 'hidden' : 'visible';
                userDropdown.style.opacity = isExpanded ? '0' : '1';
                
                // Asegurar posicionamiento y z-index
                userDropdown.style.position = 'absolute';
                userDropdown.style.zIndex = '999999999';
                userDropdown.style.right = '0';
                userDropdown.style.top = 'calc(100% + 10px)';
                
                // Asegurar que el dropdown tenga un contexto de apilamiento
                userDropdown.style.isolation = 'isolate';
                userDropdown.style.pointerEvents = 'auto';
                
                console.log('Menú de usuario', isExpanded ? 'oculto' : 'mostrado');
            });
            
            // Cerrar menú al hacer clic fuera
            document.addEventListener('click', function(e) {
                if (!newUserMenuButton.contains(e.target) && !userDropdown.contains(e.target)) {
                    newUserMenuButton.setAttribute('aria-expanded', 'false');
                    userDropdown.style.display = 'none';
                    userDropdown.style.visibility = 'hidden';
                    userDropdown.style.opacity = '0';
                }
            });
            
            // Cerrar menú al presionar Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    newUserMenuButton.setAttribute('aria-expanded', 'false');
                    userDropdown.style.display = 'none';
                    userDropdown.style.visibility = 'hidden';
                    userDropdown.style.opacity = '0';
                }
            });
            
            // Prevenir que el evento de clic se propague al documento
            userDropdown.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }
}

// Inicializar el menú de usuario cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando menú de usuario...');
    UserMenu.init();
});

// Inicializar el menú de usuario cuando la ventana se cargue completamente
window.addEventListener('load', () => {
    console.log('Ventana cargada, reinitializando menú de usuario...');
    UserMenu.init();
});

// Exportar la clase para uso externo
export default UserMenu;
import { isAuthenticated, getUserInfoFromToken as getUser, logout, isAdmin, showNotification } from './utils.js';

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
        const userProfileImage = document.getElementById('userProfileImage');
        const adminMenuItem = document.getElementById('adminMenuItem');
        const adminOrdersMenuItem = document.getElementById('adminOrdersMenuItem');
        const sitemapMenuItem = document.getElementById('sitemapMenuItem');
        
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
                // Verificar si hay una imagen de perfil en localStorage o en el token
                const userPicture = (user && user.picture) || (userLocalStorage && userLocalStorage.picture);
                
                if (userPicture) {
                    // Avatar de Google u otra fuente
                    userProfileImage.src = userPicture;
                    userProfileImage.alt = `Avatar de ${displayName}`;
                    userProfileImage.onerror = function() {
                        // Si la imagen no carga, usar avatar por defecto
                        this.src = './assets/images/default-avatar.svg';
                        this.alt = 'Avatar por defecto';
                    };
                } else {
                    // Avatar por defecto
                    userProfileImage.src = './assets/images/default-avatar.svg';
                    userProfileImage.alt = 'Avatar por defecto';
                }
            }
            
            // Mostrar u ocultar elementos de administrador según el rol del usuario
            if (isAdmin()) {
                if (adminMenuItem) {
                    adminMenuItem.style.display = 'block';
                }
                if (adminOrdersMenuItem) {
                    adminOrdersMenuItem.style.display = 'block';
                }
            } else {
                if (adminMenuItem) {
                    adminMenuItem.style.display = 'none';
                }
                if (adminOrdersMenuItem) {
                    adminOrdersMenuItem.style.display = 'none';
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
        
        // Configurar evento de logout
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
        
    }
}

// Inicializar el menú de usuario cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    UserMenu.init();
});

// Exportar la clase para uso externo
export default UserMenu;
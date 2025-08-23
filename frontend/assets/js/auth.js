import { showNotification, getAuthToken, API_BASE_URL } from './utils.js';

let currentUser = null;

// Inicializar el menú de usuario
function initUserMenu() {
    console.log('Inicializando menú de usuario');
    
    const token = getAuthToken();
    const userMenu = document.getElementById('user-menu');
    const guestMenu = document.getElementById('guest-menu');
    const adminMenuItem = document.getElementById('admin-menu-item');
    
    if (token) {
        // Usuario autenticado
        console.log('Usuario autenticado');
        if (userMenu) userMenu.style.display = 'block';
        if (guestMenu) guestMenu.style.display = 'none';
        
        // Verificar si el usuario es administrador
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.role === 'admin' && adminMenuItem) {
                adminMenuItem.style.display = 'block';
            } else if (adminMenuItem) {
                adminMenuItem.style.display = 'none';
            }
        } catch (error) {
            console.error('Error al decodificar el token:', error);
        }
    } else {
        // Usuario no autenticado
        console.log('Usuario no autenticado');
        if (userMenu) userMenu.style.display = 'none';
        if (guestMenu) guestMenu.style.display = 'block';
        if (adminMenuItem) adminMenuItem.style.display = 'none';
    }
}

// Exportar funciones
export { initUserMenu };
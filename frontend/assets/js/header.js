import { isAuthenticated, getUserInfoFromToken as getUser } from './utils.js';
import { showCart } from './cart.js';

/**
 * Clase para manejar la funcionalidad del header
 */
class Header {
    /**
     * Inicializa el header
     */
    static init() {
        console.log('Inicializando header...');
        
        // Verificar si ya existe un header en la página
        const existingHeader = document.querySelector('site-header');
        if (existingHeader) {
            console.log('Header ya existe en la página');
            this.checkAuthStatus();
            this.setupCartEvents();
            this.setupHeaderEffects();
            this.setupUserMenuEvents();
            return;
        }
        
        // Crear y añadir el header si no existe
        const header = document.createElement('site-header');
        document.body.insertBefore(header, document.body.firstChild);
        
        // Configurar eventos después de un breve retraso para asegurar que el DOM se haya actualizado
        setTimeout(() => {
            this.checkAuthStatus();
            this.setupCartEvents();
            this.setupHeaderEffects();
            this.setupUserMenuEvents();
        }, 100);
    }
    
    /**
     * Configura los eventos del carrito
     */
    static setupCartEvents() {
        // Usar delegación de eventos para manejar clics en el ícono del carrito
        document.addEventListener('click', function(e) {
            if (e.target.closest('.cart-icon')) {
                e.preventDefault();
                console.log('Mostrando carrito...');
                showCart();
            }
        });
    }
    
    /**
     * Verifica el estado de autenticación del usuario
     */
    static checkAuthStatus() {
        console.log('Verificando estado de autenticación');
        
        const user = getUser();
        const loginLink = document.getElementById('loginLink');
        const userMenu = document.getElementById('userMenu');
        const userNameDisplay = document.getElementById('userNameDisplay');
        
        if (isAuthenticated() && user) {
            console.log('Usuario autenticado', user);
            
            // Ocultar enlace de login y mostrar menú de usuario
            if (loginLink) loginLink.style.display = 'none';
            if (userMenu) userMenu.style.display = 'block';
            
            // Actualizar información del usuario
            this.updateUserInfo(user);
        } else {
            console.log('Usuario no autenticado');
            
            // Mostrar enlace de login y ocultar menú de usuario
            if (loginLink) loginLink.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'none';
        }
    }
    
    /**
     * Actualiza la información del usuario en el menú
     */
    static updateUserInfo(user) {
        console.log('Actualizando información del usuario', user);
        
        const userNameDisplay = document.getElementById('userNameDisplay');
        if (userNameDisplay && user) {
            userNameDisplay.textContent = user.name || 'Usuario';
            console.log('Información del usuario actualizada:', user.name);
        }
    }
    
    /**
     * Configura los eventos del menú de usuario
     */
    static setupUserMenuEvents() {
        // Obtener elementos del menú de usuario
        const userMenuButton = document.querySelector('.user-info');
        const userDropdown = document.querySelector('.user-dropdown');
        
        // Si no existen los elementos necesarios, salir de la función
        if (!userMenuButton || !userDropdown) {
            console.log('No se encontraron elementos de menú de usuario para configurar eventos');
            return;
        }
        
        // Configurar evento para abrir/cerrar el menú de usuario
        userMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (userDropdown && !userMenuButton.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }
    
    /**
     * Configura efectos visuales del header
     */
    static setupHeaderEffects() {
        // Efecto de sombra al hacer scroll
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (header) {
                if (window.scrollY > 50) {
                    header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                } else {
                    header.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
                }
            }
        });
    }
}

// Inicializar el header cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando header...');
    Header.init();
});

// Exportar la clase para uso externo
export default Header;
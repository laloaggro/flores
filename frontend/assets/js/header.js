import { isAuthenticated, getUserInfoFromToken as getUser, isAdmin, updateCartCount } from './utils.js';
import Cart, { showCart } from '../../components/Cart.js';

/**
 * Header Component - Maneja la funcionalidad del header en todas las páginas
 */
class Header {
    /**
     * Inicializa el header
     */
    static init() {
        console.log('Inicializando header...');
        
        // Inicializar el contador del carrito
        try {
            updateCartCount();
        } catch (error) {
            console.error('Error al actualizar el contador del carrito:', error);
        }
        
        // Configurar eventos del carrito
        this.setupCartEvents();
        
        // Verificar estado de autenticación
        this.checkAuthStatus();
        
        // Configurar efectos del header
        this.setupHeaderEffects();
    }
    
    /**
     * Configura los eventos del carrito
     */
    static setupCartEvents() {
        const cartIcon = document.querySelector('.cart-icon');
        
        if (cartIcon) {
            cartIcon.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Mostrando carrito...');
                showCart();
            });
        }
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
            console.log('Usuario autenticado');
            
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
        console.log('Actualizando información del usuario');
        
        const userNameDisplay = document.getElementById('userNameDisplay');
        if (userNameDisplay && user) {
            userNameDisplay.textContent = user.name || 'Usuario';
            console.log('Información del usuario actualizada:', user.name);
        }
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
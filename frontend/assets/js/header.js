import { isAuthenticated, getUser, isAdmin, updateCartCount } from './utils.js';
import UserMenu from './userMenu.js';

/**
 * Header Component - Maneja la funcionalidad del header en todas las páginas
 */
class Header {
    /**
     * Inicializa el header
     */
    static init() {
        console.log('Inicializando header...');
        
        // Inicializar el menú de usuario
        try {
            UserMenu.init();
        } catch (error) {
            console.error('Error al inicializar el menú de usuario:', error);
        }
        
        // Inicializar el contador del carrito
        try {
            updateCartCount();
        } catch (error) {
            console.error('Error al actualizar el contador del carrito:', error);
        }
        
        // Configurar eventos del carrito
        this.setupCartEvents();
        
        // Configurar eventos del menú de usuario
        this.setupUserMenuEvents();
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
     * Configura los eventos del menú de usuario
     */
    static setupUserMenuEvents() {
        // Sistema moderno (userMenu.js)
        const userMenuButton = document.querySelector('.user-info');
        const userDropdown = document.querySelector('.user-dropdown');
        
        // Sistema antiguo (elementos por ID)
        const userIcon = document.getElementById('userIcon');
        const userDropdownOld = document.getElementById('userDropdown');
        
        console.log('Configurando eventos del menú de usuario', { 
            userMenuButton, 
            userDropdown, 
            userIcon, 
            userDropdownOld 
        });
        
        // Verificar si estamos en el sistema moderno
        if (userMenuButton && userDropdown) {
            console.log('Sistema moderno detectado');
            
            // Eliminar event listeners previos para evitar duplicados
            const newUserMenuButton = userMenuButton.cloneNode(true);
            if (userMenuButton.parentNode) {
                userMenuButton.parentNode.replaceChild(newUserMenuButton, userMenuButton);
            }
            
            newUserMenuButton.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('Click en menú de usuario (sistema moderno)...');
                
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
                
                // Alternar el actual
                const isExpanded = newUserMenuButton.getAttribute('aria-expanded') === 'true';
                if (isExpanded) {
                    userDropdown.style.display = 'none';
                    newUserMenuButton.setAttribute('aria-expanded', 'false');
                } else {
                    userDropdown.style.display = 'block';
                    newUserMenuButton.setAttribute('aria-expanded', 'true');
                }
            });
            
            // Cerrar dropdown al hacer clic fuera
            document.addEventListener('click', function(e) {
                if (userDropdown && !userDropdown.contains(e.target) && newUserMenuButton && !newUserMenuButton.contains(e.target)) {
                    userDropdown.style.display = 'none';
                    newUserMenuButton.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Cerrar dropdown al presionar Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && userDropdown && userDropdown.style.display === 'block') {
                    userDropdown.style.display = 'none';
                    newUserMenuButton.setAttribute('aria-expanded', 'false');
                }
            });
        }
        // Verificar si estamos en el sistema antiguo
        else if (userIcon && userDropdownOld) {
            console.log('Sistema antiguo detectado');
            userIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('Click en menú de usuario (sistema antiguo)...');
                toggleUserDropdown();
            });
            
            // Cerrar dropdown al hacer clic fuera
            document.addEventListener('click', function(e) {
                if (!userDropdownOld.contains(e.target) && e.target !== userIcon) {
                    userDropdownOld.style.display = 'none';
                }
            });
        } else {
            console.log('No se detectó ningún sistema de menú de usuario');
        }
    }
}

/**
 * Función para alternar el dropdown del usuario (sistema antiguo)
 */
function toggleUserDropdown() {
    const userDropdown = document.getElementById('userDropdown');
    
    if (userDropdown) {
        const isDisplayed = userDropdown.style.display === 'block';
        userDropdown.style.display = isDisplayed ? 'none' : 'block';
        console.log('Menú de usuario alternado (sistema antiguo):', userDropdown.style.display);
    }
}

/**
 * Función para mostrar el carrito
 */
function showCart() {
    // Importar dinámicamente el módulo del carrito
    import('./cart.js').then(cartModule => {
        // Llamar a la función showCart del módulo
        cartModule.showCart();
    }).catch(error => {
        console.error('Error al cargar el módulo del carrito:', error);
    });
}

// Inicializar automáticamente cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    Header.init();
});

// Exportar la clase
export default Header;
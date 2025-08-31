/**
 * Clase para manejar la funcionalidad del header
 */
class Header {
    /**
     * Inicializa el header
     */
    static init() {
        // Verificar si el DOM está completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupHeader());
        } else {
            this.setupHeader();
        }
    }
    
    /**
     * Configura el header
     */
    static setupHeader() {
        this.setupThemeToggle();
        this.setupMobileMenu();
        this.updateCartCount();
    }
    
    /**
     * Configura el toggle de tema
     */
    static setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;
        
        // Establecer el tema inicial
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        // Cambiar el icono según el tema
        const themeIcon = themeToggle.querySelector('i');
        if (themeIcon) {
            themeIcon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Añadir evento de clic
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Cambiar el icono
            const themeIcon = themeToggle.querySelector('i');
            if (themeIcon) {
                themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        });
    }
    
    /**
     * Configura el menú móvil
     */
    static setupMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (!navToggle || !navLinks) return;
        
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('show');
        });
    }
    
    /**
     * Actualiza el contador del carrito
     */
    static updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (!cartCount) return;
        
        try {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        } catch (error) {
            console.error('Error al actualizar el contador del carrito:', error);
            cartCount.textContent = '0';
        }
    }
    
}

// Inicializar el header cuando el DOM esté listo
Header.init();


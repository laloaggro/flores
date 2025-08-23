// accessibility.js - Mejoras de accesibilidad para el sitio web

/**
 * Accessibility Enhancements - Mejoras de accesibilidad para el sitio web
 */
class AccessibilityEnhancements {
    /**
     * Inicializa las mejoras de accesibilidad
     */
    static init() {
        this.enhanceFocusIndicators();
        this.setupSkipLinks();
        this.improveImageAccessibility();
        this.setupKeyboardNavigation();
        this.setupReducedMotion();
    }
    
    /**
     * Mejora los indicadores de enfoque para usuarios de teclado
     */
    static enhanceFocusIndicators() {
        // Añadir estilos para indicadores de enfoque más visibles
        const style = document.createElement('style');
        style.textContent = `
            :focus {
                outline: 2px solid #4A90E2;
                outline-offset: 2px;
            }
            
            .focus-visible {
                outline: 2px solid #4A90E2;
                outline-offset: 2px;
            }
            
            /* Estilos para usuarios que prefieren reduced motion */
            @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Configura enlaces para saltar al contenido principal
     */
    static setupSkipLinks() {
        // Crear enlace para saltar al contenido principal
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Saltar al contenido principal';
        skipLink.className = 'skip-link';
        
        // Mostrar enlace cuando recibe foco
        skipLink.addEventListener('focus', function() {
            this.style.top = '0';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    /**
     * Mejora la accesibilidad de las imágenes
     */
    static improveImageAccessibility() {
        // Asegurar que todas las imágenes tengan atributos alt
        const images = document.querySelectorAll('img:not([alt])');
        images.forEach(img => {
            if (!img.hasAttribute('alt')) {
                img.setAttribute('alt', '');
            }
                    
            if (!img.hasAttribute('role')) {
                img.setAttribute('role', 'img');
            }
        });
        
        // Añadir atributos ARIA a elementos interactivos sin ellos
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            if (!button.getAttribute('aria-label') && button.textContent.trim() === '') {
                // Intentar obtener el aria-label del título o texto del botón
                const label = button.title || 'Botón';
                button.setAttribute('aria-label', label);
            }
        });
    }
    
    /**
     * Configura la navegación por teclado
     */
    static setupKeyboardNavigation() {
        // Manejar la navegación con teclado en menús
        document.addEventListener('keydown', (e) => {
            // Manejar Escape para cerrar menús desplegables
            if (e.key === 'Escape') {
                const openDropdowns = document.querySelectorAll('.dropdown.open');
                openDropdowns.forEach(dropdown => {
                    dropdown.classList.remove('open');
                });
                
                // Enfocar el botón que abrió el menú
                const lastOpenedButton = document.querySelector('[data-last-opened]');
                if (lastOpenedButton) {
                    lastOpenedButton.focus();
                    lastOpenedButton.removeAttribute('data-last-opened');
                }
            }
            
            // Manejar Tab para mejorar la navegación
            if (e.key === 'Tab') {
                document.body.classList.add('user-is-tabbing');
            }
        });
        
        // Eliminar la clase cuando se usa el mouse
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('user-is-tabbing');
        });
    }
    
    /**
     * Añade atributos ARIA a elementos dinámicos
     * @param {HTMLElement} element - Elemento al que añadir atributos ARIA
     * @param {object} attributes - Atributos ARIA a añadir
     */
    static addAriaAttributes(element, attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(`aria-${key}`, value);
        });
    }
    
    /**
     * Configura preferencias para usuarios con movilidad reducida
     */
    static setupReducedMotion() {
        // Detectar preferencia de movilidad reducida
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (mediaQuery.matches) {
            document.body.classList.add('reduced-motion');
        }
        
        // Escuchar cambios en la preferencia
        mediaQuery.addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('reduced-motion');
            } else {
                document.body.classList.remove('reduced-motion');
            }
        });
    }
    
    /**
     * Marca un elemento como aria-live para anuncios de cambios dinámicos
     * @param {string} regionId - ID de la región aria-live
     * @param {string} message - Mensaje a anunciar
     */
    static announceToScreenReader(regionId, message) {
        let region = document.getElementById(regionId);
        if (!region) {
            region = document.createElement('div');
            region.id = regionId;
            region.setAttribute('aria-live', 'polite');
            region.setAttribute('aria-atomic', 'true');
            region.style.position = 'absolute';
            region.style.left = '-10000px';
            region.style.top = 'auto';
            region.style.width = '1px';
            region.style.height = '1px';
            region.style.overflow = 'hidden';
            document.body.appendChild(region);
        }
        
        region.textContent = message;
    }
}

// Inicializar mejoras de accesibilidad cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    AccessibilityEnhancements.init();
});

// Exportar la clase
export default AccessibilityEnhancements;
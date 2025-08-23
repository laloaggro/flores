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
        
        // Añadir estilos para el enlace
        const style = document.createElement('style');
        style.textContent = `
            .skip-link {
                position: absolute;
                top: -40px;
                left: 0;
                background: #4A90E2;
                color: white;
                padding: 8px;
                text-decoration: none;
                z-index: 1000;
                transition: top 0.3s;
            }
            
            .skip-link:focus {
                top: 0;
            }
        `;
        document.head.appendChild(style);
        
        // Añadir el enlace al inicio del body
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    /**
     * Mejora la accesibilidad de las imágenes
     */
    static improveImageAccessibility() {
        // Asegurar que todas las imágenes tengan atributos alt
        const images = document.querySelectorAll('img:not([alt])');
        images.forEach(img => {
            // Si no tiene alt, añadir uno basado en el nombre del archivo o un genérico
            const src = img.src;
            const altText = src.split('/').pop().split('.')[0].replace(/[-_]/g, ' ') || 'Imagen';
            img.alt = altText;
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
        // Añadir soporte para navegación por teclado en menús
        document.addEventListener('keydown', (e) => {
            // Si se presiona Tab, añadir clase para indicar navegación por teclado
            if (e.key === 'Tab') {
                document.body.classList.add('user-is-tabbing');
            }
        });
        
        // Añadir estilos para cuando se usa navegación por teclado
        const style = document.createElement('style');
        style.textContent = `
            .user-is-tabbing button:focus,
            .user-is-tabbing input:focus,
            .user-is-tabbing select:focus,
            .user-is-tabbing textarea:focus {
                outline: 2px solid #4A90E2;
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
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

// Inicializar automáticamente cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    AccessibilityEnhancements.init();
});

// Exportar la clase
export default AccessibilityEnhancements;
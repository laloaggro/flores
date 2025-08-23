// lazyLoad.js - Implementa carga diferida de imágenes para mejorar el rendimiento

/**
 * Lazy Load - Implementa carga diferida de imágenes para mejorar el rendimiento
 */
class LazyLoad {
    constructor() {
        this.imageObserver = null;
        this.init();
    }
    
    /**
     * Inicializa el observador de imágenes
     */
    init() {
        // Verificar si el navegador soporta IntersectionObserver
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px', // Cargar imágenes 50px antes de que entren en la vista
                threshold: 0.01 // Disparar cuando 1% de la imagen sea visible
            });
            
            // Observar todas las imágenes con atributo loading="lazy"
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            lazyImages.forEach(img => this.imageObserver.observe(img));
            
            // También observar imágenes en elementos picture
            const lazyPictures = document.querySelectorAll('picture source[loading="lazy"]');
            lazyPictures.forEach(source => this.imageObserver.observe(source));
        } else {
            // Fallback para navegadores que no soportan IntersectionObserver
            this.loadAllImages();
        }
    }
    
    /**
     * Carga una imagen cuando entra en la vista
     * @param {HTMLImageElement} img - Elemento de imagen
     */
    loadImage(img) {
        // Si es una imagen con data-src, usar ese valor
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
        
        // Si es un source con data-srcset, usar ese valor
        if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
        }
        
        // Marcar como cargada
        img.classList.add('lazy-loaded');
    }
    
    /**
     * Carga todas las imágenes (fallback para navegadores antiguos)
     */
    loadAllImages() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            this.loadImage(img);
        });
    }
    
    /**
     * Destruye el observador de imágenes
     */
    destroy() {
        if (this.imageObserver) {
            this.imageObserver.disconnect();
        }
    }
}

// Inicializar lazy loading cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new LazyLoad();
});

export default LazyLoad;
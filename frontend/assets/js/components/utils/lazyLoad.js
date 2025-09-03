/**
 * lazyLoad.js - Implementación de carga diferida para imágenes
 * 
 * Este módulo implementa la carga diferida de imágenes para mejorar el rendimiento
 * de la página cargando solo las imágenes que están cerca de la ventana gráfica.
 */

/**
 * Inicializa la carga diferida de imágenes
 */
function initializeLazyLoading() {
    // Verificar si el navegador soporta IntersectionObserver
    if ('IntersectionObserver' in window) {
        // Crear un observador de intersección
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // Si la imagen está en la ventana gráfica
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    const srcset = img.dataset.srcset;
                    
                    // Cargar la imagen
                    if (src) {
                        img.src = src;
                    }
                    
                    if (srcset) {
                        img.srcset = srcset;
                    }
                    
                    // Quitar la clase de carga diferida
                    img.classList.remove('lazy');
                    
                    // Dejar de observar esta imagen
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px' // Cargar imágenes 50px antes de que entren en la ventana gráfica
        });
        
        // Observar todas las imágenes con la clase 'lazy'
        const lazyImages = document.querySelectorAll('img.lazy');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback para navegadores que no soportan IntersectionObserver
        const lazyImages = document.querySelectorAll('img.lazy');
        lazyImages.forEach(img => {
            const src = img.dataset.src;
            const srcset = img.dataset.srcset;
            
            if (src) {
                img.src = src;
            }
            
            if (srcset) {
                img.srcset = srcset;
            }
            
            img.classList.remove('lazy');
        });
    }
}

// Exportar la función
export { initializeLazyLoading };
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
                rootMargin: '50px 0px' // Cargar imágenes 50px antes de que entren en la vista
            });
            
            // Observar todas las imágenes con atributo loading="lazy"
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            lazyImages.forEach(img => this.imageObserver.observe(img));
        } else {
            // Fallback para navegadores que no soportan IntersectionObserver
            this.loadAllImages();
        }
    }
    
    /**
     * Carga una imagen específica
     * @param {HTMLImageElement} img - Elemento de imagen a cargar
     */
    loadImage(img) {
        // Si la imagen ya tiene src, no hacer nada
        if (img.src && img.src !== window.location.href) {
            return;
        }
        
        // Obtener la URL de la imagen del atributo data-src
        const src = img.dataset.src;
        if (!src) {
            return;
        }
        
        // Crear una imagen temporal para cargarla
        const tempImage = new Image();
        tempImage.onload = () => {
            img.src = src;
            img.classList.add('loaded');
            
            // Añadir evento para manejar errores de carga
            img.onerror = () => {
                this.handleImageError(img);
            };
        };
        
        tempImage.onerror = () => {
            this.handleImageError(img);
        };
        
        tempImage.src = src;
    }
    
    /**
     * Maneja errores de carga de imágenes
     * @param {HTMLImageElement} img - Elemento de imagen con error
     */
    handleImageError(img) {
        // Usar imagen placeholder como fallback
        img.src = './assets/images/placeholder.svg';
        img.classList.add('error');
        img.alt = 'Imagen no disponible';
    }
    
    /**
     * Carga todas las imágenes de inmediato (fallback)
     */
    loadAllImages() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.add('loaded');
            }
        });
    }
    
    /**
     * Añade una imagen al observador
     * @param {HTMLImageElement} img - Imagen a observar
     */
    observeImage(img) {
        if (this.imageObserver) {
            this.imageObserver.observe(img);
        } else {
            this.loadImage(img);
        }
    }
    
    /**
     * Destruye el observador
     */
    destroy() {
        if (this.imageObserver) {
            this.imageObserver.disconnect();
        }
    }
}

// Inicializar automáticamente cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    window.lazyLoad = new LazyLoad();
});

// Función de inicialización
function initializeLazyLoading() {
    if (!window.lazyLoad) {
        window.lazyLoad = new LazyLoad();
    }
}

// Exportar la clase y la función de inicialización
export default LazyLoad;
export { initializeLazyLoading };

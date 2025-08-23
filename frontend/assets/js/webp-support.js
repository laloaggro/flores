/**
 * WebP Support Detection - Detecta el soporte de WebP en el navegador
 */

class WebPSupport {
    /**
     * Verifica si el navegador soporta WebP
     * @returns {Promise<boolean>} - Promesa que resuelve con true si el navegador soporta WebP
     */
    static checkSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = function () {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }
    
    /**
     * Convierte una URL de imagen a WebP si es posible
     * @param {string} imageUrl - URL de la imagen original
     * @returns {string} - URL de la imagen en WebP si es posible, o la original si no
     */
    static convertToWebP(imageUrl) {
        // Si la imagen ya es WebP, devolverla tal cual
        if (imageUrl.endsWith('.webp')) {
            return imageUrl;
        }
        
        // Convertir la extensión a .webp
        const webpUrl = imageUrl.replace(/\.(jpg|jpeg|png)/i, '.webp');
        return webpUrl;
    }
    
    /**
     * Crea un elemento <picture> con soporte para WebP
     * @param {string} src - URL de la imagen original
     * @param {string} alt - Texto alternativo
     * @param {object} options - Opciones adicionales
     * @returns {Promise<string>} - HTML del elemento <picture>
     */
    static async createPictureElement(src, alt, options = {}) {
        const supportsWebP = await this.checkSupport();
        const webpSrc = this.convertToWebP(src);
        
        const classes = options.classes ? `class="${options.classes}"` : '';
        const width = options.width ? `width="${options.width}"` : '';
        const height = options.height ? `height="${options.height}"` : '';
        const loading = options.loading ? `loading="${options.loading}"` : 'loading="lazy"';
        
        if (supportsWebP) {
            return `
                <picture ${classes}>
                    <source srcset="${webpSrc}" type="image/webp">
                    <img src="${src}" alt="${alt}" ${width} ${height} ${loading}>
                </picture>
            `;
        } else {
            return `<img src="${src}" alt="${alt}" ${classes} ${width} ${height} ${loading}>`;
        }
    }
    
    /**
     * Optimiza todas las imágenes con el atributo data-webp
     */
    static async optimizeAll() {
        const supportsWebP = await this.checkSupport();
        const images = document.querySelectorAll('img[data-webp]');
        
        images.forEach(async (img) => {
            if (supportsWebP) {
                const webpSrc = this.convertToWebP(img.src);
                img.src = webpSrc;
            }
        });
    }
}

// Exportar la clase
export default WebPSupport;
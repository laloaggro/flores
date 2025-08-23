// imageOptimizer.js - Convierte imágenes a formatos modernos como WebP

/**
 * Image Optimizer - Convierte imágenes a formatos modernos como WebP
 * para mejorar el rendimiento del sitio web
 */
class ImageOptimizer {
    /**
     * Verifica si el navegador soporta WebP
     * @returns {Promise<boolean>} - Promesa que resuelve con true si el navegador soporta WebP
     */
    static checkWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = function () {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    /**
     * Convierte una imagen a WebP
     * @param {string} src - Ruta de la imagen original
     * @param {number} quality - Calidad de la imagen WebP (0-100)
     * @returns {Promise<string>} - Promesa que resuelve con la URL de la imagen WebP
     */
    static async convertToWebP(src, quality = 80) {
        // Si ya es una URL WebP, devolverla tal cual
        if (src && src.endsWith('.webp')) {
            return src;
        }

        // Verificar soporte de WebP
        const webpSupport = await this.checkWebPSupport();
        if (!webpSupport) {
            return src; // Devolver la imagen original si no hay soporte
        }

        // Si es una imagen local, intentar convertirla
        if (src && (src.startsWith('./') || src.startsWith('/'))) {
            return src.replace(/\.(jpg|jpeg|png)/i, '.webp');
        }

        // Para otras URLs, devolver la original
        return src;
    }

    /**
     * Optimiza una imagen a AVIF si es posible
     * @param {string} src - Ruta de la imagen original
     * @returns {Promise<string>} - Promesa que resuelve con la URL de la imagen AVIF
     */
    static async convertToAVIF(src) {
        // Si ya es una URL AVIF, devolverla tal cual
        if (src && src.endsWith('.avif')) {
            return src;
        }

        // Para imágenes locales, intentar convertirlas
        if (src && (src.startsWith('./') || src.startsWith('/'))) {
            return src.replace(/\.(jpg|jpeg|png)/i, '.avif');
        }

        // Para otras URLs, devolver la original
        return src;
    }
}

export default ImageOptimizer;
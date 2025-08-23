// imageOptimizer.js - Convierte imágenes a formatos modernos como WebP

/**
 * Image Optimizer - Convierte imágenes a formatos modernos como WebP
 * para mejorar el rendimiento del sitio web
 */
class ImageOptimizer {
    /**
     * Convierte una imagen a WebP
     * @param {string} src - Ruta de la imagen original
     * @param {number} quality - Calidad de la imagen WebP (0-100)
     * @returns {Promise<string>} - Promesa que resuelve con la URL de la imagen WebP
     */
    static async convertToWebP(src, quality = 80) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    
                    // Convertir a WebP
                    const webpData = canvas.toDataURL('image/webp', quality / 100);
                    resolve(webpData);
                } catch (error) {
                    reject(error);
                }
            };
            
            img.onerror = () => {
                reject(new Error(`Failed to load image: ${src}`));
            };
            
            img.src = src;
        });
    }
    
    /**
     * Crea un elemento <picture> con múltiples formatos
     * @param {string} src - Ruta de la imagen original
     * @param {string} alt - Texto alternativo
     * @param {object} options - Opciones adicionales (clases, etc.)
     * @returns {Promise<string>} - HTML del elemento <picture>
     */
    static async createPictureElement(src, alt, options = {}) {
        try {
            // Intentar convertir a WebP
            const webpSrc = await this.convertToWebP(src);
            
            // Crear elemento <picture>
            const classes = options.classes ? `class="${options.classes}"` : '';
            const width = options.width ? `width="${options.width}"` : '';
            const height = options.height ? `height="${options.height}"` : '';
            
            return `
                <picture ${classes}>
                    <source srcset="${webpSrc}" type="image/webp">
                    <img src="${src}" alt="${alt}" ${width} ${height} loading="lazy">
                </picture>
            `;
        } catch (error) {
            // Si falla la conversión, usar solo el elemento <img>
            const classes = options.classes ? `class="${options.classes}"` : '';
            const width = options.width ? `width="${options.width}"` : '';
            const height = options.height ? `height="${options.height}"` : '';
            
            return `<img src="${src}" alt="${alt}" ${classes} ${width} ${height} loading="lazy">`;
        }
    }
    
    /**
     * Optimiza todas las imágenes con el atributo data-optimize
     */
    static optimizeAll() {
        const images = document.querySelectorAll('img[data-optimize]');
        
        images.forEach(async (img) => {
            try {
                const webpSrc = await this.convertToWebP(img.src);
                const source = document.createElement('source');
                source.srcset = webpSrc;
                source.type = 'image/webp';
                
                const picture = document.createElement('picture');
                picture.appendChild(source);
                
                // Clonar la imagen original
                const imgClone = img.cloneNode(true);
                picture.appendChild(imgClone);
                
                // Reemplazar la imagen original con el elemento <picture>
                img.parentNode.replaceChild(picture, img);
            } catch (error) {
                console.warn('Failed to optimize image:', img.src, error);
            }
        });
    }
}

// Exportar la clase
export default ImageOptimizer;
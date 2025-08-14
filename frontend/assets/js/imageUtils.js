// imageUtils.js - Utilidades para optimización de imágenes

/**
 * Crear un elemento de imagen responsivo con carga diferida y formato WebP
 * @param {string} src - URL de la imagen original
 * @param {string} alt - Texto alternativo
 * @param {object} options - Opciones adicionales (clases, etc.)
 * @returns {string} - HTML del elemento de imagen optimizado
 */
function createResponsiveImage(src, alt, options = {}) {
  const {
    classes = '',
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    loading = 'lazy'
  } = options;

  // Generar URLs para diferentes formatos
  const webpSrc = src.replace(/\.(jpg|jpeg|png)/i, '.webp');
  const avifSrc = src.replace(/\.(jpg|jpeg|png)/i, '.avif');
  
  return `
    <picture>
      <source srcset="${avifSrc}" type="image/avif">
      <source srcset="${webpSrc}" type="image/webp">
      <img 
        src="${src}" 
        alt="${alt}"
        class="${classes}"
        loading="${loading}"
        sizes="${sizes}"
        width="800"
        height="600"
        onerror="handleImageError(this)"
      >
    </picture>
  `;
}

/**
 * Manejar errores de carga de imágenes
 * @param {HTMLImageElement} imgElement - Elemento de imagen
 */
function handleImageError(imgElement) {
  console.warn('Error al cargar imagen:', imgElement.src);
  
  // Intentar con una imagen de respaldo verificada
  const fallbackImages = [
    '/assets/images/products/product_2.jpg',
    '/assets/images/products/product_1.jpg',
    '/assets/images/products/product_3.jpg'
  ];
  
  // Encontrar una imagen de respaldo que no sea la que falló
  const workingFallback = fallbackImages.find(img => img !== imgElement.src);
  
  if (workingFallback) {
    imgElement.src = workingFallback;
  } else {
    // Fallback absoluto
    imgElement.src = '/assets/images/default-avatar.svg';
  }
  
  // Añadir atributo aria-label para indicar que la imagen no se pudo cargar
  imgElement.setAttribute('aria-label', 'Imagen no disponible');
}

/**
 * Cargar imágenes con Intersection Observer para carga diferida
 */
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

export { createResponsiveImage, handleImageError, initLazyLoading };
// imageUtils.js - Utilidades para optimización de imágenes

/**
 * Crear un elemento de imagen responsivo con carga diferida y múltiples formatos
 * @param {string} src - URL de la imagen original
 * @param {string} alt - Texto alternativo
 * @param {object} options - Opciones adicionales (clases, etc.)
 * @returns {string} - HTML del elemento de imagen optimizado
 */
function createResponsiveImage(src, alt, options = {}) {
  const {
    classes = '',
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    loading = 'lazy',
    role = 'img'
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
        decoding="async"
        fetchpriority="auto"
        role="${role}"
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
  
  // Asegurar que la imagen tenga dimensiones adecuadas
  imgElement.style.objectFit = 'contain';
  imgElement.style.backgroundColor = '#e9ecef';
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
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
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

/**
 * Precargar imagen crítica
 * @param {string} src - URL de la imagen
 * @returns {Promise} - Promesa que se resuelve cuando la imagen se carga
 */
function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Optimizar imágenes para diferentes densidades de pantalla
 * @param {string} baseSrc - URL base de la imagen
 * @param {string} alt - Texto alternativo
 * @param {object} options - Opciones adicionales
 * @returns {string} - HTML del elemento de imagen responsivo
 */
function createDensityOptimizedImage(baseSrc, alt, options = {}) {
  const {
    classes = '',
    loading = 'lazy'
  } = options;
  
  // Generar URLs para diferentes densidades
  const src1x = baseSrc;
  const src2x = baseSrc.replace(/(\.[^.]+)$/, '@2x$1');
  const src3x = baseSrc.replace(/(\.[^.]+)$/, '@3x$1');
  
  // Generar URLs para diferentes formatos
  const webp1x = src1x.replace(/\.(jpg|jpeg|png)/i, '.webp');
  const webp2x = src2x.replace(/\.(jpg|jpeg|png)/i, '.webp');
  const webp3x = src3x.replace(/\.(jpg|jpeg|png)/i, '.webp');
  
  const avif1x = src1x.replace(/\.(jpg|jpeg|png)/i, '.avif');
  const avif2x = src2x.replace(/\.(jpg|jpeg|png)/i, '.avif');
  const avif3x = src3x.replace(/\.(jpg|jpeg|png)/i, '.avif');
  
  return `
    <picture>
      <source srcset="${avif1x}, ${avif2x} 2x, ${avif3x} 3x" type="image/avif">
      <source srcset="${webp1x}, ${webp2x} 2x, ${webp3x} 3x" type="image/webp">
      <source srcset="${src1x}, ${src2x} 2x, ${src3x} 3x" type="image/jpeg">
      <img 
        src="${src1x}" 
        alt="${alt}"
        class="${classes}"
        loading="${loading}"
        width="800"
        height="600"
        decoding="async"
        fetchpriority="auto"
        onerror="handleImageError(this)"
      >
    </picture>
  `;
}

export { 
  createResponsiveImage, 
  handleImageError, 
  initLazyLoading,
  preloadImage,
  createDensityOptimizedImage
};
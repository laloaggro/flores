/**
 * imageOptimizer.js - Componente para manejo de imágenes optimizadas
 * 
 * Este componente ayuda a cargar imágenes optimizadas y responsivas,
 * incluyendo formatos modernos como WebP cuando están disponibles.
 */

/**
 * Obtener la ruta de una imagen optimizada
 * @param {string} imagePath - Ruta original de la imagen
 * @param {string} size - Tamaño deseado (thumbnail, small, medium, large)
 * @returns {string} Ruta de la imagen optimizada
 */
function getOptimizedImagePath(imagePath, size = 'medium') {
  // Si ya es una imagen optimizada, devolverla tal cual
  if (imagePath.includes('/optimized/')) {
    return imagePath;
  }
  
  // Obtener el nombre del archivo y la extensión
  const pathParts = imagePath.split('/');
  const fileName = pathParts[pathParts.length - 1];
  const fileNameWithoutExt = fileName.split('.').slice(0, -1).join('.');
  const ext = fileName.split('.').pop();
  
  // Construir la ruta de la imagen optimizada
  const basePath = imagePath.replace(fileName, '');
  const optimizedPath = `${basePath}optimized/${fileNameWithoutExt}-${size}.${ext}`;
  
  return optimizedPath;
}

/**
 * Obtener la ruta de una imagen en formato WebP
 * @param {string} imagePath - Ruta original de la imagen
 * @returns {string} Ruta de la imagen en WebP
 */
function getWebPImagePath(imagePath) {
  // Si ya es WebP, devolverla tal cual
  if (imagePath.endsWith('.webp')) {
    return imagePath;
  }
  
  // Obtener el nombre del archivo
  const pathParts = imagePath.split('/');
  const fileName = pathParts[pathParts.length - 1];
  const fileNameWithoutExt = fileName.split('.').slice(0, -1).join('.');
  
  // Construir la ruta de la imagen WebP
  const basePath = imagePath.replace(fileName, '');
  const webpPath = `${basePath}optimized/${fileNameWithoutExt}.webp`;
  
  return webpPath;
}

/**
 * Crear un elemento de imagen responsivo
 * @param {string} src - Ruta de la imagen original
 * @param {string} alt - Texto alternativo
 * @param {Object} options - Opciones adicionales
 * @returns {HTMLPictureElement} Elemento picture con fuentes responsivas
 */
function createResponsiveImage(src, alt, options = {}) {
  // Crear elemento picture
  const picture = document.createElement('picture');
  
  // Opciones por defecto
  const defaultOptions = {
    sizes: '(max-width: 768px) 100vw, 50vw',
    lazy: true,
    className: '',
    ...options
  };
  
  // Crear source para WebP
  const webpSource = document.createElement('source');
  webpSource.srcset = `
    ${getWebPImagePath(src)} 1x,
    ${getWebPImagePath(getOptimizedImagePath(src, 'large'))} 2x
  `;
  webpSource.type = 'image/webp';
  picture.appendChild(webpSource);
  
  // Crear source para formato original
  const originalSource = document.createElement('source');
  originalSource.srcset = `
    ${getOptimizedImagePath(src, 'medium')} 1x,
    ${getOptimizedImagePath(src, 'large')} 2x
  `;
  originalSource.type = `image/${src.split('.').pop()}`;
  picture.appendChild(originalSource);
  
  // Crear imagen principal
  const img = document.createElement('img');
  img.src = getOptimizedImagePath(src, 'medium');
  img.alt = alt;
  
  // Añadir atributos
  img.sizes = defaultOptions.sizes;
  
  if (defaultOptions.lazy) {
    img.loading = 'lazy';
  }
  
  if (defaultOptions.className) {
    img.className = defaultOptions.className;
  }
  
  picture.appendChild(img);
  
  return picture;
}

/**
 * Cargar imagen con fallback
 * @param {string} src - Ruta de la imagen
 * @param {string} fallbackSrc - Ruta de la imagen de respaldo
 * @returns {Promise<HTMLImageElement>} Promesa que resuelve con la imagen cargada
 */
function loadImageWithFallback(src, fallbackSrc) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => resolve(img);
    img.onerror = () => {
      if (fallbackSrc && fallbackSrc !== src) {
        // Intentar cargar la imagen de respaldo
        img.src = fallbackSrc;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('No se pudo cargar la imagen'));
      } else {
        reject(new Error('No se pudo cargar la imagen'));
      }
    };
    
    img.src = src;
  });
}

/**
 * Preconectar a un dominio de CDN
 * @param {string} cdnUrl - URL del CDN
 */
function preconnectToCDN(cdnUrl) {
  // Verificar si ya existe el link de preconexión
  const existingLink = document.querySelector(`link[rel="preconnect"][href="${cdnUrl}"]`);
  if (existingLink) return;
  
  // Crear el link de preconexión
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = cdnUrl;
  
  // Añadir al head
  document.head.appendChild(link);
}

// Exportar funciones
export {
  getOptimizedImagePath,
  getWebPImagePath,
  createResponsiveImage,
  loadImageWithFallback,
  preconnectToCDN
};
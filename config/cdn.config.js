/**
 * cdn.config.js - Configuración de CDN para el proyecto
 * 
 * Este archivo contiene la configuración para integrar un CDN
 * con el sitio web de Arreglos Victoria.
 */

// Configuración de CDN
const cdnConfig = {
  // URL base del CDN (ejemplo con Cloudflare)
  baseUrl: process.env.CDN_BASE_URL || 'https://cdn.arreglosvictoria.cl',
  
  // Directorios en el CDN
  paths: {
    images: '/images',
    css: '/css',
    js: '/js',
    fonts: '/fonts'
  },
  
  // Formatos de imagen optimizados
  imageFormats: {
    webp: true,
    avif: true
  },
  
  // Tamaños de imagen predefinidos
  imageSizes: {
    thumbnail: '150x150',
    small: '300x300',
    medium: '600x600',
    large: '1200x1200'
  },
  
  // Compresión de recursos
  compression: {
    css: true,
    js: true
  },
  
  // Tiempo de cache
  cache: {
    images: '1y',
    css: '1w',
    js: '1w',
    fonts: '1y'
  }
};

/**
 * Obtener la URL completa de un recurso en el CDN
 * @param {string} resourceType - Tipo de recurso (images, css, js, fonts)
 * @param {string} resourcePath - Ruta del recurso
 * @returns {string} URL completa del recurso en el CDN
 */
function getCdnUrl(resourceType, resourcePath) {
  // Verificar si el tipo de recurso es válido
  if (!cdnConfig.paths[resourceType]) {
    throw new Error(`Tipo de recurso no válido: ${resourceType}`);
  }
  
  // Construir la URL
  const basePath = cdnConfig.paths[resourceType];
  const fullPath = `${basePath}${resourcePath}`;
  
  // Eliminar dobles barras
  const cleanPath = fullPath.replace(/\/+/g, '/');
  
  return `${cdnConfig.baseUrl}${cleanPath}`;
}

/**
 * Obtener la URL de una imagen optimizada
 * @param {string} imagePath - Ruta de la imagen
 * @param {string} size - Tamaño de la imagen
 * @param {string} format - Formato de la imagen (jpg, png, webp, avif)
 * @returns {string} URL de la imagen optimizada
 */
function getOptimizedImageUrl(imagePath, size = 'medium', format = 'webp') {
  // Obtener la extensión del archivo
  const ext = imagePath.split('.').pop();
  
  // Construir la ruta de la imagen optimizada
  const optimizedPath = imagePath
    .replace(`.${ext}`, `-${size}.${format}`);
  
  return getCdnUrl('images', optimizedPath);
}

/**
 * Preconectar a los dominios del CDN
 */
function preconnectToCdn() {
  // Verificar si ya existen los links de preconexión
  const existingPreconnect = document.querySelector(`link[rel="preconnect"][href="${cdnConfig.baseUrl}"]`);
  if (existingPreconnect) return;
  
  // Crear el link de preconexión
  const preconnectLink = document.createElement('link');
  preconnectLink.rel = 'preconnect';
  preconnectLink.href = cdnConfig.baseUrl;
  preconnectLink.crossOrigin = 'anonymous';
  
  // Añadir al head
  document.head.appendChild(preconnectLink);
  
  // Crear el link de prefetch
  const prefetchLink = document.createElement('link');
  prefetchLink.rel = 'dns-prefetch';
  prefetchLink.href = cdnConfig.baseUrl;
  
  // Añadir al head
  document.head.appendChild(prefetchLink);
}

// Exportar configuración y funciones
export {
  cdnConfig,
  getCdnUrl,
  getOptimizedImageUrl,
  preconnectToCdn
};

export default cdnConfig;
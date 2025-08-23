import productManager from '../assets/js/productManager.js';
import CartUtils from '../assets/js/cartUtils.js';
import { ImageOptimizer } from '../assets/js/imageOptimizer.js';

// Componente para una tarjeta de producto individual
const ProductCard = async (product) => {
  // Generar URLs para diferentes formatos de imagen
  let imageUrl = product.image || product.image_url || './assets/images/placeholder.svg';
  
  // Intentar optimizar la imagen a WebP si es posible
  try {
    if (product.image || product.image_url) {
      const webpSupport = await ImageOptimizer.checkWebPSupport();
      if (webpSupport) {
        const webpUrl = product.image_url ? 
          product.image_url.replace(/\.(jpg|jpeg|png)/i, '.webp') : 
          product.image.replace(/\.(jpg|jpeg|png)/i, '.webp');
        imageUrl = webpUrl;
      }
    }
  } catch (error) {
    console.warn('No se pudo optimizar la imagen a WebP:', error);
  }
  
  // Imagen por defecto si no hay imagen válida
  const defaultImage = './assets/images/placeholder.svg';
  const finalImageUrl = imageUrl || defaultImage;
  
  return `
    <article class="product-card" itemscope itemtype="http://schema.org/Product" tabindex="0" role="article" aria-labelledby="product-name-${product.id}">
      <div class="product-image">
        <picture>
          <source srcset="${finalImageUrl}" type="image/webp">
          <img src="${finalImageUrl}" 
               alt="${product.name || 'Producto sin nombre'}" 
               loading="lazy" 
               itemprop="image"
               width="300"
               height="200"
               decoding="async"
               fetchpriority="auto"
               onerror="this.onerror=null;this.src='${defaultImage}';this.setAttribute('aria-label', 'Imagen no disponible');">
        </picture>
        <button class="add-to-cart" 
                data-id="${product.id || ''}" 
                data-name="${product.name || 'Producto sin nombre'}" 
                data-price="${product.price || 0}"
                data-image="${finalImageUrl}"
                aria-label="Agregar ${product.name || 'producto'} al carrito"
                role="button"
                tabindex="0">
          <i class="fas fa-shopping-cart" aria-hidden="true"></i> Agregar
        </button>
      </div>
      <div class="product-info">
        <h3 id="product-name-${product.id}" itemprop="name">${product.name || 'Producto sin nombre'}</h3>
        <p itemprop="description">${product.description || 'Sin descripción disponible'}</p>
        <div class="product-details">
          <span class="detail-item" itemprop="category"><i class="fas fa-tag" aria-hidden="true"></i> ${product.category || 'Sin categoría'}</span>
          <span class="detail-item"><i class="fas fa-calendar-alt" aria-hidden="true"></i> ${product.created_at ? new Date(product.created_at).toLocaleDateString('es-CL') : 'Fecha no disponible'}</span>
        </div>
        <span class="price" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
          <span itemprop="price" content="${product.price || 0}">$${parseInt(product.price || 0).toLocaleString('es-CL')}</span>
          <meta itemprop="priceCurrency" content="CLP">
        </span>
      </div>
      <div class="product-card-notification" id="notification-${product.id}" style="display: none; margin-top: 10px; padding: 5px; background-color: #48bb78; color: white; border-radius: 4px; font-size: 0.8rem;">
        ¡Agregado al carrito!
      </div>
    </article>
  `;
};

// Función para manejar errores de carga de imágenes
export default ProductCard;
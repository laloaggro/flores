import productManager from '../../assets/js/productManager.js';
import CartUtils from '../../assets/js/cartUtils.js';

// Componente para una tarjeta de producto individual
const ProductCard = (product) => {
  // Generar URLs para diferentes formatos de imagen
  const webpSrc = product.image_url ? product.image_url.replace(/\.(jpg|jpeg|png)/i, '.webp') : '';
  const avifSrc = product.image_url ? product.image_url.replace(/\.(jpg|jpeg|png)/i, '.avif') : '';
  
  // Imagen por defecto si no hay imagen válida
  const defaultImage = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'200\' viewBox=\'0 0 300 200\'%3E%3Crect width=\'300\' height=\'200\' fill=\'%23f0f0f0\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' font-family=\'Arial\' font-size=\'20\' fill=\'%23999\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3EImagen%3C/text%3E%3Ctext x=\'50%25\' y=\'65%25\' font-family=\'Arial\' font-size=\'16\' fill=\'%23999\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3ENo disponible%3C/text%3E%3C/svg%3E';
  const imageUrl = product.image_url || defaultImage;
  
  return `
    <article class="product-card" itemscope itemtype="http://schema.org/Product" tabindex="0" role="article" aria-labelledby="product-name-${product.id}">
      <div class="product-image">
        <picture>
          ${avifSrc ? `<source srcset="${avifSrc}" type="image/avif">` : ''}
          ${webpSrc ? `<source srcset="${webpSrc}" type="image/webp">` : ''}
          <img src="${imageUrl}" 
               alt="${product.name || 'Producto sin nombre'}" 
               loading="lazy" 
               itemprop="image"
               width="300"
               height="200"
               decoding="async"
               fetchpriority="auto"
               onerror="this.onerror=null;this.src='${defaultImage}';this.setAttribute('aria-label', 'Imagen no disponible');">
        </picture>
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
        <button class="btn btn-secondary add-to-cart" 
                data-id="${product.id || ''}" 
                data-name="${product.name || 'Producto sin nombre'}" 
                data-price="${product.price || 0}"
                data-image="${imageUrl}"
                aria-label="Agregar ${product.name || 'producto'} al carrito"
                role="button"
                tabindex="0">
          <i class="fas fa-shopping-cart" aria-hidden="true"></i> Agregar
        </button>
        <div class="product-card-notification" id="notification-${product.id}" style="display: none; margin-top: 10px; padding: 5px; background-color: #48bb78; color: white; border-radius: 4px; font-size: 0.8rem;">
          ¡Agregado al carrito!
        </div>
      </div>
    </article>
  `;
};

// Función para manejar errores de carga de imágenes
export default ProductCard;
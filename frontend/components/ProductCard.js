import productManager from '../../assets/js/productManager.js';
import CartUtils from '../../assets/js/cartUtils.js';

// Componente para una tarjeta de producto individual
const ProductCard = (product) => {
  // Generar URLs para diferentes formatos de imagen
  const webpSrc = product.image_url.replace(/\.(jpg|jpeg|png)/i, '.webp');
  const avifSrc = product.image_url.replace(/\.(jpg|jpeg|png)/i, '.avif');
  
  return `
    <article class="product-card" itemscope itemtype="http://schema.org/Product" tabindex="0" role="article" aria-labelledby="product-name-${product.id}">
      <div class="product-image">
        <picture>
          <source srcset="${avifSrc}" type="image/avif">
          <source srcset="${webpSrc}" type="image/webp">
          <img src="${product.image_url}" 
               alt="${product.name}" 
               loading="lazy" 
               itemprop="image"
               width="300"
               height="200"
               decoding="async"
               fetchpriority="auto"
               onerror="this.onerror=null;this.src='/assets/images/default-avatar.svg';this.setAttribute('aria-label', 'Imagen no disponible');">
        </picture>
      </div>
      <div class="product-info">
        <h3 id="product-name-${product.id}" itemprop="name">${product.name}</h3>
        <p itemprop="description">${product.description}</p>
        <div class="product-details">
          <span class="detail-item" itemprop="category"><i class="fas fa-tag" aria-hidden="true"></i> ${product.category}</span>
          <span class="detail-item"><i class="fas fa-calendar-alt" aria-hidden="true"></i> ${new Date(product.created_at).toLocaleDateString('es-CL')}</span>
        </div>
        <span class="price" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
          <span itemprop="price" content="${product.price}">$${parseInt(product.price).toLocaleString('es-CL')}</span>
          <meta itemprop="priceCurrency" content="CLP">
        </span>
        <button class="btn btn-secondary add-to-cart" 
                data-id="${product.id}" 
                data-name="${product.name}" 
                data-price="${product.price}"
                data-image="${product.image_url}"
                aria-label="Agregar ${product.name} al carrito"
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
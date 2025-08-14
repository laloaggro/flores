import productManager from '../../assets/js/productManager.js';
import CartUtils from '../../assets/js/cartUtils.js';

// Componente para una tarjeta de producto individual
const ProductCard = (product) => {
  return `
    <article class="product-card" itemscope itemtype="http://schema.org/Product">
      <div class="product-image">
        <picture>
          <source srcset="${product.image_url.replace(/\.(jpg|jpeg|png)/i, '.webp')}" type="image/webp">
          <img src="${product.image_url}" 
               alt="${product.name}" 
               loading="lazy" 
               itemprop="image"
               width="300"
               height="200"
               onerror="this.onerror=null;this.src='/assets/images/default-avatar.svg';this.setAttribute('aria-label', 'Imagen no disponible');">
        </picture>
      <div class="product-info">
        <h3 itemprop="name">${product.name}</h3>
        <p itemprop="description">${product.description}</p>
        <div class="product-details">
          <span class="detail-item" itemprop="category"><i class="fas fa-tag"></i> ${product.category}</span>
          <span class="detail-item"><i class="fas fa-calendar-alt"></i> ${new Date(product.created_at).toLocaleDateString('es-CL')}</span>
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
                aria-label="Agregar ${product.name} al carrito">
          <i class="fas fa-shopping-cart" aria-hidden="true"></i> Agregar
        </button>
      </div>
    </article>
  `;
};

// Función para manejar errores de carga de imágenes
export default ProductCard;

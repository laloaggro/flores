import productManager from '../../assets/js/productManager.js';
import CartUtils from '../../assets/js/cartUtils.js';

// Componente para una tarjeta de producto individual
const ProductCard = (product) => {
  // Generar URLs para diferentes formatos de imagen
  const webpSrc = product.image_url ? product.image_url.replace(/\.(jpg|jpeg|png)/i, '.webp') : '';
  const avifSrc = product.image_url ? product.image_url.replace(/\.(jpg|jpeg|png)/i, '.avif') : '';
  
  // Imagen por defecto si no hay imagen válida
  const defaultImage = './assets/images/placeholder.svg';
  let imageUrl = product.image_url || product.image || defaultImage;
  
  // Asegurarse de que la ruta de la imagen sea correcta
  if (imageUrl.startsWith('/assets/images/')) {
    imageUrl = `.${imageUrl}`;
  } else if (imageUrl.startsWith('assets/images/')) {
    imageUrl = `./${imageUrl}`;
  } else if (!imageUrl.startsWith('./assets/images/') && !imageUrl.startsWith('http')) {
    // Si la imagen no es una URL completa ni una ruta relativa correcta, usar el placeholder
    imageUrl = './assets/images/placeholder.svg';
  }
  
  // Crear srcset para imágenes responsivas
  const srcset = product.image_url 
    ? `${product.image_url}?w=300 300w, ${product.image_url}?w=600 600w, ${product.image_url}?w=900 900w`
    : '';
  
  // Traducir categoría si es necesario
  const translateCategory = (category) => {
    const categories = {
      'ramos': 'Ramos',
      'arreglos': 'Arreglos',
      'coronas': 'Coronas',
      'insumos': 'Insumos',
      'accesorios': 'Accesorios',
      'condolencias': 'Condolencias',
      'jardinería': 'Jardinería'
    };
    return categories[category.toLowerCase()] || category;
  };
  
  const categoryName = translateCategory(product.category || 'Sin categoría');

  return `
    <article class="product-card" itemscope itemtype="http://schema.org/Product" tabindex="0" role="article" aria-labelledby="product-name-${product.id}">
      <div class="product-image" style="padding: 1rem;">
        <picture>
          ${avifSrc ? `<source srcset="${avifSrc}" type="image/avif">` : ''}
          ${webpSrc ? `<source srcset="${webpSrc}" type="image/webp">` : ''}
          <img src="${imageUrl}" 
               srcset="${srcset}"
               sizes="(max-width: 600px) 300px, (max-width: 900px) 600px, 900px"
               alt="${product.name || 'Producto sin nombre'}" 
               loading="lazy" 
               itemprop="image"
               width="300"
               height="300"
               decoding="async"
               fetchpriority="auto"
               onerror="this.onerror=null;this.src='${defaultImage}';"
               style="width: 100%; height: 100%; object-fit: cover;">
        </picture>
      </div>
      <div class="product-info">
        <h3 id="product-name-${product.id}" itemprop="name">${product.name || 'Producto sin nombre'}</h3>
        <p itemprop="description">${product.description || 'Sin descripción disponible'}</p>
        <div class="product-details">
          <span class="detail-item" itemprop="category"><i class="fas fa-tag" aria-hidden="true"></i> ${categoryName}</span>
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
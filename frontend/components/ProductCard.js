import productManager from '../../assets/js/productManager.js';
import CartUtils from '../../assets/js/cartUtils.js';

// Componente para una tarjeta de producto individual
const ProductCard = (product) => {
  return `
    <article class="product-card" itemscope itemtype="http://schema.org/Product">
      <div class="product-image">
        <img src="${product.image_url}" 
             alt="${product.name}" 
             loading="lazy" 
             itemprop="image"
             onerror="handleImageError(this)">
      </div>
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

export default ProductCard;

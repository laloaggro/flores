import productManager from '../../assets/js/productManager.js';
import CartUtils from '../../assets/js/cartUtils.js';

// Componente para una tarjeta de producto individual
const ProductCard = (product) => {
  return `
    <div class="product-card fade-in">
      <div class="product-image">
        <img src="${product.image_url}" alt="${product.name}" loading="lazy" onerror="handleImageError(this)">
        <div class="product-badge">
          ${product.category}
        </div>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-details">
          <span class="detail-item"><i class="fas fa-tag"></i> ${product.category}</span>
          <span class="detail-item"><i class="fas fa-calendar-alt"></i> ${new Date(product.created_at).toLocaleDateString('es-CL')}</span>
        </div>
        <span class="price">$${parseInt(product.price).toLocaleString('es-CL')}</span>
        <button class="btn btn-secondary add-to-cart" 
                data-id="${product.id}" 
                data-name="${product.name}" 
                data-price="${product.price}"
                data-image="${product.image_url}">
          <i class="fas fa-shopping-cart"></i> Agregar al carrito
        </button>
      </div>
    </div>
  `;
};

// Función para manejar errores de carga de imágenes
function handleImageError(imgElement) {
  console.warn('Error al cargar imagen:', imgElement.src);
  
  // Intentar con una imagen de respaldo verificada
  const fallbackImages = [
    '/assets/images/products/product_2.jpg',
    '/assets/images/products/product_1.jpg',
    '/assets/images/products/product_3.jpg',
    '/assets/images/products/product_4.jpg',
    '/assets/images/products/product_5.jpg',
    '/assets/images/products/product_10.svg',
    '/assets/images/products/product_6.svg',
    '/assets/images/products/product_7.svg',
    '/assets/images/products/product_8.svg',
    '/assets/images/products/product_9.svg'
  ];
  
  // Filtrar imágenes que no sean las que ya fallaron y que probablemente existan
  const workingFallback = fallbackImages.find(img => {
    // Verificar que no sea la imagen que ya falló
    if (img === imgElement.src) return false;
    
    // Verificar que la imagen tenga una extensión válida
    return img.endsWith('.jpg') || img.endsWith('.svg');
  });
  
  if (workingFallback) {
    imgElement.src = workingFallback;
  } else {
    // Fallback absoluto
    imgElement.src = '/assets/images/default-avatar.svg';
  }
  
  imgElement.alt = 'Imagen no disponible';
  imgElement.onerror = null; // Prevenir bucle infinito si también falla la imagen de marcador de posición
}

// Delegación de eventos para los botones de "Agregar al carrito"
document.addEventListener('click', function(e) {
  if (e.target.closest('.add-to-cart')) {
    const button = e.target.closest('.add-to-cart');
    const product = {
      id: button.dataset.id,
      name: button.dataset.name,
      price: parseFloat(button.dataset.price),
      image: button.dataset.image
    };
    
    // Agregar al carrito
    CartUtils.addToCart(product);
    
    // Actualizar contador del carrito
    CartUtils.updateCartCount();
    
    // Mostrar notificación
    CartUtils.showNotification(`${product.name} agregado al carrito`, 'success');
    
    // Agregar efecto visual al botón
    button.classList.add('pulse-animation');
    setTimeout(() => {
      button.classList.remove('pulse-animation');
    }, 2000);
  }
});

export { ProductCard, handleImageError };
export default ProductCard;
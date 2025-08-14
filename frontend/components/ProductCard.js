import productManager from '../../assets/js/productManager.js';
import CartUtils from '../../assets/js/cartUtils.js';
import { loadImageWithProxy } from '../assets/js/utils.js';

// Componente para una tarjeta de producto individual
const ProductCard = (product) => {
  // Función para manejar errores de carga de imágenes
  const handleImageError = (imgElement) => {
    // Intentar con una imagen de respaldo verificada
    const fallbackImages = [
      '/assets/images/flowers/flower1.svg',
      '/assets/images/flowers/flower2.svg',
      '/assets/images/flowers/flower3.svg',
      '/assets/images/flowers/flower4.svg',
      '/assets/images/flowers/flower5.svg'
    ];
    
    // Encontrar una imagen de respaldo que no sea la que falló
    const workingFallback = fallbackImages.find(img => img !== imgElement.src);
    
    if (workingFallback) {
      imgElement.src = workingFallback;
    } else {
      // Fallback absoluto
      imgElement.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"%3E%3Crect width="300" height="300" fill="%23e0e0e0"/%3E%3Ccircle cx="150" cy="150" r="80" fill="%23a5d6a7"/%3E%3Ccircle cx="110" cy="120" r="15" fill="%234caf50"/%3E%3Ccircle cx="190" cy="120" r="15" fill="%234caf50"/%3E%3Cpath d="M150 170 Q170 200 150 230 Q130 200 150 170" fill="%234caf50"/%3E%3C/svg%3E';
    }
    
    imgElement.alt = 'Imagen no disponible';
    imgElement.onerror = null; // Prevenir bucle infinito si también falla la imagen de marcador de posición
  };

  // Usar el proxy de imágenes para cargar la imagen
  const imageUrl = loadImageWithProxy(product.image_url);

  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-image">
        <img src="${imageUrl}" 
             alt="${product.name}" 
             loading="lazy" 
             onerror="this.src='/assets/images/flowers/flower1.svg'; this.onerror=null;">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-details">
          <span class="detail-item"><i class="fas fa-tag"></i> ${product.category}</span>
          <span class="detail-item"><i class="fas fa-ruler-combined"></i> ${product.size || 'Tamaño estándar'}</span>
        </div>
        <span class="price">$${parseFloat(product.price).toLocaleString('es-CL')}</span>
        <button class="btn btn-secondary add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${imageUrl}">
          <i class="fas fa-shopping-cart"></i> Agregar
        </button>
      </div>
    </div>
  `;
};


// Delegación de eventos para los botones de "Agregar al carrito"
document.addEventListener('click', function(e) {
  if (e.target.closest('.add-to-cart')) {
    const button = e.target.closest('.add-to-cart');
    const product = {
      id: button.dataset.id,
      name: button.dataset.name,
      price: button.dataset.price,
      image: button.dataset.image
    };
    
    CartUtils.addToCart(product);
    
    // Mostrar notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-check-circle"></i>
        <span>${product.name} agregado al carrito</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Eliminar notificación después de 3 segundos
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
});

export default ProductCard;
import productManager from '../assets/js/productManager.js';
import CartUtils from '../assets/js/cartUtils.js';

// Componente para una tarjeta de producto individual
const ProductCard = (product) => {
  return `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.image_url}" alt="${product.name}" loading="lazy">
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
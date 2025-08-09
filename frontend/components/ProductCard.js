import productManager from '../assets/js/productManager.js';

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

export default ProductCard;
// Productos de ejemplo - En una aplicación real, estos datos vendrían de una API
const products = [
  {
    id: 1,
    name: "Ramo de Rosas Rojas",
    description: "Hermoso ramo de 12 rosas rojas frescas, ideal para ocasiones especiales",
    price: 15000,
    image: "https://images.unsplash.com/photo-1597221335472-6f87484f8b8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "ramos"
  },
  {
    id: 2,
    name: "Orquídea Blanca",
    description: "Elegante orquídea blanca en maceta decorativa",
    price: 12000,
    image: "https://images.unsplash.com/photo-1582081732673-0e1fd9b2398e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "plantas"
  },
  {
    id: 3,
    name: "Arreglo de Girasoles",
    description: "Vibrante arreglo de girasoles frescos que ilumina cualquier espacio",
    price: 18000,
    image: "https://images.unsplash.com/photo-1511002208436-974ba13aa1a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "arreglos"
  },
  {
    id: 4,
    name: "Ramo de Tulipanes",
    description: "Colorido ramo de tulipanes frescos, perfecto para cualquier ocasión",
    price: 14000,
    image: "https://images.unsplash.com/photo-1517632233540-81b947103b7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "ramos"
  },
  {
    id: 5,
    name: "Cesta de Frutas y Flores",
    description: "Encantadora combinación de flores frescas y frutas de temporada",
    price: 22000,
    image: "https://images.unsplash.com/photo-1595007859182-330e4f768b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "arreglos"
  },
  {
    id: 6,
    name: "Lirios Blancos",
    description: "Elegantes lirios blancos en un hermoso arreglo",
    price: 16000,
    image: "https://images.unsplash.com/photo-1599840589059-0667109819a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "arreglos"
  }
];

/**
 * Componente de productos
 */
class Products extends HTMLElement {
  /**
   * Se ejecuta cuando el elemento se conecta al DOM
   * Renderiza la lista de productos
   */
  connectedCallback() {
    // Verificar si ya se ha renderizado el contenido
    if (this.hasAttribute('rendered')) {
      return;
    }

    // Marcar como renderizado
    this.setAttribute('rendered', '');

    // Renderizar el contenido
    this.innerHTML = `
      <section class="products-section">
        <div class="container">
          <h2 class="section-title">Nuestros Productos</h2>
          <div class="products-grid" id="productsGrid">
            ${products.map(product => this.renderProductCard(product)).join('')}
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Renderiza una tarjeta de producto
   * @param {Object} product - Información del producto
   * @returns {string} HTML de la tarjeta de producto
   */
  renderProductCard(product) {
    return `
      <div class="product-card">
        <div class="product-image">
          <img 
            src="${product.image}" 
            alt="${product.name}" 
            loading="lazy" 
            width="300" 
            height="200"
            onerror="this.src='assets/images/placeholder.svg'; this.onerror=null;">
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-price">$${parseInt(product.price).toLocaleString('es-CL')}</div>
          <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
            <i class="fas fa-shopping-cart"></i> Agregar al carrito
          </button>
        </div>
      </div>
    `;
  }
}

// Registrar el componente personalizado
customElements.define('products-component', Products);
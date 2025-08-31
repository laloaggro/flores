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
  connectedCallback() {
    this.innerHTML = `
      <section class="products">
        <div class="container">
          <h2 class="section-title">Nuestros Productos</h2>
          <div class="products-grid" id="productsGrid">
            <!-- Las tarjetas de productos se generarán dinámicamente -->
          </div>
        </div>
      </section>
    `;
    
    // Cargar productos y renderizarlos
    this.loadProducts();
  }
  
  /**
   * Carga los productos y los renderiza
   */
  loadProducts() {
    // En una aplicación real, estos datos vendrían de una API
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
    
    const productsGrid = this.querySelector('#productsGrid');
    productsGrid.innerHTML = products.map(product => this.renderProductCard(product)).join('');
  }
  
  /**
   * Renderiza una tarjeta de producto
   * @param {Object} product - Información del producto
   * @returns {string} HTML de la tarjeta de producto
   */
  renderProductCard(product) {
    // Asegurarse de que la ruta de la imagen sea correcta
    let imageUrl = product.image || './assets/images/placeholder.svg';
    if (imageUrl.startsWith('/assets/images/')) {
      imageUrl = `.${imageUrl}`;
    } else if (imageUrl.startsWith('assets/images/')) {
      imageUrl = `./${imageUrl}`;
    } else if (!imageUrl.startsWith('./assets/images/') && !imageUrl.startsWith('http')) {
      // Si la imagen no es una URL completa ni una ruta relativa correcta, usar el placeholder
      imageUrl = './assets/images/placeholder.svg';
    }
    
    return `
      <div class="product-card">
        <div class="product-image">
          <img 
            src="${imageUrl}" 
            alt="${product.name}" 
            loading="lazy" 
            width="300" 
            height="200"
            onerror="this.src='./assets/images/placeholder.svg'; this.onerror=null;">
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

export default Products;
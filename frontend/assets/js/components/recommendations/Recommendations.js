// Recommendations.js - Componente para mostrar recomendaciones personalizadas

class Recommendations extends HTMLElement {
  constructor() {
    super();
    this.type = 'mixed';
    this.limit = 4;
  }

  static get observedAttributes() {
    return ['type', 'limit'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      switch (name) {
        case 'type':
          this.type = newValue;
          break;
        case 'limit':
          this.limit = parseInt(newValue) || 4;
          break;
      }
      
      if (oldValue !== null) {
        this.fetchRecommendations();
      }
    }
  }

  connectedCallback() {
    this.type = this.getAttribute('type') || 'mixed';
    this.limit = parseInt(this.getAttribute('limit')) || 4;
    
    this.innerHTML = `
      <div class="recommendations-container">
        <div class="recommendations-header">
          <h2>Recomendaciones para ti</h2>
          <button class="refresh-btn" title="Actualizar recomendaciones">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
        <div class="recommendations-loading">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Cargando recomendaciones...</span>
        </div>
        <div class="recommendations-list"></div>
      </div>
    `;
    
    this.querySelector('.refresh-btn').addEventListener('click', () => {
      this.fetchRecommendations();
    });
    
    this.fetchRecommendations();
  }

  async fetchRecommendations() {
    const loadingElement = this.querySelector('.recommendations-loading');
    const listElement = this.querySelector('.recommendations-list');
    
    try {
      loadingElement.style.display = 'flex';
      listElement.innerHTML = '';
      
      const response = await fetch(`/api/recommendations?type=${this.type}&limit=${this.limit}`);
      
      if (!response.ok) {
        throw new Error(`Error al obtener recomendaciones: ${response.status}`);
      }
      
      const data = await response.json();
      this.renderRecommendations(data.recommendations);
    } catch (error) {
      console.error('Error al cargar recomendaciones:', error);
      this.renderError('No se pudieron cargar las recomendaciones');
    } finally {
      loadingElement.style.display = 'none';
    }
  }

  renderRecommendations(recommendations) {
    const listElement = this.querySelector('.recommendations-list');
    
    if (!recommendations || recommendations.length === 0) {
      listElement.innerHTML = `
        <div class="no-recommendations">
          <i class="fas fa-star"></i>
          <p>No hay recomendaciones disponibles en este momento</p>
        </div>
      `;
      return;
    }
    
    const recommendationsHTML = recommendations.map(rec => {
      const product = rec.product;
      const hasDiscount = product.discount_price && product.discount_price < product.price;
      const displayPrice = hasDiscount ? product.discount_price : product.price;
      
      return `
        <div class="recommendation-item" data-product-id="${product.id}">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="recommendation-badge" title="${this.getRecommendationTypeLabel(rec.type)}">
              <i class="${this.getRecommendationTypeIcon(rec.type)}"></i>
            </div>
          </div>
          <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">
              ${hasDiscount ? `
                <span class="price-original">$${product.price}</span>
                <span class="price-discount">$${displayPrice}</span>
              ` : `
                <span class="price-regular">$${displayPrice}</span>
              `}
            </div>
            <div class="product-rating">
              ${[...Array(5)].map((_, i) => `
                <i class="fas fa-star ${i < Math.floor(product.rating || 0) ? 'filled' : ''}"></i>
              `).join('')}
              <span class="rating-value">${product.rating?.toFixed(1) || 'Sin rating'}</span>
            </div>
            ${rec.reason ? `
              <div class="recommendation-reason">
                <i class="fas fa-lightbulb"></i>
                <span>${rec.reason}</span>
              </div>
            ` : ''}
            <div class="product-actions">
              <button class="btn btn-small btn-primary add-to-cart" data-product-id="${product.id}">
                <i class="fas fa-shopping-cart"></i>
                Agregar
              </button>
              <button class="btn btn-small btn-outline add-to-wishlist" data-product-id="${product.id}">
                <i class="far fa-heart"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    listElement.innerHTML = recommendationsHTML;
    
    // Añadir event listeners
    listElement.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = e.target.closest('[data-product-id]').dataset.productId;
        this.addToCart(productId);
      });
    });
    
    listElement.querySelectorAll('.add-to-wishlist').forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = e.target.closest('[data-product-id]').dataset.productId;
        this.addToWishlist(productId);
      });
    });
  }

  renderError(message) {
    const listElement = this.querySelector('.recommendations-list');
    listElement.innerHTML = `
      <div class="recommendations-error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>${message}</p>
        <button class="btn btn-outline retry-btn">Reintentar</button>
      </div>
    `;
    
    listElement.querySelector('.retry-btn').addEventListener('click', () => {
      this.fetchRecommendations();
    });
  }

  getRecommendationTypeIcon(type) {
    switch (type) {
      case 'content_based':
        return 'fas fa-tag';
      case 'collaborative':
        return 'fas fa-users';
      case 'popular':
        return 'fas fa-fire';
      case 'contextual':
        return 'fas fa-calendar';
      default:
        return 'fas fa-star';
    }
  }

  getRecommendationTypeLabel(type) {
    switch (type) {
      case 'content_based':
        return 'Basado en tus intereses';
      case 'collaborative':
        return 'Popular entre usuarios similares';
      case 'popular':
        return 'Tendencia';
      case 'contextual':
        return 'Recomendación especial';
      default:
        return 'Recomendado para ti';
    }
  }

  async addToCart(productId) {
    try {
      // Emitir evento para que el carrito lo maneje
      this.dispatchEvent(new CustomEvent('add-to-cart', {
        detail: { productId, quantity: 1 },
        bubbles: true
      }));
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  }

  async addToWishlist(productId) {
    try {
      // Emitir evento para que la lista de deseos lo maneje
      this.dispatchEvent(new CustomEvent('add-to-wishlist', {
        detail: { productId },
        bubbles: true
      }));
    } catch (error) {
      console.error('Error al agregar a la lista de deseos:', error);
    }
  }
}

// Registrar el componente
if (!customElements.get('recommendations-component')) {
  customElements.define('recommendations-component', Recommendations);
}

export default Recommendations;
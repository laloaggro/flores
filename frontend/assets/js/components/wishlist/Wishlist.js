// Wishlist.js - Componente para la lista de deseos

class Wishlist extends HTMLElement {
  constructor() {
    super();
    this.items = [];
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="wishlist-container">
        <div class="wishlist-header">
          <h2>Mi Lista de Deseos</h2>
          <div class="wishlist-summary">
            <span class="item-count">0 artículos</span>
          </div>
        </div>
        <div class="wishlist-loading">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Cargando lista de deseos...</span>
        </div>
        <div class="wishlist-content">
          <div class="wishlist-items"></div>
          <div class="wishlist-empty" style="display: none;">
            <i class="far fa-heart"></i>
            <h3>Tu lista de deseos está vacía</h3>
            <p>Guarda productos que te gusten para encontrarlos fácilmente más tarde</p>
            <a href="/pages/products.html" class="btn btn-primary">Explorar productos</a>
          </div>
        </div>
      </div>
    `;
    
    this.fetchWishlist();
  }

  async fetchWishlist() {
    const loadingElement = this.querySelector('.wishlist-loading');
    const itemsElement = this.querySelector('.wishlist-items');
    const emptyElement = this.querySelector('.wishlist-empty');
    
    try {
      loadingElement.style.display = 'flex';
      itemsElement.innerHTML = '';
      emptyElement.style.display = 'none';
      
      const response = await fetch('/api/wishlist');
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Debes iniciar sesión para ver tu lista de deseos');
        }
        throw new Error(`Error al obtener la lista de deseos: ${response.status}`);
      }
      
      const data = await response.json();
      this.items = data.items || [];
      this.renderWishlist();
    } catch (error) {
      console.error('Error al cargar la lista de deseos:', error);
      this.renderError(error.message);
    } finally {
      loadingElement.style.display = 'none';
    }
  }

  renderWishlist() {
    const itemsElement = this.querySelector('.wishlist-items');
    const emptyElement = this.querySelector('.wishlist-empty');
    const countElement = this.querySelector('.item-count');
    
    countElement.textContent = `${this.items.length} ${this.items.length === 1 ? 'artículo' : 'artículos'}`;
    
    if (!this.items || this.items.length === 0) {
      emptyElement.style.display = 'block';
      itemsElement.innerHTML = '';
      return;
    }
    
    emptyElement.style.display = 'none';
    
    const wishlistHTML = this.items.map(item => {
      const product = item.product;
      const hasDiscount = product.discount_price && product.discount_price < product.price;
      const displayPrice = hasDiscount ? product.discount_price : product.price;
      
      return `
        <div class="wishlist-item" data-item-id="${item.id}" data-product-id="${product.id}">
          <div class="wishlist-item-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
          </div>
          <div class="wishlist-item-details">
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
            ${item.notes ? `
              <div class="wishlist-notes">
                <strong>Notas:</strong> ${item.notes}
              </div>
            ` : ''}
            <div class="wishlist-item-actions">
              <button class="btn btn-secondary move-to-cart" data-item-id="${item.id}">
                <i class="fas fa-shopping-cart"></i>
                Mover al carrito
              </button>
              <button class="btn btn-outline remove-item" data-item-id="${item.id}">
                <i class="fas fa-trash"></i>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    itemsElement.innerHTML = wishlistHTML;
    
    // Añadir event listeners
    itemsElement.querySelectorAll('.move-to-cart').forEach(button => {
      button.addEventListener('click', (e) => {
        const itemId = e.target.closest('[data-item-id]').dataset.itemId;
        this.moveToCart(itemId);
      });
    });
    
    itemsElement.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', (e) => {
        const itemId = e.target.closest('[data-item-id]').dataset.itemId;
        this.removeItem(itemId);
      });
    });
  }

  renderError(message) {
    const itemsElement = this.querySelector('.wishlist-items');
    itemsElement.innerHTML = `
      <div class="wishlist-error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>${message}</p>
        <button class="btn btn-outline retry-btn">Reintentar</button>
      </div>
    `;
    
    this.querySelector('.retry-btn').addEventListener('click', () => {
      this.fetchWishlist();
    });
  }

  async moveToCart(itemId) {
    try {
      const response = await fetch(`/api/wishlist/items/${itemId}/move-to-cart`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Error al mover el producto al carrito');
      }
      
      // Actualizar la lista de deseos
      this.items = this.items.filter(item => item.id != itemId);
      this.renderWishlist();
      
      // Emitir evento para actualizar el carrito
      this.dispatchEvent(new CustomEvent('wishlist-item-moved-to-cart', {
        bubbles: true
      }));
    } catch (error) {
      console.error('Error al mover al carrito:', error);
      alert('Error al mover el producto al carrito');
    }
  }

  async removeItem(itemId) {
    try {
      const response = await fetch(`/api/wishlist/items/${itemId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar el producto de la lista de deseos');
      }
      
      // Actualizar la lista de deseos
      this.items = this.items.filter(item => item.id != itemId);
      this.renderWishlist();
    } catch (error) {
      console.error('Error al eliminar de la lista de deseos:', error);
      alert('Error al eliminar el producto de la lista de deseos');
    }
  }
}

// Registrar el componente
if (!customElements.get('wishlist-component')) {
  customElements.define('wishlist-component', Wishlist);
}

export default Wishlist;
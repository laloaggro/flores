// ProductReviews.js - Componente para mostrar y gestionar reseñas de productos

class ProductReviews extends HTMLElement {
  constructor() {
    super();
    this.productId = null;
    this.reviews = [];
    this.sortBy = 'newest';
    this.page = 1;
    this.totalPages = 1;
  }

  static get observedAttributes() {
    return ['product-id', 'sort-by'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      switch (name) {
        case 'product-id':
          this.productId = newValue;
          break;
        case 'sort-by':
          this.sortBy = newValue;
          break;
      }
      
      if (oldValue !== null) {
        this.page = 1;
        this.fetchReviews();
      }
    }
  }

  connectedCallback() {
    this.productId = this.getAttribute('product-id');
    this.sortBy = this.getAttribute('sort-by') || 'newest';
    
    this.innerHTML = `
      <div class="reviews-container">
        <div class="reviews-header">
          <h2>Reseñas de Clientes</h2>
          <div class="reviews-summary">
            <div class="average-rating">
              <span class="rating-value">0.0</span>
              <div class="stars">
                <i class="far fa-star"></i>
                <i class="far fa-star"></i>
                <i class="far fa-star"></i>
                <i class="far fa-star"></i>
                <i class="far fa-star"></i>
              </div>
              <span class="review-count">(0 reseñas)</span>
            </div>
          </div>
        </div>
        
        <div class="reviews-controls">
          <select class="sort-select">
            <option value="newest" selected>Más recientes</option>
            <option value="oldest">Más antiguas</option>
            <option value="highest">Mejor calificadas</option>
            <option value="lowest">Peor calificadas</option>
            <option value="helpful">Más útiles</option>
          </select>
        </div>
        
        <div class="reviews-loading">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Cargando reseñas...</span>
        </div>
        
        <div class="reviews-list"></div>
        
        <div class="reviews-pagination">
          <button class="btn btn-outline prev-page" disabled>
            <i class="fas fa-chevron-left"></i>
            Anterior
          </button>
          <span class="page-info">Página 1 de 1</span>
          <button class="btn btn-outline next-page" disabled>
            Siguiente
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <div class="review-form-container">
          <h3>Escribe tu reseña</h3>
          <form class="review-form">
            <div class="form-group">
              <label>Calificación:</label>
              <div class="rating-input">
                <i class="far fa-star" data-rating="1"></i>
                <i class="far fa-star" data-rating="2"></i>
                <i class="far fa-star" data-rating="3"></i>
                <i class="far fa-star" data-rating="4"></i>
                <i class="far fa-star" data-rating="5"></i>
              </div>
            </div>
            
            <div class="form-group">
              <label for="review-title">Título de la reseña:</label>
              <input type="text" id="review-title" class="form-control" placeholder="Ej: Hermoso ramo, flores muy frescas" required>
            </div>
            
            <div class="form-group">
              <label for="review-comment">Tu comentario:</label>
              <textarea id="review-comment" class="form-control" placeholder="Cuéntanos sobre tu experiencia con el producto..." rows="4" required></textarea>
            </div>
            
            <button type="submit" class="btn btn-primary">Enviar reseña</button>
          </form>
        </div>
      </div>
    `;
    
    // Añadir event listeners
    this.querySelector('.sort-select').addEventListener('change', (e) => {
      this.sortBy = e.target.value;
      this.page = 1;
      this.fetchReviews();
    });
    
    this.querySelector('.prev-page').addEventListener('click', () => {
      if (this.page > 1) {
        this.page--;
        this.fetchReviews();
      }
    });
    
    this.querySelector('.next-page').addEventListener('click', () => {
      if (this.page < this.totalPages) {
        this.page++;
        this.fetchReviews();
      }
    });
    
    const ratingStars = this.querySelectorAll('.rating-input i');
    ratingStars.forEach(star => {
      star.addEventListener('click', (e) => {
        const rating = parseInt(e.target.dataset.rating);
        this.setRating(rating);
      });
      
      star.addEventListener('mouseover', (e) => {
        const rating = parseInt(e.target.dataset.rating);
        this.highlightStars(rating);
      });
      
      star.addEventListener('mouseout', () => {
        this.highlightStars(0);
      });
    });
    
    this.querySelector('.review-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitReview();
    });
    
    if (this.productId) {
      this.fetchReviews();
    }
  }

  async fetchReviews() {
    const loadingElement = this.querySelector('.reviews-loading');
    const listElement = this.querySelector('.reviews-list');
    
    try {
      loadingElement.style.display = 'flex';
      listElement.innerHTML = '';
      
      const response = await fetch(`/api/products/${this.productId}/reviews?sort=${this.sortBy}&page=${this.page}`);
      
      if (!response.ok) {
        throw new Error(`Error al obtener reseñas: ${response.status}`);
      }
      
      const data = await response.json();
      this.reviews = data.reviews || [];
      this.totalPages = data.pagination?.total_pages || 1;
      
      this.renderSummary(data);
      this.renderReviews();
      this.updatePagination();
    } catch (error) {
      console.error('Error al cargar reseñas:', error);
      this.renderError('No se pudieron cargar las reseñas');
    } finally {
      loadingElement.style.display = 'none';
    }
  }

  renderSummary(data) {
    const averageRatingElement = this.querySelector('.rating-value');
    const starsElement = this.querySelector('.stars');
    const reviewCountElement = this.querySelector('.review-count');
    
    const averageRating = data.average_rating || 0;
    const reviewCount = data.reviews?.length || 0;
    
    averageRatingElement.textContent = averageRating.toFixed(1);
    reviewCountElement.textContent = `(${reviewCount} ${reviewCount === 1 ? 'reseña' : 'reseñas'})`;
    
    // Renderizar estrellas
    starsElement.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('i');
      star.className = i <= Math.floor(averageRating) ? 'fas fa-star filled' : 'far fa-star';
      starsElement.appendChild(star);
    }
  }

  renderReviews() {
    const listElement = this.querySelector('.reviews-list');
    
    if (!this.reviews || this.reviews.length === 0) {
      listElement.innerHTML = `
        <div class="no-reviews">
          <i class="far fa-comment"></i>
          <p>No hay reseñas para este producto todavía.</p>
          <p>¡Sé el primero en compartir tu experiencia!</p>
        </div>
      `;
      return;
    }
    
    const reviewsHTML = this.reviews.map(review => {
      return `
        <div class="review-item" data-review-id="${review.id}">
          <div class="review-header">
            <div class="reviewer-info">
              <span class="reviewer-name">${review.user?.name || 'Cliente'}</span>
              ${review.verified_purchase ? '<span class="verified-badge">Compra verificada</span>' : ''}
            </div>
            <div class="review-date">
              ${this.formatDate(review.created_at)}
            </div>
          </div>
          
          <div class="review-rating">
            ${[...Array(5)].map((_, i) => `
              <i class="fas fa-star ${i < review.rating ? 'filled' : ''}"></i>
            `).join('')}
          </div>
          
          <h4 class="review-title">${review.title}</h4>
          
          <p class="review-comment">${review.comment}</p>
          
          <div class="review-actions">
            <span>¿Te parece útil esta reseña?</span>
            <button class="vote-button helpful" data-review-id="${review.id}" data-vote="1">
              <i class="fas fa-thumbs-up"></i>
              <span class="vote-count">${review.helpful_count || 0}</span>
            </button>
            <button class="vote-button not-helpful" data-review-id="${review.id}" data-vote="-1">
              <i class="fas fa-thumbs-down"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
    
    listElement.innerHTML = reviewsHTML;
    
    // Añadir event listeners para votar
    listElement.querySelectorAll('.vote-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const reviewId = e.target.closest('[data-review-id]').dataset.reviewId;
        const vote = parseInt(e.target.closest('[data-vote]').dataset.vote);
        this.voteReview(reviewId, vote);
      });
    });
  }

  renderError(message) {
    const listElement = this.querySelector('.reviews-list');
    listElement.innerHTML = `
      <div class="reviews-error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>${message}</p>
        <button class="btn btn-outline retry-btn">Reintentar</button>
      </div>
    `;
    
    listElement.querySelector('.retry-btn').addEventListener('click', () => {
      this.fetchReviews();
    });
  }

  updatePagination() {
    const prevButton = this.querySelector('.prev-page');
    const nextButton = this.querySelector('.next-page');
    const pageInfo = this.querySelector('.page-info');
    
    prevButton.disabled = this.page <= 1;
    nextButton.disabled = this.page >= this.totalPages;
    pageInfo.textContent = `Página ${this.page} de ${this.totalPages}`;
  }

  setRating(rating) {
    const stars = this.querySelectorAll('.rating-input i');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.remove('far');
        star.classList.add('fas', 'filled');
      } else {
        star.classList.remove('fas', 'filled');
        star.classList.add('far');
      }
    });
    
    this.currentRating = rating;
  }

  highlightStars(rating) {
    const stars = this.querySelectorAll('.rating-input i');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('highlighted');
      } else {
        star.classList.remove('highlighted');
      }
    });
  }

  async submitReview() {
    const titleInput = this.querySelector('#review-title');
    const commentInput = this.querySelector('#review-comment');
    
    const title = titleInput.value.trim();
    const comment = commentInput.value.trim();
    const rating = this.currentRating || 0;
    
    if (rating === 0) {
      alert('Por favor, selecciona una calificación');
      return;
    }
    
    if (!title) {
      alert('Por favor, ingresa un título para tu reseña');
      titleInput.focus();
      return;
    }
    
    if (!comment) {
      alert('Por favor, ingresa tu comentario');
      commentInput.focus();
      return;
    }
    
    try {
      const response = await fetch(`/api/products/${this.productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating,
          title,
          comment,
          verified_purchase: true
        })
      });
      
      if (!response.ok) {
        throw new Error('Error al enviar la reseña');
      }
      
      // Limpiar el formulario
      this.setRating(0);
      titleInput.value = '';
      commentInput.value = '';
      
      // Recargar las reseñas
      this.fetchReviews();
      
      alert('¡Gracias por tu reseña!');
    } catch (error) {
      console.error('Error al enviar reseña:', error);
      alert('Error al enviar la reseña. Por favor, inténtalo de nuevo.');
    }
  }

  async voteReview(reviewId, vote) {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vote })
      });
      
      if (!response.ok) {
        throw new Error('Error al votar la reseña');
      }
      
      const data = await response.json();
      
      // Actualizar el contador de votos
      const reviewElement = this.querySelector(`[data-review-id="${reviewId}"]`);
      const voteCountElement = reviewElement.querySelector('.vote-count');
      voteCountElement.textContent = data.helpful_count;
    } catch (error) {
      console.error('Error al votar reseña:', error);
      alert('Error al votar la reseña. Por favor, inténtalo de nuevo.');
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

// Registrar el componente
if (!customElements.get('product-reviews')) {
  customElements.define('product-reviews', ProductReviews);
}

export default ProductReviews;
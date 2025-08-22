import productManager from '../assets/js/productManager.js';
import ProductCard from './ProductCard.js';

/**
 * Componente para mostrar los productos y testimonios
 */
const Products = {
  /**
   * Renderiza la sección de productos
   * @returns {string} HTML del componente
   */
  render: async () => {
    return `
      <section class="products-section" aria-labelledby="products-heading">
        <div class="container">
          <h2 id="products-heading">Nuestros Arreglos</h2>
          <p class="section-description">Descubre nuestra exclusiva colección de arreglos florales</p>
          
          <div class="products-grid" id="productsGrid" role="list">
            <!-- Los productos se cargarán aquí dinámicamente -->
          </div>

          <div class="testimonials" id="testimonials" aria-labelledby="testimonials-heading">
            <h3 id="testimonials-heading">Lo que dicen nuestros clientes</h3>
            <div class="testimonials-grid" id="testimonialsGrid">
              <!-- Los testimonios se cargarán aquí dinámicamente -->
            </div>
          </div>
        </div>
      </section>
    `;
  },

  /**
   * Se ejecuta después de montar el componente
   */
  mount: async () => {
    // Cargar productos cuando el componente esté montado
    Products.loadProducts();
  },

  /**
   * Carga los productos desde la API
   */
  loadProducts: async () => {
    try {
      const data = await productManager.loadProducts(1, 8);
      
      if (data && data.products.length > 0) {
        Products.displayProducts(data.products);
        Products.loadTestimonials(); // Cargar testimonios después de obtener productos
      }
    } catch (error) {
      Products.showError('productsGrid', 'Error al cargar productos. Por favor, inténtelo más tarde.');
      console.error('Error al cargar productos:', error);
    }
  },

  /**
   * Muestra los productos en el grid
   * @param {Array} products - Lista de productos a mostrar
   */
  displayProducts: (products) => {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = products.map(product => ProductCard(product)).join('');
  },

  /**
   * Carga los testimonios desde la API
   */
  loadTestimonials: async () => {
    // Esta implementación puede ser reemplazada por una llamada real a una API
    // Para este ejemplo, usamos datos estáticos
    const testimonials = [
      {
        id: 1,
        name: 'María González',
        rating: 5,
        comment: '¡Excelente servicio! Recibí mi arreglo floral justo a tiempo para el cumpleaños de mi mamá. Las flores estaban frescas y hermosamente arregladas.',
        date: '2024-03-15'
      },
      {
        id: 2,
        name: 'Carlos Mendoza',
        rating: 4,
        comment: 'Buena experiencia general. La entrega fue rápida y el arreglo lucía tal como aparecía en la imagen del sitio web. Solo le falta un poco más de variedad en opciones.',
        date: '2024-02-28'
      },
      {
        id: 3,
        name: 'Ana Rodríguez',
        rating: 5,
        comment: 'Servicio excepcional. Compré un arreglo para un amigo que estaba en el hospital y me aseguraron la entrega antes de las 2 horas que indican. ¡Muy recomendable!',
        date: '2024-04-05'
      }
    ];
    
    Products.displayTestimonials(testimonials);
  },

  /**
   * Muestra los testimonios en el grid correspondiente
   * @param {Array} testimonials - Lista de testimonios a mostrar
   */
  displayTestimonials: (testimonials) => {
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    if (!testimonialsGrid) return;
    
    testimonialsGrid.innerHTML = testimonials.map(testimonial => `
      <div class="testimonial-card" role="article" aria-labelledby="testimonial-${testimonial.id}">
        <div class="testimonial-header">
          <div class="testimonial-rating">
            ${Products.renderStars(testimonial.rating)}
          </div>
          <h4 id="testimonial-${testimonial.id}" class="testimonial-name">${testimonial.name}</h4>
          <time class="testimonial-date" datetime="${testimonial.date}">${Products.formatDate(testimonial.date)}</time>
        </div>
        <p class="testimonial-comment">${testimonial.comment}</p>
      </div>
    `).join('');
  },

  /**
   * Renderiza las estrellas de calificación
   * @param {number} rating - Calificación del 1 al 5
   * @returns {string} HTML con las estrellas
   */
  renderStars: (rating) => {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += `<i class="fas fa-star${i <= rating ? '' : '-o'}" aria-hidden="true"></i>`;
    }
    return stars;
  },

  /**
   * Formatea la fecha a un formato más legible
   * @param {string} dateString - Fecha en formato YYYY-MM-DD
   * @returns {string} Fecha formateada
   */
  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  },

  /**
   * Muestra un mensaje de error en lugar de contenido
   * @param {string} elementId - ID del elemento donde mostrar el error
   * @param {string} message - Mensaje de error a mostrar
   */
  showError: (elementId, message) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = `<div class="error-message">${message}</div>`;
    }
  }
};

export default Products;
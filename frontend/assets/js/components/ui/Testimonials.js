// Migrado de componente web personalizado a módulo ES6
class Testimonials extends HTMLElement {
  constructor() {
    super();
    // Inicialización básica
  }

  /**
   * Se ejecuta cuando el elemento se conecta al DOM
   * Renderiza el contenido de los testimonios
   */
  connectedCallback() {
    this.innerHTML = `
      <section class="testimonials">
        <div class="container">
          <div class="section-header">
            <h2>Lo que dicen nuestros clientes</h2>
            <p>Testimonios de quienes han disfrutado de nuestros arreglos florales</p>
          </div>
          
          <div class="testimonials-grid">
            <div class="testimonial-card">
              <div class="testimonial-content">
                <p>"Los arreglos florales de Victoria son simplemente espectaculares. Cada vez que he pedido, la calidad y el diseño superan mis expectativas."</p>
              </div>
              <div class="testimonial-author">
                <img src="/assets/images/flowers/flower1.svg" alt="María González" width="60" height="60">
                <div>
                  <h4>María González</h4>
                  <p>Cliente satisfecha</p>
                </div>
              </div>
            </div>
            
            <div class="testimonial-card">
              <div class="testimonial-content">
                <p>"Para nuestro aniversario de bodas, Victoria creó un arreglo único que capturó perfectamente nuestra historia de amor. ¡Altamente recomendados!"</p>
              </div>
              <div class="testimonial-author">
                <img src="/assets/images/flowers/flower2.svg" alt="Carlos y Elena" width="60" height="60">
                <div>
                  <h4>Carlos y Elena</h4>
                  <p>Clientes para eventos especiales</p>
                </div>
              </div>
            </div>
            
            <div class="testimonial-card">
              <div class="testimonial-content">
                <p>"Como florista profesional, reconozco la excelencia en el trabajo de mis colegas. Victoria demuestra un nivel artístico excepcional en cada arreglo."</p>
              </div>
              <div class="testimonial-author">
                <img src="/assets/images/flowers/flower3.svg" alt="Pedro Ramírez" width="60" height="60">
                <div>
                  <h4>Pedro Ramírez</h4>
                  <p>Florista asociado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="container">
          <h2 id="testimonials-heading">Testimonios de Nuestros Clientes</h2>
          <p class="section-description">Lo que dicen nuestros clientes sobre nuestros productos</p>
          
          <div class="testimonials-grid" role="list">
            <article class="testimonial-card" itemscope itemtype="http://schema.org/Review" tabindex="0" role="listitem">
              <div class="testimonial-header">
                <div class="testimonial-avatar" aria-hidden="true">
                  <i class="fas fa-user-circle"></i>
                </div>
                <div class="testimonial-user">
                  <h3 itemprop="author">María González</h3>
                  <div class="testimonial-rating" role="img" aria-label="Calificación de 5 estrellas">
                    <i class="fas fa-star" aria-hidden="true"></i>
                    <i class="fas fa-star" aria-hidden="true"></i>
                    <i class="fas fa-star" aria-hidden="true"></i>
                    <i class="fas fa-star" aria-hidden="true"></i>
                    <i class="fas fa-star" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
              <div class="testimonial-content">
                <p itemprop="reviewBody">
                  "El ramo de rosas rojas que pedí para el aniversario de mi esposo fue simplemente hermoso. 
                  La frescura de las flores y el arreglo tan cuidado hicieron que el momento fuera aún más especial. 
                  ¡Definitivamente volveré a comprar!"
                </p>
                <div class="testimonial-product" role="group" aria-label="Información del producto">
                  <span><i class="fas fa-box" aria-hidden="true"></i> Ramo de Rosas Rojas</span>
                </div>
                <time datetime="2025-08-15" itemprop="datePublished" aria-label="Fecha de publicación">15 de agosto de 2025</time>
              </div>
            </article>
            
            <article class="testimonial-card" itemscope itemtype="http://schema.org/Review" tabindex="0" role="listitem">
              <div class="testimonial-header">
                <div class="testimonial-avatar" aria-hidden="true">
                  <i class="fas fa-user-circle"></i>
                </div>
                <div class="testimonial-user">
                  <h3 itemprop="author">Carlos Ramírez</h3>
                  <div class="testimonial-rating" role="img" aria-label="Calificación de 4 estrellas">
                    <i class="fas fa-star" aria-hidden="true"></i>
                    <i class="fas fa-star" aria-hidden="true"></i>
                    <i class="fas fa-star" aria-hidden="true"></i>
                    <i class="fas fa-star" aria-hidden="true"></i>
                    <i class="fas fa-star unchecked" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
              <div class="testimonial-content">
                <p itemprop="reviewBody">
                  "Pedí un arreglo floral para el cumpleaños de mi madre y superó mis expectativas. 
                  El envío fue puntual y el arreglo llegó en perfectas condiciones. 
                  Las flores seguían frescas después de varios días."
                </p>
                <div class="testimonial-product" role="group" aria-label="Información del producto">
                  <span><i class="fas fa-box" aria-hidden="true"></i> Arreglo Especial Primavera</span>
                </div>
                <time datetime="2025-07-22" itemprop="datePublished" aria-label="Fecha de publicación">22 de julio de 2025</time>
              </div>
            </article>
            
            <article class="testimonial-card" itemscope itemtype="http://schema.org/Review" tabindex="0" role="listitem">
              <div class="testimonial-header">
                <div class="testimonial-avatar" aria-hidden="true">
                  <i class="fas fa-user-circle"></i>
                </div>
                <div class="testimonial-user">
                  <h3 itemprop="author">Elena Torres</h3>
                  <div class="testimonial-rating" role="img" aria-label="Calificación de 5 estrellas">
                    <i class="fas fa-star" aria-hidden="true"></i>
                    <i class="fas fa-star" aria-hidden="true"></i>
                    <i class="fas fa-star" aria-hidden="true"></i>
                    <i class="fas fa-star" aria-hidden="true"></i>
                    <i class="fas fa-star" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
              <div class="testimonial-content">
                <p itemprop="reviewBody">
                  "Como florista profesional, reconozco la calidad de sus arreglos. 
                  Los productos son de excelente calidad y el servicio al cliente es impecable. 
                  Recomiendo sus servicios sin dudar."
                </p>
                <div class="testimonial-product" role="group" aria-label="Información del producto">
                  <span><i class="fas fa-box" aria-hidden="true"></i> Colección Premium</span>
                </div>
                <time datetime="2025-08-05" itemprop="datePublished" aria-label="Fecha de publicación">5 de agosto de 2025</time>
              </div>
            </article>
          </div>
          
          <div class="testimonials-cta" role="complementary">
            <h3>¿Tienes una experiencia que compartir?</h3>
            <p>¡Nos encantaría escuchar tu testimonio sobre nuestros productos!</p>
            <button id="addTestimonialBtn" class="btn btn-primary" aria-haspopup="dialog">
              <i class="fas fa-plus-circle" aria-hidden="true"></i> Agregar Testimonio
            </button>
          </div>
        </div>
      </section>
    `;
    
    // Configurar la interactividad
    this.setupInteractivity();
  }
  
  /**
   * Configura la interactividad del componente
   */
  setupInteractivity() {
    // Agregar evento al botón de agregar testimonio
    const addTestimonialBtn = this.querySelector('#addTestimonialBtn');
    if (addTestimonialBtn) {
      addTestimonialBtn.addEventListener('click', () => {
        // Verificar si el usuario está logueado
        const token = localStorage.getItem('token');
        if (!token) {
          // Redirigir al login si no está logueado
          window.location.href = '/login.html';
          return;
        }
        
        // Mostrar modal para agregar testimonio
        this.showTestimonialModal();
      });
    }
  }
  
  /**
   * Función para mostrar el modal de agregar testimonio
   * El modal permite a los usuarios autenticados crear nuevos testimonios
   */
  showTestimonialModal() {
    // Crear modal para agregar testimonio
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'testimonialModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'testimonialModalTitle');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="testimonialModalTitle">Agregar Testimonio</h3>
          <button class="close" aria-label="Cerrar">&times;</button>
        </div>
        <div class="modal-body">
          <form id="testimonialForm">
            <div class="form-group">
              <label for="testimonialProduct">Producto adquirido:</label>
              <select id="testimonialProduct" class="form-input" required aria-required="true">
                <option value="">Selecciona un producto</option>
                <!-- Las opciones se cargarán dinámicamente -->
              </select>
            </div>
            <div class="form-group">
              <label for="testimonialRating">Calificación:</label>
              <div class="rating-input" role="radiogroup" aria-required="true">
                <input type="radio" id="star5" name="rating" value="5" required>
                <label for="star5" aria-label="5 estrellas"><i class="fas fa-star" aria-hidden="true"></i></label>
                <input type="radio" id="star4" name="rating" value="4">
                <label for="star4" aria-label="4 estrellas"><i class="fas fa-star" aria-hidden="true"></i></label>
                <input type="radio" id="star3" name="rating" value="3">
                <label for="star3" aria-label="3 estrellas"><i class="fas fa-star" aria-hidden="true"></i></label>
                <input type="radio" id="star2" name="rating" value="2">
                <label for="star2" aria-label="2 estrellas"><i class="fas fa-star" aria-hidden="true"></i></label>
                <input type="radio" id="star1" name="rating" value="1">
                <label for="star1" aria-label="1 estrella"><i class="fas fa-star" aria-hidden="true"></i></label>
              </div>
            </div>
            <div class="form-group">
              <label for="testimonialText">Tu testimonio:</label>
              <textarea id="testimonialText" class="form-input" rows="4" placeholder="Comparte tu experiencia con el producto..." required aria-required="true"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Enviar Testimonio</button>
          </form>
        </div>
      </div>
    `;
    
    // Añadir modal al documento
    document.body.appendChild(modal);
    
    // Configurar eventos del modal
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', function() {
      modal.remove();
    });
    
    // Añadir atributos de accesibilidad al botón de cierre
    closeBtn.setAttribute('aria-label', 'Cerrar modal');
    
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        modal.remove();
      }
    });
    
    // Manejar la tecla Escape para cerrar el modal
    window.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && modal.parentNode) {
        modal.remove();
      }
    });
    
    // Configurar envío del formulario
    const form = modal.querySelector('form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitTestimonial();
    });
    
    // Mostrar modal
    modal.style.display = 'block';
    
    // Cargar productos en el select
    this.loadUserProducts();
    
    // Enfocar el primer campo del formulario
    const firstInput = modal.querySelector('select, textarea, input');
    if (firstInput) {
      firstInput.focus();
    }
  }
  
  /**
   * Cargar productos del usuario
   * Obtiene los productos que el usuario ha comprado para mostrarlos en el formulario de testimonios
   * En una implementación real, esto haría una llamada a la API
   */
  async loadUserProducts() {
    try {
      // En una implementación real, esto haría una llamada a la API para obtener
      // los productos que el usuario ha comprado
      // Por ahora, usaremos datos de ejemplo
      
      const products = [
        { id: 1, name: "Ramo de Rosas Rojas" },
        { id: 2, name: "Arreglo Especial Cumpleaños" },
        { id: 3, name: "Arreglo Decorativo Premium" },
        { id: 4, name: "Caja Sorpresa de Flores" },
        { id: 5, name: "Centro de Mesa Elegante" }
      ];
      
      const select = document.getElementById('testimonialProduct');
      if (select) {
        products.forEach(product => {
          const option = document.createElement('option');
          option.value = product.id;
          option.textContent = product.name;
          select.appendChild(option);
        });
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }
  
  /**
   * Enviar testimonio
   * Procesa el formulario de testimonio y envía los datos a la API
   */
  async submitTestimonial() {
    try {
      const form = document.getElementById('testimonialForm');
      const formData = new FormData(form);
      
      const testimonialData = {
        product_id: formData.get('testimonialProduct'),
        rating: formData.get('rating'),
        text: formData.get('testimonialText')
      };
      
      // Validar campos requeridos
      if (!testimonialData.product_id || !testimonialData.rating || !testimonialData.text) {
        alert('Por favor complete todos los campos');
        return;
      }
      
      // En una implementación real, esto haría una llamada a la API para guardar el testimonio
      // await fetch('/api/testimonials', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(testimonialData)
      // });
      
      // Cerrar modal
      const modal = document.getElementById('testimonialModal');
      if (modal) {
        modal.remove();
      }
      
      // Mostrar mensaje de éxito
      alert('¡Gracias por tu testimonio! Será revisado y publicado pronto.');
      
    } catch (error) {
      console.error('Error al enviar testimonio:', error);
      alert('Error al enviar testimonio. Por favor, inténtalo de nuevo.');
    }
  }
}

// Registrar el componente personalizado para que pueda ser usado en el HTML
if (!customElements.get('testimonials-component')) {
    customElements.define('testimonials-component', Testimonials);
}
export default Testimonials;
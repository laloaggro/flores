// Componente para la sección de testimonios
const Testimonials = {
  // Renderizar la sección de testimonios
  render: async () => {
    return `
      <section class="testimonials-section" aria-labelledby="testimonials-heading">
        <div class="container">
          <h2 id="testimonials-heading">Testimonios de Nuestros Clientes</h2>
          <p class="section-description">Lo que dicen nuestros clientes sobre nuestros productos</p>
          
          <div class="testimonials-grid">
            <article class="testimonial-card" itemscope itemtype="http://schema.org/Review">
              <div class="testimonial-header">
                <div class="testimonial-avatar">
                  <i class="fas fa-user-circle" aria-hidden="true"></i>
                </div>
                <div class="testimonial-user">
                  <h3 itemprop="author">María González</h3>
                  <div class="testimonial-rating" aria-label="Calificación de 5 estrellas">
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
                <div class="testimonial-product">
                  <span><i class="fas fa-box" aria-hidden="true"></i> Ramo de Rosas Rojas</span>
                </div>
                <time datetime="2025-08-15" itemprop="datePublished">15 de agosto de 2025</time>
              </div>
            </article>
            
            <article class="testimonial-card" itemscope itemtype="http://schema.org/Review">
              <div class="testimonial-header">
                <div class="testimonial-avatar">
                  <i class="fas fa-user-circle" aria-hidden="true"></i>
                </div>
                <div class="testimonial-user">
                  <h3 itemprop="author">Carlos Rodríguez</h3>
                  <div class="testimonial-rating" aria-label="Calificación de 4 estrellas">
                    <i class="fas fa-star" aria-hidden="true"></i>
                    <i class="fas fa-star" aria-hidden="true"></i>
                    <i class="fas fa-star" aria-hidden="true"></i>
                    <i class="fas fa-star" aria-hidden="true"></i>
                    <i class="fas fa-star-half-alt" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
              <div class="testimonial-content">
                <p itemprop="reviewBody">
                  "Sorprendí a mi madre con el arreglo de flores para su cumpleaños y quedó encantada. 
                  La entrega fue puntual y el producto llegó en perfectas condiciones. 
                  Muy recomendable para ocasiones especiales."
                </p>
                <div class="testimonial-product">
                  <span><i class="fas fa-box" aria-hidden="true"></i> Arreglo Especial Cumpleaños</span>
                </div>
                <time datetime="2025-07-22" itemprop="datePublished">22 de julio de 2025</time>
              </div>
            </article>
            
            <article class="testimonial-card" itemscope itemtype="http://schema.org/Review">
              <div class="testimonial-header">
                <div class="testimonial-avatar">
                  <i class="fas fa-user-circle" aria-hidden="true"></i>
                </div>
                <div class="testimonial-user">
                  <h3 itemprop="author">Ana Martínez</h3>
                  <div class="testimonial-rating" aria-label="Calificación de 5 estrellas">
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
                  "Como dueña de un restaurante, siempre busco los mejores productos para decorar mis espacios. 
                  Los arreglos florales de Arreglos Victoria son de excelente calidad y duran mucho tiempo. 
                  Además, el servicio al cliente es excepcional."
                </p>
                <div class="testimonial-product">
                  <span><i class="fas fa-box" aria-hidden="true"></i> Arreglo Decorativo Premium</span>
                </div>
                <time datetime="2025-08-05" itemprop="datePublished">5 de agosto de 2025</time>
              </div>
            </article>
          </div>
          
          <div class="testimonials-cta">
            <h3>¿Tienes una experiencia que compartir?</h3>
            <p>¡Nos encantaría escuchar tu testimonio sobre nuestros productos!</p>
            <button id="addTestimonialBtn" class="btn btn-primary">
              <i class="fas fa-plus-circle" aria-hidden="true"></i> Agregar Testimonio
            </button>
          </div>
        </div>
      </section>
    `;
  },

  // Montar el componente (ejecutar después de renderizar)
  mount: async () => {
    // Agregar evento al botón de agregar testimonio
    const addTestimonialBtn = document.getElementById('addTestimonialBtn');
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
        showTestimonialModal();
      });
    }
  }
};

// Función para mostrar el modal de agregar testimonio
function showTestimonialModal() {
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
            <div class="rating-input">
              <input type="radio" id="star5" name="rating" value="5" required>
              <label for="star5"><i class="fas fa-star"></i></label>
              <input type="radio" id="star4" name="rating" value="4">
              <label for="star4"><i class="fas fa-star"></i></label>
              <input type="radio" id="star3" name="rating" value="3">
              <label for="star3"><i class="fas fa-star"></i></label>
              <input type="radio" id="star2" name="rating" value="2">
              <label for="star2"><i class="fas fa-star"></i></label>
              <input type="radio" id="star1" name="rating" value="1">
              <label for="star1"><i class="fas fa-star"></i></label>
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
  const form = document.getElementById('testimonialForm');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    submitTestimonial();
  });
  
  // Mostrar modal
  modal.style.display = 'block';
  
  // Cargar productos en el select
  loadUserProducts();
  
  // Enfocar el primer campo del formulario
  const firstInput = modal.querySelector('select, textarea, input');
  if (firstInput) {
    firstInput.focus();
  }
}

// Cargar productos del usuario
async function loadUserProducts() {
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

// Enviar testimonio
async function submitTestimonial() {
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

export default Testimonials;
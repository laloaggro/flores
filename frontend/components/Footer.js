class Footer extends HTMLElement {
  connectedCallback() {
    // Usamos template literals para crear un HTML estructurado
    this.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <!-- Contenedor principal del footer -->
          <div class="footer-content">
            <!-- Sección de información principal -->
            <div class="footer-section footer-brand">
              <h3>Arreglos Victoria</h3>
              <p>Flores frescas y hermosos arreglos florales para alegrar tus momentos especiales.</p>
              
              <!-- Redes sociales -->
              <div class="social-links">
                <a href="https://www.facebook.com/profile.php?id=61578999845743" 
                   aria-label="Facebook" 
                   target="_blank" 
                   rel="noopener noreferrer">
                  <i class="fab fa-facebook-f" aria-hidden="true"></i>
                </a>
                <a href="https://www.instagram.com/arreglosvictoria/" 
                   aria-label="Instagram" 
                   target="_blank" 
                   rel="noopener noreferrer">
                  <i class="fab fa-instagram" aria-hidden="true"></i>
                </a>
                <a href="https://wa.me/56963603177" 
                   aria-label="WhatsApp" 
                   target="_blank" 
                   rel="noopener noreferrer">
                  <i class="fab fa-whatsapp" aria-hidden="true"></i>
                </a>
              </div>
            </div>

            <!-- Secciones de enlaces -->
            <div class="footer-section">
              <h4>Enlaces Rápidos</h4>
              <ul class="footer-links">
                <li><a href="index.html">Inicio</a></li>
                <li><a href="products.html">Productos</a></li>
                <li><a href="index.html#about">Nosotros</a></li>
                <li><a href="contact.html">Contacto</a></li>
                <li><a href="sitemap.html">Mapa del Sitio</a></li>
              </ul>
            </div>

            <div class="footer-section">
              <h4>Categorías</h4>
              <ul class="footer-links">
                <li><a href="products.html?category=arreglos">Arreglos Florales</a></li>
                <li><a href="products.html?category=ramos">Ramos</a></li>
                <li><a href="products.html?category=plantas">Plantas</a></li>
                <li><a href="products.html?category=accesorios">Accesorios</a></li>
              </ul>
            </div>

            <div class="footer-section">
              <h4>Información</h4>
              <ul class="footer-links">
                <li><a href="privacy.html">Política de Privacidad</a></li>
                <li><a href="terms.html">Términos y Condiciones</a></li>
                <li><a href="shipping.html">Envíos y Devoluciones</a></li>
                <li><a href="faq.html">Preguntas Frecuentes</a></li>
              </ul>
            </div>

            <!-- Información de contacto -->
            <div class="footer-section">
              <h4>Contacto</h4>
              <ul class="contact-info">
                <li>
                  <i class="fas fa-map-marker-alt" aria-hidden="true"></i> 
                  Av. Valdivieso 593, Recoleta
                </li>
                <li>
                  <i class="fas fa-phone" aria-hidden="true"></i> 
                  +569 6360 3177
                </li>
                <li>
                  <i class="fas fa-clock" aria-hidden="true"></i> 
                  Lunes a Sábado: 9:00 AM - 7:00 PM
                </li>
              </ul>
            </div>
          </div>

          <!-- Pie de página con derechos reservados -->
          <div class="footer-bottom">
            <p>&copy; 2025 Arreglos Victoria Florería. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    `;
  }
}

// Registramos el componente personalizado
customElements.define('site-footer', Footer);
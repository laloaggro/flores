/**
 * Componente de pie de página (Footer)
 * Muestra información de contacto, enlaces importantes y redes sociales
 * Incluye copyright y enlaces al mapa del sitio, privacidad y términos
 */
class Footer extends HTMLElement {
  /**
   * Se ejecuta cuando el elemento se conecta al DOM
   * Renderiza el contenido del pie de página
   */
  connectedCallback() {
    this.innerHTML = `
      <footer role="contentinfo">
        <div class="container">
          <div class="footer-content">
            <div class="footer-section">
              <h3 aria-label="Información de la empresa">Arreglos Victoria</h3>
              <p>Flores frescas y hermosos arreglos florales para alegrar tus momentos especiales.</p>
              
              <!-- Redes sociales -->
              <div class="social-links" aria-label="Redes sociales de Arreglos Victoria">
                <a href="https://www.facebook.com/profile.php?id=61578999845743" 
                   aria-label="Visite nuestra página de Facebook" 
                   target="_blank" 
                   rel="noopener noreferrer">
                  <i class="fab fa-facebook-f" aria-hidden="true"></i>
                </a>
                <a href="https://www.instagram.com/arreglosvictoria/" 
                   aria-label="Síganos en Instagram" 
                   target="_blank" 
                   rel="noopener noreferrer">
                  <i class="fab fa-instagram" aria-hidden="true"></i>
                </a>
                <a href="https://wa.me/56963603177" 
                   aria-label="Contáctenos por WhatsApp" 
                   target="_blank" 
                   rel="noopener noreferrer">
                  <i class="fab fa-whatsapp" aria-hidden="true"></i>
                </a>
              </div>
            </div>
            
            <div class="footer-section">
              <h4 aria-label="Enlaces rápidos">Enlaces</h4>
              <ul role="navigation" aria-label="Enlaces del pie de página">
                <li><a href="index.html" aria-label="Ir a la página de inicio"><i class="fas fa-home" aria-hidden="true"></i> Inicio</a></li>
                <li><a href="products.html" aria-label="Ver productos"><i class="fas fa-box" aria-hidden="true"></i> Productos</a></li>
                <li><a href="contact.html" aria-label="Ir a la página de contacto"><i class="fas fa-envelope" aria-hidden="true"></i> Contacto</a></li>
                <li><a href="about.html" aria-label="Conocer más sobre nosotros"><i class="fas fa-info-circle" aria-hidden="true"></i> Nosotros</a></li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h4 aria-label="Horario de atención">Horario</h4>
              <p><i class="fas fa-clock" aria-hidden="true"></i> Lunes a Sábado: 9:00 - 19:00</p>
              <p><i class="fas fa-clock" aria-hidden="true"></i> Domingo: 10:00 - 16:00</p>
            </div>
            
            <div class="footer-section">
              <h4 aria-label="Información de contacto">Contacto</h4>
              <address>
                <p><i class="fas fa-map-marker-alt" aria-hidden="true"></i> Av. Valdivieso 593, Recoleta</p>
                <p><i class="fas fa-phone" aria-hidden="true"></i> Tel: +56 9 6360 3177</p>
                <p><i class="fas fa-envelope" aria-hidden="true"></i> Email: contacto@arreglosvictoria.com</p>
              </address>
            </div>
          </div>
          
          <div class="footer-bottom">
            <p>&copy; 2023 Arreglos Florales Victoria. Todos los derechos reservados.</p>
            <div class="footer-links">
              <a href="privacy.html" aria-label="Política de privacidad"><i class="fas fa-user-secret" aria-hidden="true"></i> Privacidad</a>
              <a href="terms.html" aria-label="Términos y condiciones"><i class="fas fa-file-contract" aria-hidden="true"></i> Términos</a>
              <a href="sitemap.html" aria-label="Mapa del sitio"><i class="fas fa-sitemap" aria-hidden="true"></i> Mapa del Sitio</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}

// Registramos el componente personalizado para que pueda ser usado en el HTML
customElements.define('site-footer', Footer);
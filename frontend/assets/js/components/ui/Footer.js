// Migrado de componente web personalizado a módulo ES6
class Footer extends HTMLElement {
  /**
   * Se ejecuta cuando el elemento se conecta al DOM
   * Renderiza el contenido del pie de página
   */
  connectedCallback() {
    // Cargar Font Awesome solo si no está ya cargado
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const fontAwesomeLink = document.createElement('link');
      fontAwesomeLink.rel = 'stylesheet';
      fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      fontAwesomeLink.integrity = 'sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==';
      fontAwesomeLink.crossOrigin = 'anonymous';
      document.head.appendChild(fontAwesomeLink);
    }
    
    this.innerHTML = `
      <footer class="site-footer">
        <div class="footer-content">
          <div class="footer-section">
            <h3>Arreglos Florales Victoria</h3>
            <p>Florería familiar en Recoleta con más de 15 años de experiencia. Flores naturales y arreglos florales para todas las ocasiones.</p>
            <div class="social-links">
              <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
              <a href="#" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
            </div>
          </div>
          
          <div class="footer-section">
            <h4>Enlaces Rápidos</h4>
            <ul>
              <li><a href="index.html">Inicio</a></li>
              <li><a href="products.html">Productos</a></li>
              <li><a href="about.html">Nosotros</a></li>
              <li><a href="contact.html">Contacto</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>Información</h4>
            <ul>
              <li><a href="privacy.html">Política de Privacidad</a></li>
              <li><a href="terms.html">Términos y Condiciones</a></li>
              <li><a href="shipping.html">Envíos y Devoluciones</a></li>
              <li><a href="faq.html">Preguntas Frecuentes</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>Contacto</h4>
            <address>
              <p><i class="fas fa-map-marker-alt"></i> Recoleta, Santiago</p>
              <p><i class="fas fa-phone"></i> +56 9 1234 5678</p>
              <p><i class="fas fa-envelope"></i> info@arreglosvictoria.cl</p>
            </address>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2025 Arreglos Florales Victoria. Todos los derechos reservados.</p>
        </div>
      </footer>
    `;
  }
}

// Registramos el componente personalizado para que pueda ser usado en el HTML
if (!customElements.get('footer-component')) {
    customElements.define('footer-component', Footer);
}
export default Footer;

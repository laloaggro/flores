class Footer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer" role="contentinfo">
        <div class="container">
          <div class="footer-content">
            <div class="footer-section">
              <h3>Arreglos Florales Victoria</h3>
              <p>Creando hermosos momentos desde 2010 en el corazón de Recoleta.</p>
              <div class="social-links">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <i class="fab fa-facebook-f" aria-hidden="true"></i>
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <i class="fab fa-instagram" aria-hidden="true"></i>
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <i class="fab fa-twitter" aria-hidden="true"></i>
                </a>
                <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
                  <i class="fab fa-pinterest" aria-hidden="true"></i>
                </a>
              </div>
            </div>
            
            <div class="footer-section">
              <h4>Contacto</h4>
              <address>
                <p><i class="fas fa-map-marker-alt" aria-hidden="true"></i> Av. Recoleta 1234, Recoleta, Santiago</p>
                <p><i class="fas fa-phone" aria-hidden="true"></i> +56 2 1234 5678</p>
                <p><i class="fas fa-envelope" aria-hidden="true"></i> info@arreglosvictoria.cl</p>
              </address>
            </div>
            
            <div class="footer-section">
              <h4>Horario</h4>
              <p><i class="fas fa-clock" aria-hidden="true"></i> Lunes a Domingo: 9:00 - 21:00</p>
              <p><i class="fas fa-truck" aria-hidden="true"></i> Despacho: 10:00 - 19:00</p>
            </div>
          </div>
          
          <div class="footer-bottom">
            <p>&copy; 2025 Arreglos Florales Victoria. Todos los derechos reservados.</p>
            <div class="footer-links">
              <a href="privacy.html" aria-label="Política de privacidad"><i class="fas fa-user-secret" aria-hidden="true"></i> Privacidad</a>
              <a href="terms.html" aria-label="Términos y condiciones"><i class="fas fa-file-contract" aria-hidden="true"></i> Términos</a>
              <a href="sitemap.html" aria-label="Mapa del sitio"><i class="fas fa-sitemap" aria-hidden="true"></i> Mapa del Sitio</a>
            </div>
            <p>Diseñado con <i class="fas fa-heart" aria-label="amor"></i> en Santiago, Chile</p>
          </div>
        </div>
      </footer>
    `;
  }
}

// Registramos el componente personalizado para que pueda ser usado en el HTML
customElements.define('site-footer', Footer);

export default Footer;
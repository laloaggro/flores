const Footer = () => {
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>Arreglos Victoria</h3>
            <p>Flores frescas y hermosos arreglos florales para cada ocasión especial.</p>
            <div class="social-links">
              <a href="https://www.facebook.com/profile.php?id=61578999845743" target="_blank"><i class="fab fa-facebook-f"></i></a>
              <a href="https://www.instagram.com/arreglosvictoria/" target="_blank"><i class="fab fa-instagram"></i></a>
              <a href="https://wa.me/56963603177" target="_blank"><i class="fab fa-whatsapp"></i></a>
            </div>
          </div>
          <div class="footer-section">
            <h4>Enlaces Rápidos</h4>
            <ul>
              <li><a href="#home">Inicio</a></li>
              <li><a href="#products">Productos</a></li>
              <li><a href="#about">Nosotros</a></li>
              <li><a href="#contact">Contacto</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Servicios</h4>
            <ul>
              <li><a href="#">Arreglos Florales</a></li>
              <li><a href="#">Entrega a Domicilio</a></li>
              <li><a href="#">Pedidos Especiales</a></li>
              <li><a href="#">Decoración de Eventos</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Newsletter</h4>
            <p>Suscríbete para ofertas especiales</p>
            <form class="newsletter-form">
              <input type="email" placeholder="Tu Email" required>
              <button type="submit"><i class="fas fa-paper-plane"></i></button>
            </form>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 Arreglos Victoria. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
    <script src="assets/js/app.js"></script>
  `;
};

export default Footer;
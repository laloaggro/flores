const Contact = () => {
  return `
    <section id="contact" class="contact">
      <div class="container">
        <h2 class="section-title">Contáctanos</h2>
        <div class="contact-content">
          <div class="contact-info">
            <div class="info-item">
              <i class="fas fa-map-marker-alt"></i>
              <div>
                <h3>Ubicación</h3>
                <p>Calle Principal #123, Col. Centro</p>
                <p>Victoria de Durango, Dgo. México</p>
              </div>
            </div>
            <div class="info-item">
              <i class="fas fa-phone"></i>
              <div>
                <h3>Teléfono</h3>
                <p>+52 (618) 123-4567</p>
              </div>
            </div>
            <div class="info-item">
              <i class="fas fa-envelope"></i>
              <div>
                <h3>Email</h3>
                <p>info@arreglosvictoria.com</p>
              </div>
            </div>
            <div class="info-item">
              <i class="fas fa-clock"></i>
              <div>
                <h3>Horario</h3>
                <p>Lun-Vie: 9:00 AM - 8:00 PM</p>
                <p>Sáb-Dom: 10:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
          <div class="contact-form">
            <form id="contactForm">
              <div class="form-group">
                <input type="text" id="name" name="name" placeholder="Tu Nombre" required>
              </div>
              <div class="form-group">
                <input type="email" id="email" name="email" placeholder="Tu Email" required>
              </div>
              <div class="form-group">
                <input type="tel" id="phone" name="phone" placeholder="Tu Teléfono">
              </div>
              <div class="form-group">
                <textarea id="message" name="message" placeholder="Tu Mensaje" rows="5" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Enviar Mensaje</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  `;
};

export default Contact;
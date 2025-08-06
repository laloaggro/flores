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
                <p>Av. Valdivieso 593, 8441510 Recoleta, Región Metropolitana</p>
                <p><a href="https://maps.google.com/?q=Av.+Valdivieso+593,+8441510+Recoleta,+Región+Metropolitana" target="_blank">Ver en Google Maps</a></p>
              </div>
            </div>
            <div class="info-item">
              <i class="fas fa-phone"></i>
              <div>
                <h3>Teléfono</h3>
                <p><a href="tel:+56963603177">+569 6360 3177</a></p>
              </div>
            </div>
            <div class="info-item">
              <i class="fab fa-whatsapp"></i>
              <div>
                <h3>WhatsApp</h3>
                <p><a href="https://wa.me/56963603177" target="_blank">+569 6360 3177</a></p>
              </div>
            </div>
            <div class="info-item">
              <i class="fas fa-envelope"></i>
              <div>
                <h3>Email</h3>
                <p><a href="mailto:arreglosvictoriafloreria@gmail.com">arreglosvictoriafloreria@gmail.com</a></p>
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
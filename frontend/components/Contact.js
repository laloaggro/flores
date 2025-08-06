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
                <label for="name" class="sr-only">Nombre</label>
                <input type="text" id="name" name="name" placeholder="Tu Nombre" required autocomplete="name">
              </div>
              <div class="form-group">
                <label for="email" class="sr-only">Email</label>
                <input type="email" id="email" name="email" placeholder="Tu Email" required autocomplete="email">
              </div>
              <div class="form-group">
                <label for="phone" class="sr-only">Teléfono</label>
                <input type="tel" id="phone" name="phone" placeholder="Tu Teléfono" autocomplete="tel">
              </div>
              <div class="form-group">
                <label for="message" class="sr-only">Mensaje</label>
                <textarea id="message" name="message" placeholder="Tu Mensaje" rows="5" required autocomplete="off"></textarea>
              </div>
              <div id="formMessage" class="form-message"></div>
              <button type="submit" class="btn btn-primary">Enviar Mensaje</button>
            </form>
          </div>
        </div>
        <div class="map-container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.710117967493!2d-70.6442056847374!3d-33.43333338077777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5d1ca4b6c7f%3A0x9662c5d1ca4b6c7f!2sAv.%20Valdivieso%20593%2C%208441510%20Recoleta%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1sen!2scl!4v1690000000000!5m2!1sen!2scl" 
            width="100%" 
            height="450" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </div>
    </section>
  `;
};

export default Contact;
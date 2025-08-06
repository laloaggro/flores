const Blog = () => {
  return `
    <section id="blog" class="blog">
      <div class="container">
        <h2 class="section-title">Blog de Flores</h2>
        <div class="blog-grid">
          <div class="blog-card">
            <div class="blog-image">
              <img src="https://images.unsplash.com/photo-1593617133396-03503508724d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Cómo cuidar las rosas en casa" loading="lazy">
            </div>
            <div class="blog-content">
              <div class="blog-meta">
                <span><i class="far fa-calendar"></i> 15 de agosto, 2025</span>
                <span><i class="far fa-user"></i> María Flores</span>
              </div>
              <h3>Cómo cuidar las rosas en casa</h3>
              <p>Descubre los secretos para mantener tus rosas frescas durante más tiempo con estos consejos prácticos.</p>
              <a href="#" class="btn btn-secondary">Leer más</a>
            </div>
          </div>
          
          <div class="blog-card">
            <div class="blog-image">
              <img src="https://images.unsplash.com/photo-1597146743874-18b555153880?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Las mejores flores para regalar en primavera" loading="lazy">
            </div>
            <div class="blog-content">
              <div class="blog-meta">
                <span><i class="far fa-calendar"></i> 10 de agosto, 2025</span>
                <span><i class="far fa-user"></i> Carlos Jardín</span>
              </div>
              <h3>Flores ideales para regalar en primavera</h3>
              <p>Explora las mejores opciones florales para celebrar la llegada de la primavera y sorprender a seres queridos.</p>
              <a href="#" class="btn btn-secondary">Leer más</a>
            </div>
          </div>
          
          <div class="blog-card">
            <div class="blog-image">
              <img src="https://images.unsplash.com/photo-1613945768171-18074f8f4b0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Arreglos florales para bodas" loading="lazy">
            </div>
            <div class="blog-content">
              <div class="blog-meta">
                <span><i class="far fa-calendar"></i> 5 de agosto, 2025</span>
                <span><i class="far fa-user"></i> Andrea Petals</span>
              </div>
              <h3>Tendencias en arreglos florales para bodas 2025</h3>
              <p>Descubre las últimas tendencias en decoración floral para bodas y cómo elegir el arreglo perfecto para tu gran día.</p>
              <a href="#" class="btn btn-secondary">Leer más</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
};

export default Blog;
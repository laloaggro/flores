const Products = () => {
  return `
    <section id="products" class="products">
      <div class="container">
        <h2 class="section-title">Nuestros Arreglos</h2>
        <div class="product-grid">
          <div class="product-card">
            <div class="product-image">
              <img src="https://images.unsplash.com/photo-1593617133396-03503508724d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Ramo de Rosas">
            </div>
            <div class="product-info">
              <h3>Ramo de Rosas</h3>
              <p>Elegantes rosas rojas en un ramo clásico.</p>
              <span class="price">$450.00</span>
              <button class="btn btn-secondary add-to-cart" data-id="1" data-name="Ramo de Rosas" data-price="450.00">
                <i class="fas fa-shopping-cart"></i> Agregar
              </button>
            </div>
          </div>
          
          <div class="product-card">
            <div class="product-image">
              <img src="https://images.unsplash.com/photo-1597146743874-18b555153880?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Arreglo Tropical">
            </div>
            <div class="product-info">
              <h3>Arreglo Tropical</h3>
              <p>Exóticas flores tropicales con follaje decorativo.</p>
              <span class="price">$680.00</span>
              <button class="btn btn-secondary add-to-cart" data-id="2" data-name="Arreglo Tropical" data-price="680.00">
                <i class="fas fa-shopping-cart"></i> Agregar
              </button>
            </div>
          </div>
          
          <div class="product-card">
            <div class="product-image">
              <img src="https://images.unsplash.com/photo-1613945768171-18074f8f4b0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Ramo Primaveral">
            </div>
            <div class="product-info">
              <h3>Ramo Primaveral</h3>
              <p>Colorida mezcla de flores de temporada.</p>
              <span class="price">$380.00</span>
              <button class="btn btn-secondary add-to-cart" data-id="3" data-name="Ramo Primaveral" data-price="380.00">
                <i class="fas fa-shopping-cart"></i> Agregar
              </button>
            </div>
          </div>
          
          <div class="product-card">
            <div class="product-image">
              <img src="https://images.unsplash.com/photo-1583182965353-d9a9168261d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Orquídeas">
            </div>
            <div class="product-info">
              <h3>Orquídeas</h3>
              <p>Elegantes orquídeas blancas en presentación única.</p>
              <span class="price">$720.00</span>
              <button class="btn btn-secondary add-to-cart" data-id="4" data-name="Orquídeas" data-price="720.00">
                <i class="fas fa-shopping-cart"></i> Agregar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
};

export default Products;
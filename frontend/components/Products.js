const Products = () => {
  return `
    <section id="products" class="products">
      <div class="container">
        <h2 class="section-title">Nuestros Arreglos</h2>
        <div class="product-grid">
          <div class="product-card">
            <div class="product-image">
              <img src="https://images.unsplash.com/photo-1593617133396-03503508724d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Ramo elegante de rosas rojas para regalo romántico" loading="lazy">
            </div>
            <div class="product-info">
              <h3>Ramo de Rosas</h3>
              <p>Elegantes rosas rojas en un ramo clásico. Perfecto para ocasiones románticas y expresiones de amor.</p>
              <div class="product-details">
                <span class="detail-item"><i class="fas fa-ruler-combined"></i> 40cm de altura</span>
                <span class="detail-item"><i class="fas fa-leaf"></i> 12 rosas frescas</span>
                <span class="detail-item"><i class="fas fa-box"></i> Envoltura premium</span>
              </div>
              <span class="price">$450.00</span>
              <button class="btn btn-secondary add-to-cart" data-id="1" data-name="Ramo de Rosas" data-price="450.00">
                <i class="fas fa-shopping-cart"></i> Agregar
              </button>
            </div>
          </div>
          
          <div class="product-card">
            <div class="product-image">
              <img src="https://images.unsplash.com/photo-1597146743874-18b555153880?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Arreglo floral tropical con flores exóticas y follaje decorativo" loading="lazy">
            </div>
            <div class="product-info">
              <h3>Arreglo Tropical</h3>
              <p>Exóticas flores tropicales con follaje decorativo. Ideal para crear un ambiente vibrante y alegre.</p>
              <div class="product-details">
                <span class="detail-item"><i class="fas fa-ruler-combined"></i> 50cm de altura</span>
                <span class="detail-item"><i class="fas fa-leaf"></i> Flores variadas</span>
                <span class="detail-item"><i class="fas fa-box"></i> Maceta decorativa</span>
              </div>
              <span class="price">$680.00</span>
              <button class="btn btn-secondary add-to-cart" data-id="2" data-name="Arreglo Tropical" data-price="680.00">
                <i class="fas fa-shopping-cart"></i> Agregar
              </button>
            </div>
          </div>
          
          <div class="product-card">
            <div class="product-image">
              <img src="https://images.unsplash.com/photo-1613945768171-18074f8f4b0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Ramo primaveral colorido con flores de temporada" loading="lazy">
            </div>
            <div class="product-info">
              <h3>Ramo Primaveral</h3>
              <p>Colorida mezcla de flores de temporada. Una explosión de colores que representa la alegría de la primavera.</p>
              <div class="product-details">
                <span class="detail-item"><i class="fas fa-ruler-combined"></i> 35cm de altura</span>
                <span class="detail-item"><i class="fas fa-leaf"></i> Flores mixtas</span>
                <span class="detail-item"><i class="fas fa-box"></i> Envoltura decorativa</span>
              </div>
              <span class="price">$380.00</span>
              <button class="btn btn-secondary add-to-cart" data-id="3" data-name="Ramo Primaveral" data-price="380.00">
                <i class="fas fa-shopping-cart"></i> Agregar
              </button>
            </div>
          </div>
          
          <div class="product-card">
            <div class="product-image">
              <img src="https://images.unsplash.com/photo-1583182965353-d9a9168261d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Orquídeas blancas elegantes en presentación única" loading="lazy">
            </div>
            <div class="product-info">
              <h3>Orquídeas</h3>
              <p>Elegantes orquídeas blancas en presentación única. Símbolo de pureza y sofisticación.</p>
              <div class="product-details">
                <span class="detail-item"><i class="fas fa-ruler-combined"></i> 45cm de altura</span>
                <span class="detail-item"><i class="fas fa-leaf"></i> 3 orquídeas premium</span>
                <span class="detail-item"><i class="fas fa-box"></i> Jarrón de cristal</span>
              </div>
              <span class="price">$720.00</span>
              <button class="btn btn-secondary add-to-cart" data-id="4" data-name="Orquídeas" data-price="720.00">
                <i class="fas fa-shopping-cart"></i> Agregar
              </button>
            </div>
          </div>
          
          <div class="product-card">
            <div class="product-image">
              <img src="https://images.unsplash.com/photo-1593617133396-03503508724d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Arreglo de flores para bodas con diseño elegante" loading="lazy">
            </div>
            <div class="product-info">
              <h3>Arreglo para Boda</h3>
              <p>Diseño elegante para el día especial. Combina flores blancas y verdes para un look sofisticado.</p>
              <div class="product-details">
                <span class="detail-item"><i class="fas fa-ruler-combined"></i> 60cm de altura</span>
                <span class="detail-item"><i class="fas fa-leaf"></i> Rosas y follaje</span>
                <span class="detail-item"><i class="fas fa-box"></i> Base decorativa</span>
              </div>
              <span class="price">$950.00</span>
              <button class="btn btn-secondary add-to-cart" data-id="5" data-name="Arreglo para Boda" data-price="950.00">
                <i class="fas fa-shopping-cart"></i> Agregar
              </button>
            </div>
          </div>
          
          <div class="product-card">
            <div class="product-image">
              <img src="https://images.unsplash.com/photo-1598193920002-b6ba1031a2d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Ramo de flores para cumpleaños coloridas" loading="lazy">
            </div>
            <div class="product-info">
              <h3>Ramo de Cumpleaños</h3>
              <p>Flores vibrantes para celebrar un cumpleaños. Una combinación alegre de colores vivos.</p>
              <div class="product-details">
                <span class="detail-item"><i class="fas fa-ruler-combined"></i> 35cm de altura</span>
                <span class="detail-item"><i class="fas fa-leaf"></i> Flores variadas</span>
                <span class="detail-item"><i class="fas fa-box"></i> Envoltura colorida</span>
              </div>
              <span class="price">$420.00</span>
              <button class="btn btn-secondary add-to-cart" data-id="6" data-name="Ramo de Cumpleaños" data-price="420.00">
                <i class="fas fa-shopping-cart"></i> Agregar
              </button>
            </div>
          </div>
          
          <div class="product-card">
            <div class="product-image">
              <img src="https://images.unsplash.com/photo-1593617281798-1b1cbadd3ef9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Arreglo fúnebre con lirios y crisantemos" loading="lazy">
            </div>
            <div class="product-info">
              <h3>Arreglo de Condolencias</h3>
              <p>Diseño respetuoso para momentos difíciles. Transmite consuelo y apoyo en tiempos de duelo.</p>
              <div class="product-details">
                <span class="detail-item"><i class="fas fa-ruler-combined"></i> 50cm de altura</span>
                <span class="detail-item"><i class="fas fa-leaf"></i> Lirios y crisantemos</span>
                <span class="detail-item"><i class="fas fa-box"></i> Arco decorativo</span>
              </div>
              <span class="price">$650.00</span>
              <button class="btn btn-secondary add-to-cart" data-id="7" data-name="Arreglo de Condolencias" data-price="650.00">
                <i class="fas fa-shopping-cart"></i> Agregar
              </button>
            </div>
          </div>
          
          <div class="product-card">
            <div class="product-image">
              <img src="https://images.unsplash.com/photo-1593617133396-03503508724d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Ramo de flores mixtas con girasoles y rosas" loading="lazy">
            </div>
            <div class="product-info">
              <h3>Ramo Mixto</h3>
              <p>Combinación alegre de girasoles y rosas. Perfecto para alegrar el día de alguien especial.</p>
              <div class="product-details">
                <span class="detail-item"><i class="fas fa-ruler-combined"></i> 40cm de altura</span>
                <span class="detail-item"><i class="fas fa-leaf"></i> Girasoles y rosas</span>
                <span class="detail-item"><i class="fas fa-box"></i> Envoltura rústica</span>
              </div>
              <span class="price">$520.00</span>
              <button class="btn btn-secondary add-to-cart" data-id="8" data-name="Ramo Mixto" data-price="520.00">
                <i class="fas fa-shopping-cart"></i> Agregar
              </button>
            </div>
          </div>
        </div>
        <div class="product-note">
          <p><i class="fas fa-info-circle"></i> Todos nuestros arreglos florales son hechos con flores frescas y de la más alta calidad. Entregamos en toda la Región Metropolitana con un tiempo de anticipación mínimo de 2 horas.</p>
        </div>
      </div>
    </section>
  `;
};

export default Products;
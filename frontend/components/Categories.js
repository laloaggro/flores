// Categories.js - Componente de categorías
const Categories = () => {
  return `
    <section id="categories" class="categories">
      <div class="container">
        <h2 class="section-title">Categorías</h2>
        <div class="category-grid">
          <div class="category-card">
            <div class="category-image">
              <img src="/api/image-proxy?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1593617133396-03503508724d%3Fixlib%3Drb-4.0.3%26auto%3Dformat%26fit%3Dcrop%26w%3D800%26q%3D80" alt="Ramos de flores" loading="lazy">
            </div>
            <div class="category-info">
              <h3>Ramos</h3>
              <p>Flores frescas en hermosos ramos</p>
            </div>
          </div>
          
          <div class="category-card">
            <div class="category-image">
              <img src="/api/image-proxy?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1597146743874-18b555153880%3Fixlib%3Drb-4.0.3%26auto%3Dformat%26fit%3Dcrop%26w%3D800%26q%3D80" alt="Arreglos florales" loading="lazy">
            </div>
            <div class="category-info">
              <h3>Arreglos</h3>
              <p>Diseños elaborados para ocasiones especiales</p>
            </div>
          </div>
          
          <div class="category-card">
            <div class="category-image">
              <img src="/api/image-proxy?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1593617281798-1b1cbadd3ef9%3Fixlib%3Drb-4.0.3%26auto%3Dformat%26fit%3Dcrop%26w%3D800%26q%3D80" alt="Arreglos especiales" loading="lazy">
            </div>
            <div class="category-info">
              <h3>Ocasionales</h3>
              <p>Para bodas, cumpleaños, condolencias y más</p>
            </div>
          </div>
          
          <div class="category-card">
            <div class="category-image">
              <img src="/api/image-proxy?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1583182965353-d9a9168261d2%3Fixlib%3Drb-4.0.3%26auto%3Dformat%26fit%3Dcrop%26w%3D800%26q%3D80" alt="Plantas y jardinería" loading="lazy">
            </div>
            <div class="category-info">
              <h3>Plantas</h3>
              <p>Plantas de interior y jardín</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
};

export default Categories;
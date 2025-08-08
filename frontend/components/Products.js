import productManager from '../assets/js/productManager.js';

let cachedProducts = null;
let isLoading = false;

// Función para renderizar una plantilla base con contenido dinámico
function renderTemplate(content) {
  return `
    <section id="products" class="products">
      <div class="container">
        <h2 class="section-title">Nuestros Arreglos</h2>
        <div class="product-grid">
          ${content}
        </div>
        <div class="product-note">
          <p><i class="fas fa-info-circle"></i> Todos nuestros arreglos florales son hechos con flores frescas y de la más alta calidad. Entregamos en toda la Región Metropolitana con un tiempo de anticipación mínimo de 2 horas.</p>
        </div>
      </div>
    </section>
  `;
}

const Products = async () => {
  // Usar caché si está disponible
  if (cachedProducts) {
    console.log('Usando productos en caché');
    return renderTemplate(productManager.generateProductsHTML(cachedProducts));
  }

  // Mostrar mensaje de carga si ya está en progreso
  if (isLoading) {
    console.log('Carga de productos en progreso');
    return renderTemplate('<div class="loading-message">Cargando productos...</div>');
  }

  // Iniciar carga
  isLoading = true;
  console.log('Iniciando carga de productos desde la base de datos');

  try {
    const data = await productManager.loadProducts(1, 8);
    
    if (data) {
      cachedProducts = data.products;
      isLoading = false;
      
      console.log('Productos cargados exitosamente:', cachedProducts.length);
      return renderTemplate(productManager.generateProductsHTML(cachedProducts));
    }
  } catch (error) {
    isLoading = false;
    console.error('Error al cargar productos:', error);
    return renderTemplate('<div class="error-message">Error al cargar productos. Por favor, inténtelo más tarde.</div>');
  }
};

// Función para generar HTML de productos (para compatibilidad)
function generateProductsHTML(products) {
  return productManager.generateProductsHTML(products);
}

export { Products, generateProductsHTML };
export default Products;

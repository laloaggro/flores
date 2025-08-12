import productManager from '../assets/js/productManager.js';
import ProductCard from './ProductCard.js';

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
    return renderTemplate(generateProductsHTML(cachedProducts));
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
    // Aplicar un timeout de 5 segundos para evitar demoras excesivas
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Tiempo de espera agotado')), 5000)
    );
    
    const dataPromise = productManager.loadProducts(1, 8);
    const data = await Promise.race([dataPromise, timeoutPromise]);
    
    if (data) {
      cachedProducts = data.products;
      isLoading = false;
      
      console.log('Productos cargados exitosamente:', cachedProducts.length);
      return renderTemplate(generateProductsHTML(cachedProducts));
    }
  } catch (error) {
    isLoading = false;
    console.error('Error al cargar productos:', error);
    
    // En caso de error o timeout, mostrar productos de ejemplo
    return renderTemplate(generateFallbackProducts());
  }
};

// Función para generar HTML de productos usando el componente ProductCard
function generateProductsHTML(products) {
  if (!products || products.length === 0) {
    return '<div class="no-products-message">No hay productos disponibles en este momento.</div>';
  }
  
  return products.map(product => {
    // Para productos con imágenes locales, no usar el proxy
    if (product.image_url && (product.image_url.startsWith('/') || product.image_url.startsWith('./'))) {
      return ProductCard(product);
    }
    
    // Usar el proxy solo para imágenes externas
    const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(product.image_url)}`;
    return ProductCard({...product, image_url: proxyUrl});
  }).join('');
}

// Función para generar productos de respaldo en caso de error
function generateFallbackProducts() {
  const fallbackProducts = [
    {
      id: 1,
      name: "Ramo de Rosas Rojas",
      description: "Hermoso ramo de rosas rojas frescas, ideal para ocasiones especiales",
      price: 12000,
      image_url: "/assets/images/flowers/flower1.svg",
      category: "Ramos"
    },
    {
      id: 2,
      name: "Arreglo de Girasoles",
      description: "Brillante arreglo de girasoles frescos que alegrará cualquier espacio",
      price: 15000,
      image_url: "/assets/images/flowers/flower2.svg",
      category: "Arreglos"
    },
    {
      id: 3,
      name: "Tulipanes Coloridos",
      description: "Elegante combinación de tulipanes de colores vibrantes",
      price: 10000,
      image_url: "/assets/images/flowers/flower3.svg",
      category: "Ramos"
    },
    {
      id: 4,
      name: "Lirios Blancos",
      description: "Refinado arreglo de lirios blancos, símbolo de pureza y elegancia",
      price: 13500,
      image_url: "/assets/images/flowers/flower4.svg",
      category: "Arreglos"
    }
  ];
  
  return fallbackProducts.map(product => ProductCard(product)).join('');
}

export { Products, generateProductsHTML };
export default Products;
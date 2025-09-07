// homeProducts.js - Funcionalidad para la sección de productos en la página principal
import { API_BASE_URL } from '../utils/utils.js';
import { formatPrice } from '../utils/utils.js';

// Importar el componente de tarjeta de producto
import ProductCard from '../product/ProductCard.js';

// Función para cargar productos destacados
async function loadFeaturedProducts() {
  const featuredProductsGrid = document.getElementById('featuredProductsGrid');
  if (!featuredProductsGrid) return;
    
  try {
    // Mostrar indicador de carga
    featuredProductsGrid.innerHTML = `
            <div class="loading-placeholder">
                <p><i class="fas fa-spinner fa-spin"></i> Cargando productos destacados...</p>
            </div>
        `;
        
    // Cargar productos populares desde la API
    const response = await fetch(`${API_BASE_URL}/api/products/popular?limit=4`);
        
    // Si la respuesta no es exitosa, intentar cargar todos los productos
    if (!response.ok) {
      console.warn('No se pudieron cargar productos populares, cargando productos generales...');
      throw new Error(`HTTP error! status: ${response.status}`);
    }
        
    const text = await response.text();
    // Verificar si la respuesta es JSON válido
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      // Si no es JSON válido, puede ser contenido offline
      console.warn('Respuesta no es JSON válido:', text.substring(0, 100));
      throw new Error('Respuesta no válida del servidor');
    }
        
    // Corregir la forma en que se accede a los productos
    const products = Array.isArray(data.products) ? data.products : (Array.isArray(data) ? data : []);
        
    if (products && products.length > 0) {
      renderProducts(products, featuredProductsGrid);
    } else {
      // Si no hay productos populares, intentar cargar productos generales
      const allProductsResponse = await fetch(`${API_BASE_URL}/api/products`);
            
      if (!allProductsResponse.ok) {
        throw new Error(`HTTP error! status: ${allProductsResponse.status}`);
      }
            
      const allData = await allProductsResponse.json();
      const allProducts = Array.isArray(allData) ? allData : (allData.products || []);
            
      const productsFallback = allProducts.slice(0, 4);
            
      if (productsFallback && productsFallback.length > 0) {
        renderProducts(productsFallback, featuredProductsGrid);
      } else {
        showNoProductsMessage(featuredProductsGrid);
      }
    }
  } catch (error) {
    console.error('Error al cargar productos destacados:', error);
    // En caso de error (incluyendo offline), intentar cargar productos generales
    try {
      const allProductsResponse = await fetch(`${API_BASE_URL}/api/products`);
      if (allProductsResponse.ok) {
        const allData = await allProductsResponse.json();
        const allProducts = Array.isArray(allData) ? allData : (allData.products || []);
        const productsFallback = allProducts.slice(0, 4);
                
        if (productsFallback && productsFallback.length > 0) {
          renderProducts(productsFallback, featuredProductsGrid);
        } else {
          showNoProductsMessage(featuredProductsGrid);
        }
      } else {
        showErrorMesage(featuredProductsGrid);
      }
    } catch (fallbackError) {
      console.error('Error al cargar productos de respaldo:', fallbackError);
      showErrorMesage(featuredProductsGrid);
    }
  }
}

// Función para renderizar productos
function renderProducts(products, container) {
  container.innerHTML = products.slice(0, 4).map(product => 
    `<product-card data-product='${JSON.stringify(product)}'></product-card>`
  ).join('');
}

// Función para mostrar mensaje de no hay productos
function showNoProductsMessage(container) {
  container.innerHTML = `
        <div class="no-products-message">
            <p>No hay productos destacados disponibles en este momento.</p>
        </div>
    `;
}

// Función para mostrar mensaje de error
function showErrorMesage(container) {
  container.innerHTML = `
        <div class="error-message">
            <p>Error al cargar productos destacados. Por favor, inténtelo más tarde.</p>
            <button class="btn btn-primary" onclick="loadFeaturedProducts()">Reintentar</button>
        </div>
    `;
}

// Función para inicializar la sección de productos en la página principal
function initializeHomeProducts() {
  // Cargar productos cuando el DOM esté listo
  loadFeaturedProducts();
    
  console.log('✅ Sección de productos de la página principal inicializada');
}

// Exportar función de inicialización
export { initializeHomeProducts };
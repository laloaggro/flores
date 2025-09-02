// homeProducts.js - Funcionalidad para la sección de productos en la página principal
import { API_BASE_URL } from '../utils/utils.js';
import { formatPrice } from '../utils/utils.js';

// Importar el componente de tarjeta de producto
import '../components/productCard.js';

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
        const response = await fetch(`${API_BASE_URL}/products/popular?limit=4`);
        
        // Si la respuesta no es exitosa, intentar cargar todos los productos
        if (!response.ok) {
            console.warn('No se pudieron cargar productos populares, cargando productos generales...');
            const allProductsResponse = await fetch(`${API_BASE_URL}/products`);
            
            if (!allProductsResponse.ok) {
                throw new Error('Error al cargar productos');
            }
            
            const allData = await allProductsResponse.json();
            const allProducts = Array.isArray(allData) ? allData : (allData.products || []);
            
            // Tomar los primeros 4 productos si existen
            const products = allProducts.slice(0, 4);
            
            if (products && products.length > 0) {
                renderProducts(products, featuredProductsGrid);
            } else {
                showNoProductsMessage(featuredProductsGrid);
            }
            return;
        }
        
        const data = await response.json();
        const products = Array.isArray(data) ? data : (data.products || []);
        
        if (products && products.length > 0) {
            renderProducts(products, featuredProductsGrid);
        } else {
            // Si no hay productos populares, intentar cargar productos generales
            const allProductsResponse = await fetch(`${API_BASE_URL}/products`);
            
            if (!allProductsResponse.ok) {
                throw new Error('Error al cargar productos');
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
        showErrorMesage(featuredProductsGrid);
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
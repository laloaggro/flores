import productManager from './productManager.js';
import ProductCard, { handleImageError } from '../../components/ProductCard.js';
import CartUtils from './cartUtils.js';
import { showNotification } from './utils.js';

// Función para cargar y mostrar productos en la página principal
async function loadHomeProducts() {
  const productGrid = document.getElementById('products');
  
  if (!productGrid) {
    console.error('No se encontró el contenedor de productos');
    return;
  }

  try {
    // Mostrar mensaje de carga
    productGrid.innerHTML = '<div class="loading-message">Cargando productos...</div>';
    
    // Cargar productos (8 productos para la página principal)
    const data = await productManager.loadProducts(1, 8);
    
    if (data && data.products && data.products.length > 0) {
      // Generar HTML para los productos
      const productsHTML = data.products.map(product => ProductCard(product)).join('');
      productGrid.innerHTML = productsHTML;
      
      // Agregar event listeners a los botones de "Agregar al carrito"
      document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
          const product = {
            id: this.dataset.id,
            name: this.dataset.name,
            price: parseFloat(this.dataset.price),
            image: this.dataset.image
          };
          
          // Agregar producto al carrito usando CartUtils
          CartUtils.addToCart(product);
          showNotification(`Producto "${product.name}" agregado al carrito`, 'success');
        });
      });
    } else {
      productGrid.innerHTML = '<div class="no-products-message">No hay productos disponibles en este momento.</div>';
    }
  } catch (error) {
    console.error('Error al cargar productos:', error);
    productGrid.innerHTML = '<div class="error-message">Error al cargar productos. Por favor, intente nuevamente.</div>';
  }
}

// Cargar productos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadHomeProducts);

// Exportar la función handleImageError al ámbito global
window.handleImageError = handleImageError;
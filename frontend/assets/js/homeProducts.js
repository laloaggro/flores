import productManager from './productManager.js';
import ProductCard from '../../components/ProductCard.js';
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
    console.log('Cargando productos...');
    const data = await productManager.loadProducts(1, '', '', 8);
    console.log('Datos de productos cargados:', data);
    
    if (data && data.products && data.products.length > 0) {
      // Generar HTML para los productos
      const productsHTML = data.products.map(product => ProductCard(product)).join('');
      productGrid.innerHTML = productsHTML;
      
      // Agregar event listeners a los botones de "Agregar al carrito"
      document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
          const product = {
            id: parseInt(this.dataset.id),
            name: this.dataset.name,
            price: parseFloat(this.dataset.price),
            image: this.dataset.image
          };
          
          // Agregar producto al carrito usando localStorage
          let cart = JSON.parse(localStorage.getItem('cart')) || [];
          const existingItemIndex = cart.findIndex(item => item.id === product.id);
          
          if (existingItemIndex > -1) {
            // Si el producto ya está en el carrito, aumentar la cantidad
            cart[existingItemIndex].quantity += 1;
          } else {
            // Si es un producto nuevo, agregarlo al carrito
            cart.push({
              ...product,
              quantity: 1
            });
          }
          
          // Guardar el carrito actualizado en localStorage
          localStorage.setItem('cart', JSON.stringify(cart));
          
          // Actualizar el contador del carrito
          const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
          const cartCount = document.querySelector('.cart-count');
          if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.classList.remove('hidden');
          }
          
          showNotification(`Producto "${product.name}" agregado al carrito`, 'success');
        });
      });
    } else {
      console.log('No se encontraron productos');
      productGrid.innerHTML = '<div class="no-products-message">No hay productos disponibles en este momento.</div>';
    }
  } catch (error) {
    console.error('Error al cargar productos:', error);
    productGrid.innerHTML = '<div class="error-message">Error al cargar productos. Por favor, intente nuevamente.</div>';
  }
}

// Cargar productos cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadHomeProducts);
} else {
  loadHomeProducts();
}

// Exportar la función handleImageError al ámbito global
window.handleImageError = (imgElement) => {
  // Intentar con una imagen de respaldo verificada
  const fallbackImages = [
    '/assets/images/flowers/flower1.svg',
    '/assets/images/flowers/flower2.svg',
    '/assets/images/flowers/flower3.svg',
    '/assets/images/flowers/flower4.svg',
    '/assets/images/flowers/flower5.svg'
  ];
  
  // Encontrar una imagen de respaldo que no sea la que falló
  const workingFallback = fallbackImages.find(img => img !== imgElement.src);
  
  if (workingFallback) {
    imgElement.src = workingFallback;
  } else {
    // Fallback absoluto
    imgElement.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"%3E%3Crect width="300" height="300" fill="%23e0e0e0"/%3E%3Ccircle cx="150" cy="150" r="80" fill="%23a5d6a7"/%3E%3Ccircle cx="110" cy="120" r="15" fill="%234caf50"/%3E%3Ccircle cx="190" cy="120" r="15" fill="%234caf50"/%3E%3Cpath d="M150 170 Q170 200 150 230 Q130 200 150 170" fill="%234caf50"/%3E%3C/svg%3E';
  }
  
  imgElement.alt = 'Imagen no disponible';
  imgElement.onerror = null; // Prevenir bucle infinito si también falla la imagen de marcador de posición
};
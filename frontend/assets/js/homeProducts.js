import { API_BASE_URL, formatPrice, showNotification } from './utils.js';

// Función para cargar y mostrar productos en la página principal
async function loadHomeProducts() {
  const productGrid = document.getElementById('products');
  
  if (!productGrid) {
    console.error('No se encontró el contenedor de productos');
    return;
  }

  try {
    console.log('Cargando productos...');
    const response = await fetch(`${API_BASE_URL}/api/products?limit=8`);
    
    if (!response.ok) {
      throw new Error(`Error al cargar productos: ${response.status} ${response.statusText}`);
    }
    
    const products = await response.json();
    console.log('Productos cargados:', products);
    
    if (products.length === 0) {
      productGrid.innerHTML = '<div class="no-products-message">No hay productos disponibles en este momento.</div>';
      return;
    }
    
    // Generar HTML para los productos
    const productsHTML = products.map(product => `
      <div class="product-card">
        <div class="product-image">
          <img src="${product.image || 'https://images.unsplash.com/photo-1593617133396-03503508724d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'}" 
               alt="${product.name}" 
               onerror="handleImageError(this)">
          <div class="image-error-overlay">Imagen no disponible</div>
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="product-description">${product.description || 'Descripción no disponible'}</p>
          <p class="product-price">${formatPrice(product.price)}</p>
          <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
            <i class="fas fa-shopping-cart"></i> Agregar al carrito
          </button>
        </div>
      </div>
    `).join('');
    
    productGrid.innerHTML = productsHTML;
    
    // Añadir event listeners a los botones de "Agregar al carrito"
    const addToCartButtons = productGrid.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', async function() {
        const productId = this.getAttribute('data-product-id');
        const product = products.find(p => p.id == productId);
        
        if (product) {
          try {
            // Intentar agregar al carrito mediante API
            const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                productId: product.id,
                quantity: 1
              })
            });
            
            if (response.ok) {
              // Actualización exitosa en el servidor
              showAddToCartNotification(product.name);
              updateCartCount();
            } else {
              // Fallback a localStorage si falla la API
              fallbackAddToCart(product);
              showNotification(`Producto "${product.name}" agregado al carrito localmente`, 'warning');
            }
          } catch (error) {
            // Fallback a localStorage en caso de error
            fallbackAddToCart(product);
            showNotification(`Producto "${product.name}" agregado al carrito localmente`, 'warning');
          }
        }
      });
    });
    
  } catch (error) {
    console.error('Error al cargar productos:', error);
    productGrid.innerHTML = `
      <div class="error-message">
        Error al cargar productos. 
        <button class="retry-button" onclick="location.reload()">Reintentar</button>
      </div>
    `;
  }
}

// Función alternativa para agregar al carrito usando localStorage
function fallbackAddToCart(product) {
  let cart = JSON.parse(localStorage.getItem('arreglosVictoriaCart')) || [];
  
  const existingItem = cart.find(item => item.id == product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  
  localStorage.setItem('arreglosVictoriaCart', JSON.stringify(cart));
}

// Función para actualizar el contador del carrito
function updateCartCount() {
  // Primero intentar obtener del servidor
  fetch(`${API_BASE_URL}/api/cart/count`)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject('No se pudo obtener el conteo del carrito');
    })
    .then(data => {
      // Actualizar todos los elementos con clase cart-count
      document.querySelectorAll('.cart-count, #cartCount').forEach(element => {
        element.textContent = data.count;
      });
    })
    .catch(async () => {
      // Si falla, obtener del localStorage como respaldo
      let cart = JSON.parse(localStorage.getItem('arreglosVictoriaCart')) || [];
      const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
      
      document.querySelectorAll('.cart-count, #cartCount').forEach(element => {
        element.textContent = cartCount;
      });
    });
}

// Función para mostrar notificación de producto agregado
function showAddToCartNotification(productName) {
  const notification = document.createElement('div');
  notification.className = 'add-to-cart-notification';
  notification.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${productName} agregado al carrito</span>
  `;
  
  // Aplicar estilos directamente
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4caf50;
    color: white;
    padding: 16px 24px;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Poppins', sans-serif;
    animation: slideIn 0.3s, fadeOut 0.5s 2.5s;
    transition: opacity 0.3s ease-out;
  `;
  
  // Añadir animaciones
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Eliminar la notificación después de 3 segundos
  setTimeout(() => {
    notification.classList.add('fadeOut');
    notification.addEventListener('animationend', () => {
      notification.remove();
      style.remove();
    });
  }, 3000);
}

// Cargar productos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  loadHomeProducts();
  
  // Inicializar el contador del carrito
  updateCartCount();
});

// Exportar funciones necesarias
window.handleImageError = function(imgElement) {
  imgElement.src = 'https://images.unsplash.com/photo-1593617133396-03503508724d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80';
  imgElement.nextElementSibling.style.display = 'block';
};

// Exportar updateCartCount para acceso global
window.updateCartCount = updateCartCount;
// homeProducts.js - Gestión de productos en la página de inicio
import { API_BASE_URL, showNotification } from './utils.js';
import CartUtils from './cartUtils.js';

// Cargar productos destacados
async function loadFeaturedProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products?limit=4`);
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        
        const data = await response.json();
        const products = data.products || data;
        
        const featuredProductsContainer = document.getElementById('featuredProducts');
        
        if (products && products.length > 0) {
            featuredProductsContainer.innerHTML = products.map(product => 
                `<div class="product-card">
                    <div class="product-image">
                        <img src="${product.image || './assets/images/placeholder.svg'}" 
                             alt="${product.name || 'Producto sin nombre'}"
                             loading="lazy"
                             onerror="this.src='./assets/images/placeholder.svg'">
                        <button class="add-to-cart" data-product-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> Agregar al carrito
                        </button>
                    </div>
                    <div class="product-info">
                        <h3>${product.name || 'Producto sin nombre'}</h3>
                        <p class="product-description">${product.description || 'Sin descripción disponible'}</p>
                        <div class="product-price">$${(product.price || 0).toLocaleString()}</div>
                    </div>
                </div>`
            ).join('');
            
            // Añadir event listeners a los botones de agregar al carrito
            initCartEventListeners();
        } else {
            featuredProductsContainer.innerHTML = '<p class="no-products">No hay productos destacados disponibles.</p>';
        }
    } catch (error) {
        console.error('Error loading featured products:', error);
        showNotification('Error al cargar productos destacados', 'error');
    }
}

// Inicializar event listeners para agregar al carrito
function initCartEventListeners() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', async (e) => {
            const productId = e.target.closest('.add-to-cart').dataset.productId;
            console.log('Agregando producto al carrito:', productId);
            
            try {
                const response = await fetch(`${API_BASE_URL}/api/products/${productId}`);
                if (!response.ok) {
                    throw new Error('Error al obtener detalles del producto');
                }
                
                const product = await response.json();
                CartUtils.addToCart(product);
            } catch (error) {
                console.error('Error al agregar producto al carrito:', error);
                showNotification('Error al agregar producto al carrito', 'error');
            }
        });
    });
}

// Exportar funciones
export { loadFeaturedProducts, initCartEventListeners };
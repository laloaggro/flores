// errorHandler.js - Manejo centralizado de errores

/**
 * Maneja los errores mostrando una notificación al usuario
 * @param {Error} error - El objeto de error
 * @param {string} context - Contexto de la operación que falló
 */
function handleError(error, context) {
    console.error(`Error al ${context}:`, error);
    showNotification(`Error al ${context}`, 'error');
}

export default handleError;
// ProductCard.js - Componente unificado para mostrar productos
import { API_BASE_URL } from '../utils.js';

/**
 * Genera el HTML para una tarjeta de producto
 * @param {Object} product - Objeto con los datos del producto
 * @returns {Promise<string>} - HTML de la tarjeta de producto
 */
async function ProductCard(product) {
    // Si no se proporciona una imagen, usamos un placeholder
    const image = product.image ? `${API_BASE_URL}/${product.image}` : './assets/images/placeholder.svg';
    
    return `
        <div class="product-card">
            <div class="product-image">
                <img src="${image}" 
                     alt="${product.name || 'Producto sin nombre'}"
                     loading="lazy"
                     onerror="this.src='./assets/images/placeholder.svg'">
                <button class="add-to-cart" 
                        data-id="${product.id}"
                        data-name="${product.name}"
                        data-price="${product.price}"
                        data-image="${image}">
                    <i class="fas fa-shopping-cart"></i> Agregar al carrito
                </button>
            </div>
            <div class="product-info">
                <h3>${product.name || 'Producto sin nombre'}</h3>
                <p class="product-description">${product.description || 'Sin descripción disponible'}</p>
                <div class="product-price">$${(product.price || 0).toLocaleString()}</div>
            </div>
        </div>`;
}

export default ProductCard;
// homeProducts.js - Gestión de productos en la página de inicio
import { API_BASE_URL, showNotification } from './utils.js';
import CartUtils from './cartUtils.js';
import ProductCard from '../../components/ProductCard.js';
import ErrorHandler from './errorHandler.js';

// Cargar productos destacados
async function loadFeaturedProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products?limit=4`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const products = data.products || data;
        
        const featuredProductsContainer = document.getElementById('featuredProducts');
        
        if (products && products.length > 0) {
            // Generar HTML para cada producto usando el componente unificado
            let productsHTML = '';
            for (const product of products) {
                const productHTML = await ProductCard(product);
                productsHTML += productHTML;
            }
            
            featuredProductsContainer.innerHTML = productsHTML;
        } else {
            featuredProductsContainer.innerHTML = '<p class="no-products">No hay productos destacados disponibles.</p>';
        }
        
        // Reinicializar los eventos de carrito después de cargar nuevos productos
        initCartEventListeners();
        
    } catch (error) {
        ErrorHandler.handleError(error, 'cargar productos destacados');
    }
}

// Inicializa los listeners de eventos para agregar productos al carrito
function initCartEventListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const productId = this.dataset.id;
            const productName = this.dataset.name;
            const productPrice = this.dataset.price;
            const productImage = this.dataset.image;
            
            try {
                // Agregar al carrito usando CartUtils
                CartUtils.addToCart({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage
                });
                
                // Mostrar notificación
                showNotification(`${productName} agregado al carrito`, 'success');
                
                // Actualizar el contador del carrito
                CartUtils.updateCartCount();
                
            } catch (error) {
                ErrorHandler.handleError(error, 'agregar producto al carrito');
            }
        });
    });
}

export { loadFeaturedProducts, initCartEventListeners };
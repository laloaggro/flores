// productCard.js - Componente de tarjeta de producto reutilizable
class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const product = JSON.parse(this.getAttribute('data-product'));
        this.render(product);
        this.addEventListeners();
    }

    render(product) {
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                .product-card {
                    border: 1px solid #e4e4e4;
                    border-radius: 8px;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    max-width: 300px;
                    margin: 1rem;
                    background-color: #fff;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                
                .product-image {
                    position: relative;
                    height: 200px;
                    overflow: hidden;
                }
                
                .product-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }
                
                .product-image:hover img {
                    transform: scale(1.1);
                }
                
                .add-to-cart {
                    position: absolute;
                    bottom: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #ff9900;
                    color: #fff;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .product-image:hover .add-to-cart {
                    opacity: 1;
                }
                
                .product-info {
                    padding: 1rem;
                }
                
                .product-name {
                    font-size: 1.2rem;
                    margin: 0 0 0.5rem;
                }
                
                .product-description {
                    color: #666;
                    font-size: 0.9rem;
                    margin: 0 0 1rem;
                }
                
                .product-price {
                    color: #d44000;
                    font-size: 1.2rem;
                    font-weight: bold;
                    margin: 0;
                }
            </style>
            
            <div class="product-card">
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
                    <h3 class="product-name">${product.name || 'Producto sin nombre'}</h3>
                    <p class="product-description">${product.description || 'Sin descripción disponible'}</p>
                    <div class="product-price">$${(product.price || 0).toLocaleString()}</div>
                </div>
            </div>
        `;
        
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    addEventListeners() {
        this.shadowRoot.querySelector('.add-to-cart').addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = e.currentTarget.dataset.productId;
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
    }
}

customElements.define('product-card', ProductCard);
// homeProducts.js - Gestión de productos en la página de inicio
import { API_BASE_URL, showNotification } from './utils.js';
import CartUtils from './cartUtils.js';
import './productCard.js'; // Importar el componente de tarjeta de producto

// Cargar productos destacados
async function loadFeaturedProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products?limit=4}`);
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        
        const data = await response.json();
        const products = data.products || data;
        
        const featuredProductsContainer = document.getElementById('featuredProductsGrid');
        
        if (products && products.length > 0) {
            // Usar el componente ProductCard para renderizar cada producto
            featuredProductsContainer.innerHTML = products.map(product => 
                `<product-card data-product='${JSON.stringify(product)}'></product-card>`
            ).join('');
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
    // No es necesario definir esta función ya que los eventos están manejados dentro del componente ProductCard
    // Podemos dejarla como una función vacía o eliminarla completamente dependiendo de si otros módulos la utilizan
    return; // Dejamos como función vacía
}

// Exportar funciones
export { loadFeaturedProducts, initCartEventListeners };
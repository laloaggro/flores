// productManager.js - Gestión de productos
import { API_BASE_URL, showNotification } from './utils.js';
import CartUtils from './cartUtils.js';

const productManager = {
    currentPage: 1,
    productsPerPage: 9,
    currentProducts: [],
    
    // Inicializar el gestor de productos
    async init() {
        console.log('Inicializando productManager');
        await this.loadProducts();
        this.initCartEventListeners();
    },
    
    // Cargar productos
    async loadProducts(category = null, search = null) {
        try {
            let url = `${API_BASE_URL}/api/products?page=${this.currentPage}&limit=${this.productsPerPage}`;
            
            if (category) {
                url += `&category=${encodeURIComponent(category)}`;
            }
            
            if (search) {
                url += `&search=${encodeURIComponent(search)}`;
            }
            
            console.log('Cargando productos desde:', url);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error al cargar productos: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Productos cargados:', data);
            
            this.currentProducts = data.products || data;
            this.renderProducts(this.currentProducts);
            
            // Renderizar paginación si es necesario
            if (data.totalPages > 1) {
                this.renderPagination(data.currentPage, data.totalPages);
            }
        } catch (error) {
            console.error('Error al cargar productos:', error);
            showNotification('Error al cargar productos', 'error');
        }
    },
    
    // Renderizar productos
    renderProducts(products) {
        const productGrid = document.getElementById('productGrid');
        if (!productGrid) return;
        
        if (!products || products.length === 0) {
            productGrid.innerHTML = '<p class="no-products">No se encontraron productos.</p>';
            return;
        }
        
        productGrid.innerHTML = products.map(product => `
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
                    <h3>${product.name || 'Producto sin nombre'}</h3>
                    <p class="product-description">${product.description || 'Sin descripción disponible'}</p>
                    <div class="product-price">$${(product.price || 0).toLocaleString()}</div>
                </div>
            </div>
        `).join('');
        
        // Añadir event listeners a los botones de agregar al carrito
        this.initCartEventListeners();
    },
    
    // Renderizar paginación
    renderPagination(currentPage, totalPages) {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;
        
        let paginationHTML = '';
        
        // Botón anterior
        if (currentPage > 1) {
            paginationHTML += `<button class="pagination-btn" data-page="${currentPage - 1}">&laquo; Anterior</button>`;
        }
        
        // Páginas
        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                paginationHTML += `<button class="pagination-btn active" data-page="${i}">${i}</button>`;
            } else {
                paginationHTML += `<button class="pagination-btn" data-page="${i}">${i}</button>`;
            }
        }
        
        // Botón siguiente
        if (currentPage < totalPages) {
            paginationHTML += `<button class="pagination-btn" data-page="${currentPage + 1}">Siguiente &raquo;</button>`;
        }
        
        paginationContainer.innerHTML = paginationHTML;
        
        // Añadir event listeners a los botones de paginación
        document.querySelectorAll('.pagination-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const page = parseInt(e.target.dataset.page);
                if (page && page !== this.currentPage) {
                    this.currentPage = page;
                    this.loadProducts();
                }
            });
        });
    },
    
    // Inicializar event listeners para agregar al carrito
    initCartEventListeners() {
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
    },
    
    // Filtrar productos por categoría
    async filterByCategory(category) {
        this.currentPage = 1;
        await this.loadProducts(category);
    },
    
    // Buscar productos
    async searchProducts(query) {
        this.currentPage = 1;
        await this.loadProducts(null, query);
    }
};

// Exportar productManager
export default productManager;
import { showNotification, formatPrice } from './utils.js';
import CartUtils from './cartUtils.js';

// Variables globales
let allProducts = [];
let currentCategory = 'all';

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado en products.js');
    initializeApp();
});

// Función para esperar a que los componentes personalizados se carguen
function waitForComponents() {
    return new Promise((resolve) => {
        const checkComponents = () => {
            const productGrid = document.getElementById('productGrid');
            const header = document.querySelector('site-header');
            const footer = document.querySelector('site-footer');
            
            if (productGrid) {
                resolve();
            } else {
                // Si los componentes personalizados existen pero el productGrid no, 
                // esperamos un poco más
                setTimeout(checkComponents, 100);
            }
        };
        
        checkComponents();
    });
}

// Inicializar la aplicación
async function initializeApp() {
    try {
        await waitForComponents();
        loadProducts();
        setupCategoryFilter();
        setupSearch();
        initUserMenu();
        
        // Inicializar CartUtils
        CartUtils.init();
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        // Reintentar después de un breve retraso
        setTimeout(initializeApp, 1000);
    }
}

// Cargar productos desde la API
async function loadProducts() {
    const productsGrid = document.getElementById('productGrid');
    if (!productsGrid) {
        console.error('No se encontró el elemento productGrid');
        return;
    }
    
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'loading-message';
    loadingMessage.innerHTML = '<p>Cargando productos...</p>';
    productsGrid.appendChild(loadingMessage);
    
    try {
        console.log('Cargando productos desde: http://localhost:5000/api/products');
        
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        allProducts = data.products;
        displayProducts(data.products);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        const productsGrid = document.getElementById('productGrid');
        if (productsGrid) {
            productsGrid.innerHTML = '<p class="error-message">Error al cargar productos. Por favor, intenta nuevamente más tarde.</p>';
            showNotification('Error al cargar productos', 'error');
        }
    }
}

// Mostrar productos en la cuadrícula
function displayProducts(products) {
    const productsGrid = document.getElementById('productGrid');
    productsGrid.innerHTML = ''; // Limpiar contenido existente
    
    if (products.length === 0) {
        productsGrid.innerHTML = '<p class="no-products-message">No se encontraron productos.</p>';
        return;
    }
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Crear tarjeta de producto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image_url || product.image || './assets/images/placeholder.svg'}" 
                 alt="${product.name}" 
                 onerror="this.src='./assets/images/placeholder.svg'">
            <div class="product-overlay">
                <button class="btn btn-secondary btn-view-details" data-id="${product.id}">Ver Detalles</button>
            </div>
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description || 'Descripción no disponible'}</p>
            <div class="product-price">${formatPrice(product.price)}</div>
            <div class="product-actions">
                <button class="btn btn-primary btn-add-to-cart" data-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                </button>
            </div>
            <div class="product-notification" id="notification-${product.id}">
                <i class="fas fa-check"></i> ¡Agregado al carrito!
            </div>
        </div>
    `;
    
    // Agregar event listeners
    const addToCartButton = card.querySelector('.btn-add-to-cart');
    addToCartButton.addEventListener('click', () => addToCart(product.id));
    
    const viewDetailsButton = card.querySelector('.btn-view-details');
    viewDetailsButton.addEventListener('click', () => viewProductDetails(product.id));
    
    return card;
}

// Función para agregar producto al carrito
function addToCart(productId) {
    // Obtener producto por ID
    const product = allProducts.find(p => p.id == productId);
    if (!product) {
        showNotification('Producto no encontrado', 'error');
        return;
    }
    
    // Usar CartUtils para agregar el producto al carrito
    CartUtils.addToCart(product);
}

// Función para ver detalles del producto
function viewProductDetails(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// Configurar filtro de categoría
function setupCategoryFilter() {
    const categoryLinks = document.querySelectorAll('.category-filter a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            
            // Actualizar clase activa
            document.querySelectorAll('.category-filter a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar productos
            filterProducts(category);
        });
    });
}

// Filtrar productos por categoría
function filterProducts(category) {
    currentCategory = category;
    let filteredProducts = allProducts;
    
    if (category !== 'all') {
        filteredProducts = allProducts.filter(product => product.category === category);
    }
    
    displayProducts(filteredProducts);
}

// Configurar búsqueda
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            if (searchTerm.length >= 2) {
                searchProducts(searchTerm);
            } else if (searchTerm.length === 0) {
                // Si el campo de búsqueda está vacío, mostrar productos de la categoría actual
                filterProducts(currentCategory);
            }
        });
    }
}

// Buscar productos
function searchProducts(term) {
    const filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(term) || 
        (product.description && product.description.toLowerCase().includes(term))
    );
    displayProducts(filteredProducts);
}

// Función para traducir categorías
function translateCategory(categoryKey) {
    const categories = {
        'all': 'Todos',
        'ramos': 'Ramos',
        'arreglos': 'Arreglos',
        'coronas': 'Coronas',
        'insumos': 'Insumos',
        'accesorios': 'Accesorios'
    };
    return categories[categoryKey] || categoryKey;
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    // Esta función ahora es manejada por CartUtils
    CartUtils.updateCartCount();
}

// Inicializar menú de usuario
function initUserMenu() {
    console.log('Menú de usuario inicializado en products.js');
    // Esta función se maneja en userMenu.js
}


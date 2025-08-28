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
        setupSort();
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
        
        // Precargar imágenes
        preloadImages(data.products);
        
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

// Cargar productos por categoría desde la API
async function loadProductsByCategory(category) {
    const productsGrid = document.getElementById('productGrid');
    if (!productsGrid) {
        console.error('No se encontró el elemento productGrid');
        return;
    }
    
    // Mostrar mensaje de carga
    productsGrid.innerHTML = '<p class="loading-message">Cargando productos...</p>';
    
    try {
        console.log(`Cargando productos de la categoría ${category} desde: http://localhost:5000/api/products?category=${category}`);
        
        // Obtener todos los productos de la categoría (sin límite)
        const response = await fetch(`http://localhost:5000/api/products?category=${encodeURIComponent(category)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        let categoryProducts = data.products;
        
        // Si hay más páginas, cargar todas
        if (data.pagination && data.pagination.totalPages > 1) {
            for (let page = 2; page <= data.pagination.totalPages; page++) {
                const nextPageResponse = await fetch(`http://localhost:5000/api/products?category=${encodeURIComponent(category)}&page=${page}`);
                if (nextPageResponse.ok) {
                    const nextPageData = await nextPageResponse.json();
                    categoryProducts = categoryProducts.concat(nextPageData.products);
                }
            }
        }
        
        // Precargar imágenes
        preloadImages(categoryProducts);
        
        displayProducts(categoryProducts);
    } catch (error) {
        console.error('Error al cargar productos por categoría:', error);
        const productsGrid = document.getElementById('productGrid');
        if (productsGrid) {
            productsGrid.innerHTML = '<p class="error-message">Error al cargar productos. Por favor, intenta nuevamente más tarde.</p>';
            showNotification('Error al cargar productos', 'error');
        }
    }
}

// Precargar imágenes de productos
function preloadImages(products) {
    products.forEach(product => {
        const imageUrl = product.image_url || product.image || './assets/images/placeholder.svg';
        
        // Asegurarse de que la ruta de la imagen sea correcta
        let correctImageUrl = imageUrl;
        if (imageUrl.startsWith('/assets/images/')) {
            correctImageUrl = `.${imageUrl}`;
        } else if (imageUrl.startsWith('assets/images/')) {
            correctImageUrl = `./${imageUrl}`;
        } else if (!imageUrl.startsWith('./assets/images/') && !imageUrl.startsWith('http')) {
            // Si la imagen no es una URL completa ni una ruta relativa correcta, usar el placeholder
            correctImageUrl = './assets/images/placeholder.svg';
        }
        
        // Crear una imagen para precargar
        const img = new Image();
        img.src = correctImageUrl;
    });
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
    
    // Verificar si la imagen es AVIF y proporcionar fallback
    let imageUrl = product.image_url || product.image || './assets/images/placeholder.svg';
    
    // Asegurarse de que la ruta de la imagen sea correcta
    if (imageUrl.startsWith('/assets/images/')) {
        imageUrl = `.${imageUrl}`;
    } else if (imageUrl.startsWith('assets/images/')) {
        imageUrl = `./${imageUrl}`;
    } else if (!imageUrl.startsWith('./assets/images/') && !imageUrl.startsWith('http')) {
        // Si la imagen no es una URL completa ni una ruta relativa correcta, usar el placeholder
        imageUrl = './assets/images/placeholder.svg';
    }
    
    card.innerHTML = `
        <div class="product-image" style="padding: 1rem;">
            <img src="${imageUrl}" alt="${product.name}" onerror="this.src='./assets/images/placeholder.svg'" style="width: 100%; height: 100%; object-fit: cover;">
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
    if (addToCartButton) {
        addToCartButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product.id);
        });
    }
    
    const viewDetailsButton = card.querySelector('.btn-view-details');
    if (viewDetailsButton) {
        viewDetailsButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            viewProductDetails(product.id);
        });
    }
    
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
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const category = this.value;
            filterProductsByCategory(category);
        });
    }
}

// Configurar ordenamiento
function setupSort() {
    const sortOrder = document.getElementById('sortOrder');
    if (sortOrder) {
        sortOrder.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }
}

// Filtrar productos por categoría
function filterProductsByCategory(category) {
    currentCategory = category;
    
    if (category && category !== '') {
        // Cargar productos específicos de la categoría desde la API
        loadProductsByCategory(category);
    } else {
        // Mostrar todos los productos
        displayProducts(allProducts);
    }
}

// Ordenar productos
function sortProducts(sortType, products = null) {
    let productsToSort = products || [...allProducts];
    
    switch(sortType) {
        case 'name':
            productsToSort.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            productsToSort.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            productsToSort.sort((a, b) => b.price - a.price);
            break;
    }
    
    displayProducts(productsToSort);
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
                filterProductsByCategory(currentCategory);
            }
        });
    }
}

// Buscar productos
function searchProducts(term) {
    let filteredProducts = [...allProducts];
    
    // Aplicar filtro de categoría si existe
    if (currentCategory && currentCategory !== '') {
        filteredProducts = filteredProducts.filter(product => 
            product.category && product.category.toLowerCase() === currentCategory.toLowerCase());
    }
    
    // Aplicar búsqueda
    filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(term) || 
        (product.description && product.description.toLowerCase().includes(term)));
    
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
        'accesorios': 'Accesorios',
        'condolencias': 'Condolencias',
        'jardinería': 'Jardinería'
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
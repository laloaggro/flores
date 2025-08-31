import { showNotification, formatPrice } from './utils.js';
import CartUtils from './cartUtils.js';
import UserMenu from './userMenu.js';
import ErrorHandler from './errorHandler.js';

// Variables globales
let allProducts = [];
let currentCategory = 'all';
let API_BASE_URL = 'http://localhost:5000'; // Añadimos la URL base de la API

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
        
        // Eliminamos la llamada a initUserMenu() ya que se maneja en userMenu.js
        UserMenu.init();
        
        // Inicializar CartUtils
        CartUtils.init();
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        ErrorHandler.handleGenericError(error, 'inicializar la aplicación');
        // Reintentar después de un breve retraso
        setTimeout(initializeApp, 1000);
    }
}

/**
 * Cargar productos desde la API
 * @param {Object} filters - Filtros para la búsqueda de productos
 */
async function loadProducts(filters = {}) {
    try {
        console.log('Cargando productos con filtros:', filters);
        
        const productsGrid = document.getElementById('productGrid');
        if (!productsGrid) {
            console.error('No se encontró el elemento productGrid');
            return;
        }
        
        // Mostrar indicador de carga
        productsGrid.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p class="loading-text">Cargando productos...</p>
            </div>
        `;
        
        // Construir URL con parámetros de búsqueda
        const params = new URLSearchParams();
        
        if (filters.search) {
            params.append('search', filters.search);
        }
        
        if (filters.category && filters.category !== 'all') {
            params.append('category', filters.category);
        }
        
        if (filters.minPrice !== undefined) {
            params.append('minPrice', filters.minPrice);
        }
        
        if (filters.maxPrice !== undefined) {
            params.append('maxPrice', filters.maxPrice);
        }
        
        if (filters.sortBy) {
            params.append('sortBy', filters.sortBy);
        }
        
        if (filters.order) {
            params.append('order', filters.order);
        }
        
        // Determinar la URL base según el entorno
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const baseUrl = isLocalhost ? 'http://localhost:5000' : 'https://arreglos-victoria-backend.onrender.com';
        
        const url = `${baseUrl}/api/products?${params.toString()}`;
        console.log('URL de solicitud:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error al cargar productos: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('Respuesta de la API:', result); // Para depuración
        
        // Verificar la estructura de la respuesta
        if (Array.isArray(result)) {
            // Si la respuesta es directamente un array
            allProducts = result;
        } else if (result && Array.isArray(result.data)) {
            // Si la respuesta tiene una propiedad data que es un array
            allProducts = result.data;
        } else if (result && Array.isArray(result.products)) {
            // Si la respuesta tiene una propiedad products que es un array
            allProducts = result.products;
        } else {
            // Si no se puede determinar la estructura, usar un array vacío
            console.warn('La estructura de la respuesta no es la esperada:', result);
            allProducts = [];
        }
        
        displayProducts(allProducts);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        ErrorHandler.handleGenericError(error, 'cargar productos');
        const productsGrid = document.getElementById('productGrid');
        if (productsGrid) {
            productsGrid.innerHTML = `
                <div class="error-container">
                    <p class="error-message">Error al cargar productos. Por favor, inténtelo de nuevo más tarde.</p>
                    <button class="btn btn-primary" onclick="loadProducts()">Reintentar</button>
                </div>
            `;
        }
        showNotification('Error al cargar productos', 'error');
    }
}

/**
 * Cargar productos por categoría desde la API
 * @param {string} category - Categoría de productos a cargar
 */
async function loadProductsByCategory(category) {
    try {
        console.log(`Cargando productos de la categoría ${category}`);
        
        const productsGrid = document.getElementById('productGrid');
        if (!productsGrid) {
            console.error('No se encontró el elemento productGrid');
            return;
        }
        
        // Mostrar indicador de carga
        productsGrid.innerHTML = '<p class="loading-message">Cargando productos...</p>';
        
        // Construir URL con parámetros
        const params = new URLSearchParams();
        params.append('category', category);
        
        const url = `${API_BASE_URL}/api/products?${params.toString()}`;
        console.log('URL de solicitud:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('No se encontraron productos en esta categoría');
            } else {
                throw new Error(`Error al cargar productos: ${response.status} ${response.statusText}`);
            }
        }
        
        const data = await response.json();
        let categoryProducts = data.products;
        
        // Si hay más páginas, cargar todas
        if (data.pagination && data.pagination.totalPages > 1) {
            for (let page = 2; page <= data.pagination.totalPages; page++) {
                const nextPageResponse = await fetch(`${API_BASE_URL}/api/products?category=${encodeURIComponent(category)}&page=${page}`);
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
            productsGrid.innerHTML = `
                <div class="error-message">
                    <p>${error.message}</p>
                    <button onclick="location.reload()" class="btn btn-primary">Reintentar</button>
                </div>
            `;
        }
        showNotification(error.message, 'error');
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

/**
 * Crear tarjeta de producto
 * @param {Object} product - Objeto con información del producto
 * @returns {string} - HTML de la tarjeta de producto
 */
function createProductCard(product) {
    // Verificar que el producto tenga todas las propiedades necesarias
    if (!product || !product.id || !product.name) {
        console.error('Producto inválido:', product);
        return '';
    }
    
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
        <div class="product-image">
            <img src="${imageUrl}" alt="${product.name}" onerror="this.src='./assets/images/placeholder.svg'">
            <button class="add-to-cart" data-id="${product.id}" aria-label="Agregar ${product.name} al carrito">
                <i class="fas fa-shopping-cart"></i>
                <span class="tooltip">Agregar al carrito</span>
            </button>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description || 'Sin descripción'}</p>
            <div class="product-price">${formatPrice(parseFloat(product.price) || 0)}</div>
            <button class="btn btn-primary view-details" data-id="${product.id}" aria-label="Ver detalles de ${product.name}">
                Ver detalles
            </button>
        </div>
        <div class="product-notification" id="notification-${product.id}">
            <i class="fas fa-check"></i> Agregado al carrito
        </div>
    `;
    
    // Agregar event listeners a los botones
    const addToCartButton = card.querySelector('.add-to-cart');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product.id);
        });
    }
    
    const viewDetailsButton = card.querySelector('.view-details');
    if (viewDetailsButton) {
        viewDetailsButton.addEventListener('click', function(e) {
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

/**
 * Buscar productos
 * @param {string} term - Término de búsqueda
 */
function searchProducts(term) {
    try {
        console.log('Buscando productos con el término:', term);
        
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
    } catch (error) {
        console.error('Error al buscar productos:', error);
        showNotification('Error al realizar la búsqueda', 'error');
    }
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

/**
 * Mostrar imagen del producto
 * @param {Object} product - Producto para mostrar la imagen
 * @returns {HTMLElement} - Elemento de imagen
 */
function displayProductImage(product) {
    const imgElement = document.createElement('img');
    imgElement.src = product.image_url || product.image || './assets/images/placeholder.svg';
    imgElement.alt = product.name;
    imgElement.className = 'product-image-main';
    imgElement.loading = 'lazy';
    return imgElement;
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

import { API_BASE_URL, showNotification } from './utils.js';
import { initUserMenu } from './auth.js';

// Variable para almacenar todos los productos
let allProducts = [];

// Función para implementar debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Función para mostrar indicador de carga
function showLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
}

// Función para ocultar indicador de carga
function hideLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

// Función para mostrar mensaje de error
function showError(message) {
    const productGrid = document.getElementById('productGrid');
    if (productGrid) {
        productGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="loadProducts()">Reintentar</button>
            </div>
        `;
    }
}

// Función para cargar productos con manejo de errores
async function loadProducts() {
    showLoading();
    
    try {
        // Simular carga de productos
        const response = await fetch('/api/products');
        
        if (!response.ok) {
            throw new Error(`Error al cargar productos: ${response.status} ${response.statusText}`);
        }
        
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        showError('No se pudieron cargar los productos. Por favor, inténtalo de nuevo más tarde.');
    } finally {
        hideLoading();
    }
}

// Función para cargar todos los productos
async function loadAllProducts() {
    try {
        console.log('Cargando productos desde:', `${API_BASE_URL}/api/products`);
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }
        const products = await response.json();
        allProducts = products.products || products; // Almacenar productos en variable global
        displayProducts(allProducts);
        updateProductCount(allProducts.length);
        return allProducts;
    } catch (error) {
        console.error('Error al cargar productos:', error);
        showNotification('Error al cargar los productos. Por favor, intente nuevamente.', 'error');
        return [];
    }
}

// Función para mostrar productos en la página
function displayProducts(products) {
    const container = document.getElementById('productGrid');
    if (!container) return;

    // Asegurarse de acceder a los productos correctamente
    const productList = products.products || products;
    
    if (productList.length === 0) {
        container.innerHTML = '<p class="no-products">No se encontraron productos.</p>';
        return;
    }

    container.innerHTML = productList.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image_url || product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOHB4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjM1ZW0iIGZpbGw9IiM5OTkiPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=='; this.onerror=null;">
                <button class="add-to-cart" data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Agregar al carrito
                </button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price.toLocaleString()}</div>
                <div class="product-category">${getCategoryName(product.category)}</div>
            </div>
        </div>
    `).join('');

    // Añadir event listeners a los botones de agregar al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            addToCart(productId);
        });
    });
}

// Función para obtener el nombre de la categoría
function getCategoryName(categoryKey) {
    const categories = {
        'arreglos': 'Arreglos Florales',
        'ramos': 'Ramos',
        'plantas': 'Plantas',
        'accesorios': 'Accesorios'
    };
    return categories[categoryKey] || categoryKey;
}

// Función para agregar producto al carrito
function addToCart(productId) {
    // Esta función se implementará completamente en una actualización futura
    showNotification('Producto agregado al carrito', 'success');
}

// Función para filtrar productos por categoría
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    
    products.forEach(product => {
        if (category === '' || product.getAttribute('data-category') === category) {
            product.style.display = 'block';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });
    
    updateProductCount(visibleCount);
}

// Función para actualizar el contador de productos
function updateProductCount(count) {
    // No hay contador en el HTML actual, pero mantenemos la función por si se agrega en el futuro
}

// Función para buscar productos
function searchProducts(query) {
    if (!query) {
        displayProducts(allProducts);
        updateProductCount(allProducts.length);
        return;
    }
    
    const filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    displayProducts(filteredProducts);
    updateProductCount(filteredProducts.length);
}

// Función para ordenar productos
function sortProducts(products, sortBy) {
    const sortedProducts = [...products];
    
    switch(sortBy) {
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        default:
            return sortedProducts;
    }
    
    return sortedProducts;
}

// Event listeners
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM cargado en products.js');
    
    // Cargar productos
    await loadAllProducts();
    
    // Configurar filtro de categorías
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterProducts(this.value);
        });
    }
    
    // Configurar búsqueda con debounce
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        const debouncedSearch = debounce((e) => {
            searchProducts(e.target.value);
        }, 300);
        
        searchInput.addEventListener('input', debouncedSearch);
    }
    
    // Configurar ordenamiento
    const sortOrder = document.getElementById('sortOrder');
    if (sortOrder) {
        sortOrder.addEventListener('change', function() {
            const sortedProducts = sortProducts(allProducts, this.value);
            displayProducts(sortedProducts);
        });
    }
});

// Inicializar menú de usuario cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el menú de usuario
    try {
        initUserMenu();
        console.log('Menú de usuario inicializado en products.js');
    } catch (error) {
        console.error('Error al inicializar el menú de usuario en products.js:', error);
    }
});
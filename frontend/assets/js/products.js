import { API_BASE_URL, showNotification } from './utils.js';
import { initUserMenu } from './auth.js';

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

// Función para cargar todos los productos
async function loadAllProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }
        const products = await response.json();
        displayProducts(products);
        updateProductCount(products.length);
        return products;
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

    if (products.length === 0) {
        container.innerHTML = '<p class="no-products">No se encontraron productos.</p>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOHB4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjM1ZW0iIGZpbGw9IiM5OTkiPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=='; this.onerror=null;">
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
        if (category === 'all' || product.getAttribute('data-category') === category) {
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
    const countElement = document.getElementById('productCount');
    if (countElement) {
        countElement.textContent = `${count} productos disponibles`;
    }
}

// Función para buscar productos
function searchProducts(query, allProducts) {
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
        case 'name-asc':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price-asc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
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
    
    // Configurar filtro de categorías
    const categoryLinks = document.querySelectorAll('.category-filter a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            
            // Actualizar enlaces activos
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar productos
            filterProducts(category);
        });
    });
    
    // Configurar búsqueda con debounce
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        const debouncedSearch = debounce((query) => {
            searchProducts(query, allProducts);
        }, 300);
        
        searchInput.addEventListener('input', function() {
            debouncedSearch(this.value);
        });
    }
    
    // Configurar ordenamiento
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
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
    
    // Cargar productos
    loadAllProducts();
});

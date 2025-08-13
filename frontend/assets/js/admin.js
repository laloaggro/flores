import { API_BASE_URL, showNotification, isAuthenticated, requireAuth } from './utils.js';
import { initUserMenu } from './auth.js';

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', async function() {
    if (!requireAuth()) {
        return;
    }
    
    // Inicializar menú de usuario
    initUserMenu();
    
    // Inicializar la página de administración
    initAdminPage();
});

// Inicializar la página de administración
async function initAdminPage() {
    // Configurar pestañas
    setupTabs();
    
    // Cargar productos
    await loadProducts();
    
    // Cargar categorías
    await loadCategories();
    
    // Cargar datos de contabilidad
    await loadAccountingData();
    
    // Configurar eventos
    setupEventListeners();
}

// Configurar pestañas
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            
            // Actualizar botones activos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Mostrar pestaña correspondiente
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `${tabId}-tab`) {
                    pane.classList.add('active');
                }
            });
        });
    });
}

// Cargar productos
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (!response.ok) {
            throw new Error('Error al cargar productos');
        }
        
        const data = await response.json();
        displayProducts(data.products);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        showNotification('Error al cargar productos', 'error');
    }
}

// Mostrar productos en la tabla
function displayProducts(products) {
    const tableBody = document.getElementById('productsTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>$${parseInt(product.price).toLocaleString('es-CL')}</td>
            <td>${product.category}</td>
            <td>
                <button class="btn btn-secondary btn-small edit-product" data-id="${product.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger btn-small delete-product" data-id="${product.id}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        </tr>
    `).join('');
    
    // Agregar eventos a los botones
    document.querySelectorAll('.edit-product').forEach(button => {
        button.addEventListener('click', () => editProduct(button.dataset.id));
    });
    
    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', () => deleteProduct(button.dataset.id));
    });
}

// Cargar categorías
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/categories`);
        if (!response.ok) {
            throw new Error('Error al cargar categorías');
        }
        
        const data = await response.json();
        const categoryFilter = document.getElementById('categoryFilter');
        
        if (categoryFilter) {
            data.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
}

// Cargar datos de contabilidad
async function loadAccountingData() {
    try {
        // En una implementación real, aquí se harían llamadas al backend
        // para obtener datos de ventas, pedidos, etc.
        
        // Datos de ejemplo
        document.getElementById('totalSales').textContent = '$1.250.000';
        document.getElementById('completedOrders').textContent = '42';
        document.getElementById('monthlyRevenue').textContent = '$320.000';
        
        // Cargar pedidos de ejemplo
        displayOrders([
            { id: '001', date: '2023-06-15', customer: 'Juan Pérez', total: 15000, status: 'Completado' },
            { id: '002', date: '2023-06-16', customer: 'María González', total: 22500, status: 'Completado' },
            { id: '003', date: '2023-06-17', customer: 'Carlos López', total: 18750, status: 'Pendiente' }
        ]);
    } catch (error) {
        console.error('Error al cargar datos de contabilidad:', error);
        showNotification('Error al cargar datos de contabilidad', 'error');
    }
}

// Mostrar pedidos en la tabla
function displayOrders(orders) {
    const tableBody = document.getElementById('ordersTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.date}</td>
            <td>${order.customer}</td>
            <td>$${order.total.toLocaleString('es-CL')}</td>
            <td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td>
        </tr>
    `).join('');
}

// Configurar eventos
function setupEventListeners() {
    // Botón para agregar producto
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => openProductModal());
    }
    
    // Formulario de producto
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleProductFormSubmit);
    }
    
    // Botón cancelar en modal
    const cancelProductBtn = document.getElementById('cancelProductBtn');
    if (cancelProductBtn) {
        cancelProductBtn.addEventListener('click', closeProductModal);
    }
    
    // Cerrar modal con X
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', closeProductModal);
    });
    
    // Cerrar modal haciendo clic fuera
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeProductModal();
            }
        });
    }
    
    // Búsqueda de productos
    const searchProduct = document.getElementById('searchProduct');
    if (searchProduct) {
        searchProduct.addEventListener('input', debounce(handleSearch, 300));
    }
}

// Abrir modal para agregar producto
function openProductModal(product = null) {
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const productId = document.getElementById('productId');
    
    if (product) {
        // Editar producto existente
        modalTitle.textContent = 'Editar Producto';
        productId.value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productImage').value = product.image_url || '';
    } else {
        // Agregar nuevo producto
        modalTitle.textContent = 'Agregar Producto';
        productId.value = '';
        document.getElementById('productForm').reset();
    }
    
    if (modal) {
        modal.style.display = 'block';
    }
}

// Cerrar modal
function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Manejar envío del formulario de producto
async function handleProductFormSubmit(e) {
    e.preventDefault();
    
    const productId = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        image_url: document.getElementById('productImage').value || '/assets/images/products/product_1.svg'
    };
    
    try {
        let response;
        if (productId) {
            // Actualizar producto existente
            response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
        } else {
            // Crear nuevo producto
            response = await fetch(`${API_BASE_URL}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
        }
        
        if (!response.ok) {
            throw new Error('Error al guardar el producto');
        }
        
        showNotification('Producto guardado correctamente', 'success');
        closeProductModal();
        await loadProducts(); // Recargar la lista de productos
    } catch (error) {
        console.error('Error al guardar el producto:', error);
        showNotification('Error al guardar el producto', 'error');
    }
}

// Editar producto
async function editProduct(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/${productId}`);
        if (!response.ok) {
            throw new Error('Error al obtener el producto');
        }
        
        const product = await response.json();
        openProductModal(product);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        showNotification('Error al obtener el producto', 'error');
    }
}

// Eliminar producto
async function deleteProduct(productId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar el producto');
        }
        
        showNotification('Producto eliminado correctamente', 'success');
        await loadProducts(); // Recargar la lista de productos
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        showNotification('Error al eliminar el producto', 'error');
    }
}

// Manejar búsqueda con debounce
function handleSearch() {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('#productsTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Función debounce para evitar llamadas frecuentes
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}
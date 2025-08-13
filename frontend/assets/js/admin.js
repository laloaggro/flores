import { API_BASE_URL, showNotification, isAuthenticated, requireAdmin } from './utils.js';
import { initUserMenu } from './auth.js';

// Verificar autenticación y rol de administrador al cargar la página
document.addEventListener('DOMContentLoaded', async function() {
    if (!requireAdmin()) {
        return;
    }
    
    // Inicializar menú de usuario
    initUserMenu();
    
    // Cargar contenido de administración
    loadAdminContent();
});

// Cargar contenido de administración
function loadAdminContent() {
    const adminApp = document.getElementById('admin-app');
    
    if (!adminApp) return;
    
    adminApp.innerHTML = `
        <header>
            <div class="container">
                <nav class="navbar" role="navigation" aria-label="Menú principal">
                    <a href="index.html" class="logo"><i class="fas fa-leaf" aria-hidden="true"></i> Arreglos Victoria</a>
                    <ul class="nav-links">
                        <li><a href="index.html">Inicio</a></li>
                        <li><a href="products.html">Productos</a></li>
                        <li><a href="index.html#about">Nosotros</a></li>
                        <li><a href="index.html#contacto">Contacto</a></li>
                    </ul>
                    <div class="user-menu" id="userMenu">
                        <div class="user-info" id="userInfo">
                            <span id="userName"></span>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <div class="user-dropdown" id="userDropdown">
                            <a href="profile.html"><i class="fas fa-user"></i> Mi Perfil</a>
                            <a href="admin.html"><i class="fas fa-cog"></i> Administración</a>
                            <a href="#" id="logoutLink"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a>
                        </div>
                    </div>
                    <a href="login.html" class="login-link" id="loginLink">
                        <i class="fas fa-user"></i> Iniciar Sesión
                    </a>
                    <div class="cart-icon" role="button" tabindex="0" aria-label="Carrito de compras">
                        <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                        <span class="cart-count">0</span>
                    </div>
                </nav>
            </div>
        </header>

        <main class="admin-page">
            <div class="container">
                <div class="admin-header">
                    <h1>Panel de Administración</h1>
                    <p>Bienvenido al panel de administración de Arreglos Victoria</p>
                </div>

                <div class="admin-tabs">
                    <button class="tab-button active" data-tab="inventory">Gestión de Inventario</button>
                    <button class="tab-button" data-tab="accounting">Contabilidad</button>
                </div>

                <div class="tab-content">
                    <!-- Gestión de Inventario -->
                    <div id="inventory-tab" class="tab-pane active">
                        <div class="admin-section">
                            <div class="section-header">
                                <h2><i class="fas fa-boxes"></i> Gestión de Inventario</h2>
                                <button id="addProductBtn" class="btn btn-primary">
                                    <i class="fas fa-plus"></i> Agregar Producto
                                </button>
                            </div>
                            
                            <div class="filters">
                                <input type="text" id="searchProduct" placeholder="Buscar productos..." class="filter-input">
                                <select id="categoryFilter" class="filter-select">
                                    <option value="">Todas las categorías</option>
                                </select>
                            </div>
                            
                            <div class="table-container">
                                <table class="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Descripción</th>
                                            <th>Precio</th>
                                            <th>Categoría</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody id="productsTableBody">
                                        <!-- Los productos se cargarán aquí dinámicamente -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Contabilidad -->
                    <div id="accounting-tab" class="tab-pane">
                        <div class="admin-section">
                            <div class="section-header">
                                <h2><i class="fas fa-chart-line"></i> Contabilidad</h2>
                            </div>
                            
                            <div class="accounting-summary">
                                <div class="summary-card">
                                    <h3>Ventas Totales</h3>
                                    <p class="summary-value" id="totalSales">$0</p>
                                </div>
                                <div class="summary-card">
                                    <h3>Pedidos Completados</h3>
                                    <p class="summary-value" id="completedOrders">0</p>
                                </div>
                                <div class="summary-card">
                                    <h3>Ingresos del Mes</h3>
                                    <p class="summary-value" id="monthlyRevenue">$0</p>
                                </div>
                            </div>
                            
                            <div class="table-container">
                                <table class="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID Pedido</th>
                                            <th>Fecha</th>
                                            <th>Cliente</th>
                                            <th>Total</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody id="ordersTableBody">
                                        <!-- Los pedidos se cargarán aquí dinámicamente -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Modal para agregar/editar producto -->
        <div id="productModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modalTitle">Agregar Producto</h2>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="productForm">
                        <input type="hidden" id="productId">
                        <div class="form-group">
                            <label for="productName">Nombre del Producto</label>
                            <input type="text" id="productName" required>
                        </div>
                        <div class="form-group">
                            <label for="productDescription">Descripción</label>
                            <textarea id="productDescription" rows="3" required></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="productPrice">Precio</label>
                                <input type="number" id="productPrice" min="0" step="100" required>
                            </div>
                            <div class="form-group">
                                <label for="productCategory">Categoría</label>
                                <select id="productCategory" required>
                                    <option value="">Seleccionar categoría</option>
                                    <option value="Ramos">Ramos</option>
                                    <option value="Arreglos">Arreglos</option>
                                    <option value="Coronas">Coronas</option>
                                    <option value="Bouquets">Bouquets</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="productImage">URL de la Imagen</label>
                            <input type="text" id="productImage">
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" id="cancelProductBtn">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Guardar Producto</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <footer>
            <div class="container">
                <div class="footer-content">
                    <div class="footer-logo">
                        <h2><i class="fas fa-leaf" aria-hidden="true"></i> Arreglos Victoria</h2>
                        <p>Florería & Delivery</p>
                    </div>
                    <div class="footer-links">
                        <h4>Enlaces</h4>
                        <ul>
                            <li><a href="index.html">Inicio</a></li>
                            <li><a href="products.html">Productos</a></li>
                            <li><a href="index.html#about">Nosotros</a></li>
                            <li><a href="index.html#contacto">Contacto</a></li>
                        </ul>
                    </div>
                    <div class="footer-contact">
                        <h4>Contacto</h4>
                        <p><i class="fas fa-map-marker-alt" aria-hidden="true"></i> <span aria-label="Dirección">Av. Valdivieso 593, 8441510 Recoleta, Región Metropolitana</span></p>
                        <p><i class="fas fa-phone" aria-hidden="true"></i> <span aria-label="Teléfono">+569 6360 3177</span></p>
                        <p><i class="fas fa-envelope" aria-hidden="true"></i> <span aria-label="Correo electrónico">arreglosvictoriafloreria@gmail.com</span></p>
                    </div>
                    <div class="footer-social">
                        <h4>Síguenos</h4>
                        <div class="social-links">
                            <a href="https://www.facebook.com/profile.php?id=61578999845743" target="_blank" aria-label="Facebook">
                                <i class="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://www.instagram.com/arreglosvictoria/" target="_blank" aria-label="Instagram">
                                <i class="fab fa-instagram"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2023 Arreglos Victoria. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    `;
    
    // Inicializar la página de administración
    initAdminPage();
}

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
        const response = await fetch(`${API_BASE_URL}/api/products/categories/all`);
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
        const token = localStorage.getItem('token');
        
        if (productId) {
            // Actualizar producto existente
            response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });
        } else {
            // Crear nuevo producto
            response = await fetch(`${API_BASE_URL}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });
        }
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al guardar el producto');
        }
        
        showNotification('Producto guardado correctamente', 'success');
        closeProductModal();
        await loadProducts(); // Recargar la lista de productos
    } catch (error) {
        console.error('Error al guardar el producto:', error);
        showNotification(error.message || 'Error al guardar el producto', 'error');
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
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar el producto');
        }
        
        showNotification('Producto eliminado correctamente', 'success');
        await loadProducts(); // Recargar la lista de productos
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        showNotification(error.message || 'Error al eliminar el producto', 'error');
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
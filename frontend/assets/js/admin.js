// admin.js - Funcionalidad del panel de administración
import { API_BASE_URL, isAuthenticated, isAdmin, getAuthToken } from './utils.js';
import { initUserMenu } from './auth.js';

// Importar Chart.js para los gráficos
import Chart from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/+esm';

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    if (!isAuthenticated()) {
        window.location.href = '../login.html';
        return;
    }
    
    // Verificar rol de administrador
    if (!isAdmin()) {
        window.location.href = '../index.html';
        return;
    }
    
    // Inicializar el menú de usuario
    initUserMenu();
    
    // Resto del código de admin.js
    const menuLinks = document.querySelectorAll('.admin-menu a');
    const contentSections = document.querySelectorAll('.admin-content-section');
    
    // Función para cambiar de sección
    function changeSection(sectionId) {
        // Ocultar todas las secciones
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostrar la sección seleccionada
        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            // Enfocar el encabezado de la sección para mejor navegación
            const heading = targetSection.querySelector('h2');
            if (heading) {
                heading.setAttribute('tabindex', '-1');
                heading.focus();
            }
        }
        
        // Actualizar enlaces activos
        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
        
        // Cargar datos específicos de la sección
        switch(sectionId) {
            case 'dashboard':
                loadDashboardData();
                break;
            case 'products':
                loadAllProducts();
                break;
            case 'orders':
                loadOrders();
                break;
            case 'users':
                loadUsers();
                setupUserEvents();
                break;
            case 'reviews':
                loadReviews();
                break;
            case 'settings':
                initSettings();
                break;
        }
    }
    
    // Agregar event listeners a los enlaces del menú
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            changeSection(sectionId);
        });
        
        // Añadir atributos de accesibilidad
        link.setAttribute('role', 'tab');
        link.setAttribute('aria-selected', 'false');
    });
    
    // Cargar datos del dashboard
    loadDashboardData();
    
    // Configurar eventos de productos
    setupProductEvents();
    
    // Configurar eventos de usuarios
    setupUserEvents();
    
    // Configurar vista previa de imágenes
    setupImagePreview();
    
    // Inicializar configuración
    initSettings();
    
    // Configurar filtro de pedidos
    setupOrderFilter();
});

// Función para cargar datos del dashboard
async function loadDashboardData() {
    try {
        // Cargar estadísticas
        const statsResponse = await fetch(`${API_BASE_URL}/api/products/stats`);
        const stats = await statsResponse.json();
        
        document.getElementById('totalProducts').textContent = stats.totalProducts || 0;
        document.getElementById('totalOrders').textContent = stats.totalOrders || 0;
        document.getElementById('totalUsers').textContent = stats.totalUsers || 0;
        document.getElementById('totalRevenue').textContent = `$${(stats.totalRevenue || 0).toFixed(2)}`;
        
        // Calcular valores adicionales
        const avgOrderValue = stats.totalOrders ? stats.totalRevenue / stats.totalOrders : 0;
        document.getElementById('avgOrderValue').textContent = `$${avgOrderValue.toFixed(2)}`;
        
        // Tasa de conversión (ejemplo: 5%)
        document.getElementById('conversionRate').textContent = '5%';
        
        // Cargar productos recientes
        const productsResponse = await fetch(`${API_BASE_URL}/api/products?limit=5`);
        const productsData = await productsResponse.json();
        const products = productsData.products || productsData;
        
        const productsTableBody = document.getElementById('productsTableBody');
        productsTableBody.innerHTML = '';
        
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.category}</td>
                <td>
                    <button class="btn-icon view-btn" title="Ver" aria-label="Ver detalles de ${product.name}">
                        <i class="fas fa-eye" aria-hidden="true"></i>
                    </button>
                    <button class="btn-icon edit-btn" title="Editar" data-id="${product.id}" aria-label="Editar ${product.name}">
                        <i class="fas fa-edit" aria-hidden="true"></i>
                    </button>
                    <button class="btn-icon delete-btn" title="Eliminar" data-id="${product.id}" aria-label="Eliminar ${product.name}">
                        <i class="fas fa-trash" aria-hidden="true"></i>
                    </button>
                </td>
            `;
            
            // Agregar eventos a los botones
            const editBtn = row.querySelector('.edit-btn');
            const deleteBtn = row.querySelector('.delete-btn');
            
            editBtn.addEventListener('click', () => {
                editProduct(product.id);
            });
            
            deleteBtn.addEventListener('click', () => {
                deleteProduct(product.id);
            });
            
            productsTableBody.appendChild(row);
        });
        
        // Cargar datos para los gráficos
        loadChartData();
        
        // Cargar actividades recientes
        loadRecentActivities();
    } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
    }
}

// Función para cargar datos de los gráficos
async function loadChartData() {
    try {
        // Datos de ejemplo para los gráficos
        const salesData = {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Ventas',
                data: [12000, 19000, 15000, 18000, 22000, 25000],
                backgroundColor: 'rgba(90, 143, 105, 0.6)',
                borderColor: 'rgba(90, 143, 105, 1)',
                borderWidth: 1
            }]
        };
        
        const topProductsData = {
            labels: ['Ramo Rosas', 'Arreglo Cumpleaños', 'Centro de Mesa', 'Caja Sorpresa', 'Bouquet Especial'],
            datasets: [{
                label: 'Unidades vendidas',
                data: [45, 38, 32, 28, 22],
                backgroundColor: [
                    'rgba(90, 143, 105, 0.6)',
                    'rgba(74, 122, 90, 0.6)',
                    'rgba(120, 180, 130, 0.6)',
                    'rgba(60, 100, 75, 0.6)',
                    'rgba(100, 160, 115, 0.6)'
                ],
                borderColor: [
                    'rgba(90, 143, 105, 1)',
                    'rgba(74, 122, 90, 1)',
                    'rgba(120, 180, 130, 1)',
                    'rgba(60, 100, 75, 1)',
                    'rgba(100, 160, 115, 1)'
                ],
                borderWidth: 1
            }]
        };
        
        const categoriesData = {
            labels: ['Ramos', 'Arreglos', 'Centros de Mesa', 'Cajas', 'Especiales'],
            datasets: [{
                label: '% de ventas',
                data: [30, 25, 20, 15, 10],
                backgroundColor: [
                    'rgba(90, 143, 105, 0.6)',
                    'rgba(74, 122, 90, 0.6)',
                    'rgba(120, 180, 130, 0.6)',
                    'rgba(60, 100, 75, 0.6)',
                    'rgba(100, 160, 115, 0.6)'
                ],
                borderColor: [
                    'rgba(90, 143, 105, 1)',
                    'rgba(74, 122, 90, 1)',
                    'rgba(120, 180, 130, 1)',
                    'rgba(60, 100, 75, 1)',
                    'rgba(100, 160, 115, 1)'
                ],
                borderWidth: 1
            }]
        };
        
        // Crear gráficos
        const salesCtx = document.getElementById('salesChart').getContext('2d');
        new Chart(salesCtx, {
            type: 'line',
            data: salesData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                }
            }
        });
        
        const topProductsCtx = document.getElementById('topProductsChart').getContext('2d');
        new Chart(topProductsCtx, {
            type: 'bar',
            data: topProductsData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        const categoriesCtx = document.getElementById('categoriesChart').getContext('2d');
        new Chart(categoriesCtx, {
            type: 'doughnut',
            data: categoriesData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error al cargar datos de gráficos:', error);
    }
}

// Función para cargar actividades recientes
function loadRecentActivities() {
    try {
        // Datos de ejemplo para actividades recientes
        const activities = [
            { text: 'Nuevo pedido #1234 realizado', time: 'Hace 10 min' },
            { text: 'Producto "Ramo de Rosas" actualizado', time: 'Hace 25 min' },
            { text: 'Nuevo usuario registrado: María López', time: 'Hace 1 hora' },
            { text: 'Pedido #1230 marcado como completado', time: 'Hace 2 horas' },
            { text: 'Nuevo producto "Arreglo Especial" agregado', time: 'Hace 1 día' }
        ];
        
        const activityList = document.getElementById('activityList');
        activityList.innerHTML = '';
        
        activities.forEach(activity => {
            const li = document.createElement('li');
            li.innerHTML = `
                <i class="fas fa-bell"></i>
                <span>${activity.text}</span>
                <span class="activity-time">${activity.time}</span>
            `;
            activityList.appendChild(li);
        });
    } catch (error) {
        console.error('Error al cargar actividades recientes:', error);
        document.getElementById('activityList').innerHTML = '<li>Error al cargar actividades</li>';
    }
}

// Configurar eventos de productos
function setupProductEvents() {
    // Evento para el botón de agregar producto
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductModalBtn = document.getElementById('addProductModalBtn');
    
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            // Mostrar formulario para agregar producto
            showAddProductForm();
        });
        
        // Añadir atributos de accesibilidad
        addProductBtn.setAttribute('aria-label', 'Agregar nuevo producto');
        addProductBtn.setAttribute('role', 'button');
    }
    
    if (addProductModalBtn) {
        addProductModalBtn.addEventListener('click', function() {
            // Mostrar formulario para agregar producto
            showAddProductForm();
        });
        
        // Añadir atributos de accesibilidad
        addProductModalBtn.setAttribute('aria-label', 'Agregar nuevo producto');
        addProductModalBtn.setAttribute('role', 'button');
    }
}

// Mostrar formulario para agregar producto
function showAddProductForm() {
    // Crear modal para agregar producto
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'addProductModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'addProductModalTitle');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="addProductModalTitle">Agregar Nuevo Producto</h3>
                <button class="close" aria-label="Cerrar">&times;</button>
            </div>
            <div class="modal-body">
                <form id="addProductForm">
                    <div class="form-group">
                        <label for="productName">Nombre:</label>
                        <input type="text" id="productName" class="form-input" required aria-required="true">
                    </div>
                    <div class="form-group">
                        <label for="productCategory">Categoría:</label>
                        <input type="text" id="productCategory" class="form-input" required aria-required="true">
                    </div>
                    <div class="form-group">
                        <label for="productPrice">Precio:</label>
                        <input type="number" id="productPrice" class="form-input" min="0" step="100" required aria-required="true">
                    </div>
                    <div class="form-group">
                        <label for="productImage">URL de Imagen:</label>
                        <input type="text" id="productImage" class="form-input">
                    </div>
                    <div class="form-group">
                        <label for="productImageFile">Subir Imagen:</label>
                        <input type="file" id="productImageFile" class="form-input">
                    </div>
                    <div class="form-group">
                        <label for="productDescription">Descripción:</label>
                        <textarea id="productDescription" class="form-input" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Agregar Producto</button>
                </form>
            </div>
        </div>
    `;
    
    // Añadir modal al documento
    document.body.appendChild(modal);
    
    // Configurar eventos del modal
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', function() {
        modal.remove();
    });
    
    // Añadir atributos de accesibilidad al botón de cierre
    closeBtn.setAttribute('aria-label', 'Cerrar modal');
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    });
    
    // Manejar la tecla Escape para cerrar el modal
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.parentNode) {
            modal.remove();
        }
    });
    
    // Configurar envío del formulario
    const form = document.getElementById('addProductForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        addProduct();
    });
    
    // Mostrar modal
    modal.style.display = 'block';
    
    // Enfocar el primer campo del formulario
    const firstInput = modal.querySelector('input, textarea, select');
    if (firstInput) {
        firstInput.focus();
    }
}

// Agregar producto
async function addProduct() {
    const form = document.getElementById('addProductForm');
    if (!form) return;
    
    try {
        const formData = new FormData(form);
        const imageFile = document.getElementById('productImageFile').files[0];
        let imageUrl = formData.get('productImage');
        
        // Si se seleccionó un archivo, subirlo
        if (imageFile) {
            imageUrl = await uploadImage(imageFile);
        }
        
        const productData = {
            name: formData.get('productName'),
            price: parseFloat(formData.get('productPrice')),
            category: formData.get('productCategory'),
            image: imageUrl,
            description: formData.get('productDescription')
        };
        
        // Validar campos requeridos
        if (!productData.name || !productData.price || !productData.category || productData.price <= 0) {
            showMessage('Por favor complete todos los campos obligatorios', 'error');
            return;
        }
        
        // Si no hay imagen, usar una por defecto
        if (!productData.image) {
            productData.image = '/assets/images/default-avatar.svg';
        }
        
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Error al agregar producto');
        }
        
        // Cerrar modal
        const modal = document.getElementById('addProductModal');
        if (modal) {
            modal.remove();
        }
        
        // Mostrar mensaje de éxito
        showMessage('Producto agregado correctamente', 'success');
        
        // Recargar lista de productos
        loadAllProducts();
        loadDashboardData();
    } catch (error) {
        console.error('Error al agregar producto:', error);
        showMessage(error.message || 'Error al agregar producto', 'error');
    }
}

// Cargar todos los productos
async function loadAllProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (!response.ok) {
            throw new Error('Error al cargar productos');
        }
        
        const data = await response.json();
        const products = data.products || data;
        const tbody = document.getElementById('allProductsTableBody');
        
        if (tbody) {
            if (products && products.length > 0) {
                tbody.innerHTML = products.map(product => `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.description || ''}</td>
                        <td>$${parseFloat(product.price).toLocaleString('es-CL')}</td>
                        <td>${product.category}</td>
                        <td><img src="${product.image || ''}" alt="${product.name}" width="50" loading="lazy"></td>
                        <td>
                            <button class="btn-icon edit-product" data-id="${product.id}" aria-label="Editar ${product.name}" title="Editar">
                                <i class="fas fa-edit" aria-hidden="true"></i>
                            </button>
                            <button class="btn-icon delete-product" data-id="${product.id}" aria-label="Eliminar ${product.name}" title="Eliminar">
                                <i class="fas fa-trash" aria-hidden="true"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
                
                // Añadir eventos a los botones de editar y eliminar
                document.querySelectorAll('.edit-product').forEach(button => {
                    button.addEventListener('click', function() {
                        const productId = this.getAttribute('data-id');
                        editProduct(productId);
                    });
                    
                    // Añadir atributos de accesibilidad
                    button.setAttribute('role', 'button');
                });
                
                document.querySelectorAll('.delete-product').forEach(button => {
                    button.addEventListener('click', function() {
                        const productId = this.getAttribute('data-id');
                        deleteProduct(productId);
                    });
                    
                    // Añadir atributos de accesibilidad
                    button.setAttribute('role', 'button');
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="7">No hay productos disponibles</td></tr>';
            }
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
        const tbody = document.getElementById('allProductsTableBody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7">Error al cargar productos</td></tr>';
        }
    }
}

// Editar producto
function editProduct(productId) {
    // Obtener los datos del producto
    fetch(`${API_BASE_URL}/api/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            // Mostrar formulario para editar producto
            showEditProductForm(product);
        })
        .catch(error => {
            console.error('Error al obtener producto:', error);
            showMessage('Error al obtener datos del producto', 'error');
        });
}

// Mostrar formulario para editar producto
function showEditProductForm(product) {
    // Crear modal para editar producto
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'editProductModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'editProductModalTitle');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="editProductModalTitle">Editar Producto</h3>
                <button class="close" aria-label="Cerrar">&times;</button>
            </div>
            <div class="modal-body">
                <form id="editProductForm">
                    <input type="hidden" id="productId" value="${product.id}">
                    <div class="form-group">
                        <label for="editProductName">Nombre:</label>
                        <input type="text" id="editProductName" class="form-input" value="${product.name}" required aria-required="true">
                    </div>
                    <div class="form-group">
                        <label for="editProductCategory">Categoría:</label>
                        <input type="text" id="editProductCategory" class="form-input" value="${product.category}" required aria-required="true">
                    </div>
                    <div class="form-group">
                        <label for="editProductPrice">Precio:</label>
                        <input type="number" id="editProductPrice" class="form-input" min="0" step="100" value="${product.price}" required aria-required="true">
                    </div>
                    <div class="form-group">
                        <label for="editProductImage">URL de Imagen:</label>
                        <input type="text" id="editProductImage" class="form-input" value="${product.image || ''}">
                    </div>
                    <div class="form-group">
                        <label for="editProductImageFile">Subir Imagen:</label>
                        <input type="file" id="editProductImageFile" class="form-input">
                    </div>
                    <div class="form-group">
                        <label for="editProductDescription">Descripción:</label>
                        <textarea id="editProductDescription" class="form-input" rows="3">${product.description || ''}</textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Actualizar Producto</button>
                </form>
            </div>
        </div>
    `;
    
    // Añadir modal al documento
    document.body.appendChild(modal);
    
    // Configurar eventos del modal
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', function() {
        modal.remove();
    });
    
    // Añadir atributos de accesibilidad al botón de cierre
    closeBtn.setAttribute('aria-label', 'Cerrar modal');
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    });
    
    // Manejar la tecla Escape para cerrar el modal
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.parentNode) {
            modal.remove();
        }
    });
    
    // Configurar envío del formulario
    const form = document.getElementById('editProductForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        updateProduct(product.id);
    });
    
    // Mostrar modal
    modal.style.display = 'block';
    
    // Enfocar el primer campo del formulario
    const firstInput = modal.querySelector('input, textarea, select');
    if (firstInput) {
        firstInput.focus();
    }
}

// Actualizar producto
async function updateProduct(productId) {
    const form = document.getElementById('editProductForm');
    if (!form) return;
    
    try {
        const formData = new FormData(form);
        const imageFile = document.getElementById('editProductImageFile').files[0];
        let imageUrl = formData.get('editProductImage');
        
        // Si se seleccionó un archivo, subirlo
        if (imageFile) {
            imageUrl = await uploadImage(imageFile);
        }
        
        const productData = {
            name: formData.get('editProductName'),
            price: parseFloat(formData.get('editProductPrice')),
            category: formData.get('editProductCategory'),
            image: imageUrl,
            description: formData.get('editProductDescription')
        };
        
        // Validar campos requeridos
        if (!productData.name || !productData.price || !productData.category || productData.price <= 0) {
            showMessage('Por favor complete todos los campos obligatorios', 'error');
            return;
        }
        
        // Si no hay imagen, usar una por defecto
        if (!productData.image) {
            productData.image = '/assets/images/default-avatar.svg';
        }
        
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Error al actualizar producto');
        }
        
        // Cerrar modal
        const modal = document.getElementById('editProductModal');
        if (modal) {
            modal.remove();
        }
        
        // Mostrar mensaje de éxito
        showMessage('Producto actualizado correctamente', 'success');
        
        // Recargar lista de productos
        loadAllProducts();
        loadDashboardData();
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        showMessage(error.message || 'Error al actualizar producto', 'error');
    }
}

// Eliminar producto
function deleteProduct(productId) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        // Lógica para eliminar el producto
        removeProduct(productId);
    }
}

// Eliminar producto de la base de datos
async function removeProduct(productId) {
    try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar producto');
        }
        
        // Mostrar mensaje de éxito
        showMessage('Producto eliminado correctamente', 'success');
        
        // Recargar lista de productos
        loadAllProducts();
        loadDashboardData();
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        showMessage('Error al eliminar producto', 'error');
    }
}

// Cargar pedidos
async function loadOrders() {
    try {
        // Mostrar mensaje de carga
        const tbody = document.getElementById('ordersTableBody');
        tbody.innerHTML = '<tr><td colspan="6">Cargando pedidos...</td></tr>';
        
        // Simular una llamada a una API de pedidos
        setTimeout(() => {
            // Datos de ejemplo de pedidos
            const orders = [
                {
                    id: 1,
                    customer: 'Juan Pérez',
                    date: '2025-08-10',
                    total: 45990,
                    status: 'Pendiente'
                },
                {
                    id: 2,
                    customer: 'María González',
                    date: '2025-08-09',
                    total: 32500,
                    status: 'Completado'
                },
                {
                    id: 3,
                    customer: 'Carlos López',
                    date: '2025-08-08',
                    total: 28750,
                    status: 'Enviado'
                },
                {
                    id: 4,
                    customer: 'Ana Rodríguez',
                    date: '2025-08-07',
                    total: 52300,
                    status: 'Completado'
                }
            ];
            
            if (orders.length > 0) {
                tbody.innerHTML = orders.map(order => `
                    <tr>
                        <td>${order.id}</td>
                        <td>${order.customer}</td>
                        <td>${order.date}</td>
                        <td>$${order.total.toLocaleString('es-CL')}</td>
                        <td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td>
                        <td>
                            <button class="btn-icon view-order" data-id="${order.id}" aria-label="Ver pedido ${order.id}" title="Ver">
                                <i class="fas fa-eye" aria-hidden="true"></i>
                            </button>
                            <button class="btn-icon edit-order" data-id="${order.id}" aria-label="Editar pedido ${order.id}" title="Editar">
                                <i class="fas fa-edit" aria-hidden="true"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
                
                // Añadir eventos a los botones
                document.querySelectorAll('.view-order').forEach(button => {
                    button.addEventListener('click', function() {
                        const orderId = this.getAttribute('data-id');
                        viewOrder(orderId);
                    });
                });
                
                document.querySelectorAll('.edit-order').forEach(button => {
                    button.addEventListener('click', function() {
                        const orderId = this.getAttribute('data-id');
                        editOrder(orderId);
                    });
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="6">No hay pedidos disponibles</td></tr>';
            }
        }, 1000);
    } catch (error) {
        console.error('Error al cargar pedidos:', error);
        document.getElementById('ordersTableBody').innerHTML = '<tr><td colspan="6">Error al cargar pedidos</td></tr>';
    }
}

// Configurar filtro de pedidos
function setupOrderFilter() {
    const filterSelect = document.getElementById('orderStatusFilter');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            const status = this.value;
            filterOrders(status);
        });
    }
}

// Filtrar pedidos por estado
function filterOrders(status) {
    // En una implementación real, esto haría una llamada a la API con el filtro
    showMessage(`Filtrando pedidos por estado: ${status === 'all' ? 'Todos' : status}`, 'info');
}

// Ver detalles de un pedido
function viewOrder(orderId) {
    showMessage(`Función para ver detalles del pedido ${orderId}. En una implementación completa, aquí se mostrarían los detalles del pedido.`, 'info');
}

// Editar un pedido
function editOrder(orderId) {
    showMessage(`Función para editar el pedido ${orderId}. En una implementación completa, aquí se podría cambiar el estado del pedido.`, 'info');
}

// Configurar eventos de usuarios
function setupUserEvents() {
    // Botón para agregar usuario
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            showUserModal();
        });
    }
    
    // Formulario de usuario
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveUser();
        });
    }
    
    // Cerrar modal al hacer clic en la X
    const closeModal = document.querySelector('#userModal .close');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            document.getElementById('userModal').style.display = 'none';
        });
    }
    
    // Cerrar modal al hacer clic fuera del contenido
    const userModal = document.getElementById('userModal');
    if (userModal) {
        userModal.addEventListener('click', (e) => {
            if (e.target === userModal) {
                userModal.style.display = 'none';
            }
        });
    }
}

// Mostrar modal para crear/editar usuario
function showUserModal(user = null) {
    const modal = document.getElementById('userModal');
    const title = document.getElementById('userModalTitle');
    const userId = document.getElementById('userId');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userPhone = document.getElementById('userPhone');
    const userPassword = document.getElementById('userPassword');
    const userRole = document.getElementById('userRole');
    const passwordHelp = document.getElementById('passwordHelp');
    
    if (user) {
        // Editar usuario existente
        title.textContent = 'Editar Usuario';
        userId.value = user.id;
        userName.value = user.name;
        userEmail.value = user.email;
        userPhone.value = user.phone || '';
        userRole.value = user.role || 'user';
        userPassword.value = '';
        passwordHelp.style.display = 'block';
        userPassword.removeAttribute('required');
    } else {
        // Crear nuevo usuario
        title.textContent = 'Agregar Usuario';
        userId.value = '';
        userName.value = '';
        userEmail.value = '';
        userPhone.value = '';
        userRole.value = 'user';
        userPassword.value = '';
        passwordHelp.style.display = 'block';
        userPassword.setAttribute('required', 'required');
    }
    
    modal.style.display = 'block';
}

// Guardar usuario (crear o actualizar)
async function saveUser() {
    const userId = document.getElementById('userId').value;
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const phone = document.getElementById('userPhone').value;
    const password = document.getElementById('userPassword').value;
    const role = document.getElementById('userRole').value;
    
    // Validaciones básicas
    if (!name || !email || !phone || (!userId && !password)) {
        showMessage('Por favor complete todos los campos obligatorios', 'error');
        return;
    }
    
    // Si es edición y no se ingresó contraseña, remover el campo
    const userData = { name, email, phone, role };
    if (password) {
        userData.password = password;
    }
    
    try {
        const token = getAuthToken();
        let response;
        
        if (userId) {
            // Actualizar usuario existente
            response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });
        } else {
            // Crear nuevo usuario
            if (!password) {
                showMessage('La contraseña es obligatoria para nuevos usuarios', 'error');
                return;
            }
            
            response = await fetch(`${API_BASE_URL}/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });
        }
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Error al guardar usuario');
        }
        
        // Cerrar modal
        document.getElementById('userModal').style.display = 'none';
        
        // Mostrar mensaje de éxito
        showMessage(userId ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente', 'success');
        
        // Recargar lista de usuarios
        loadUsers();
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        showMessage(error.message || 'Error al guardar usuario', 'error');
    }
}

// Cargar usuarios
async function loadUsers() {
    try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/api/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al cargar usuarios');
        }
        
        const data = await response.json();
        const users = data.users || [];
        const tbody = document.getElementById('usersTableBody');
        
        if (tbody) {
            if (users && users.length > 0) {
                tbody.innerHTML = users.map(user => `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.phone || ''}</td>
                        <td>${user.role || 'user'}</td>
                        <td>${user.lastLogin || 'Nunca'}</td>
                        <td>
                            <button class="btn-icon edit-user" data-id="${user.id}" aria-label="Editar ${user.name}" title="Editar">
                                <i class="fas fa-edit" aria-hidden="true"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
                
                // Añadir eventos a los botones de editar
                document.querySelectorAll('.edit-user').forEach(button => {
                    button.addEventListener('click', function() {
                        const userId = this.getAttribute('data-id');
                        editUser(userId);
                    });
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="7">No hay usuarios disponibles</td></tr>';
            }
        }
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        const tbody = document.getElementById('usersTableBody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7">Error al cargar usuarios</td></tr>';
        }
    }
}

// Cargar analíticas
function loadAnalytics() {
    // En una implementación real, esto haría llamadas a la API para obtener datos
    initCharts();
    loadSummaryStats();
}

// Inicializar gráficos
function initCharts() {
    // Gráfico de ventas por mes
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
                datasets: [{
                    label: 'Ventas',
                    data: [12000, 19000, 15000, 18000, 22000, 19500, 23000, 25000],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Gráfico de productos más vendidos
    const topProductsCtx = document.getElementById('topProductsChart');
    if (topProductsCtx) {
        new Chart(topProductsCtx, {
            type: 'bar',
            data: {
                labels: ['Ramo Rosas', 'Arreglo Especial', 'Planta Interior', 'Caja Sorpresa', 'Centro de Mesa'],
                datasets: [{
                    label: 'Unidades vendidas',
                    data: [45, 32, 28, 25, 22],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Gráfico de categorías populares
    const categoriesCtx = document.getElementById('categoriesChart');
    if (categoriesCtx) {
        new Chart(categoriesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Ramos', 'Arreglos', 'Especiales', 'Plantas'],
                datasets: [{
                    data: [35, 30, 20, 15],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Cargar estadísticas resumidas
function loadSummaryStats() {
    // En una implementación real, esto haría llamadas a la API
    document.getElementById('todaySales').textContent = '$12,500';
    document.getElementById('weekSales').textContent = '$85,300';
    document.getElementById('monthSales').textContent = '$325,600';
}

// Inicializar configuración
function initSettings() {
    // Cargar configuración guardada
    loadSettings();
    
    // Configurar formularios
    const storeInfoForm = document.getElementById('storeInfoForm');
    const customizationForm = document.getElementById('customizationForm');
    const shippingForm = document.getElementById('shippingForm');
    
    if (storeInfoForm) {
        storeInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveStoreInfo();
        });
    }
    
    if (customizationForm) {
        customizationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveCustomization();
        });
    }
    
    if (shippingForm) {
        shippingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveShippingSettings();
        });
    }
}

// Cargar configuración guardada
function loadSettings() {
    // Cargar información de la tienda
    const storeInfo = JSON.parse(localStorage.getItem('storeInfo')) || {};
    document.getElementById('storeName').value = storeInfo.name || '';
    document.getElementById('storeEmail').value = storeInfo.email || '';
    document.getElementById('storePhone').value = storeInfo.phone || '';
    document.getElementById('storeAddress').value = storeInfo.address || '';
    document.getElementById('storeHours').value = storeInfo.hours || '';
    
    // Cargar personalización
    const customization = JSON.parse(localStorage.getItem('customization')) || {};
    document.getElementById('primaryColor').value = customization.primaryColor || '#4a7c59';
    document.getElementById('secondaryColor').value = customization.secondaryColor || '#3a6c49';
    
    // Cargar configuración de envíos
    const shipping = JSON.parse(localStorage.getItem('shippingSettings')) || {};
    document.getElementById('shippingCost').value = shipping.cost || '';
    document.getElementById('freeShippingThreshold').value = shipping.freeThreshold || '';
    document.getElementById('deliveryTime').value = shipping.deliveryTime || '';
}

// Guardar información de la tienda
function saveStoreInfo() {
    const storeInfo = {
        name: document.getElementById('storeName').value,
        email: document.getElementById('storeEmail').value,
        phone: document.getElementById('storePhone').value,
        address: document.getElementById('storeAddress').value,
        hours: document.getElementById('storeHours').value
    };
    
    localStorage.setItem('storeInfo', JSON.stringify(storeInfo));
    showMessage('Información de la tienda guardada correctamente', 'success');
}

// Guardar personalización
function saveCustomization() {
    const customization = {
        primaryColor: document.getElementById('primaryColor').value,
        secondaryColor: document.getElementById('secondaryColor').value
    };
    
    localStorage.setItem('customization', JSON.stringify(customization));
    showMessage('Personalización guardada correctamente', 'success');
    
    // Aplicar colores inmediatamente
    applyCustomColors(customization.primaryColor, customization.secondaryColor);
}

// Guardar configuración de envíos
function saveShippingSettings() {
    const shipping = {
        cost: document.getElementById('shippingCost').value,
        freeThreshold: document.getElementById('freeShippingThreshold').value,
        deliveryTime: document.getElementById('deliveryTime').value
    };
    
    localStorage.setItem('shippingSettings', JSON.stringify(shipping));
    showMessage('Configuración de envíos guardada correctamente', 'success');
}

// Aplicar colores personalizados
function applyCustomColors(primaryColor, secondaryColor) {
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --primary: ${primaryColor};
            --secondary: ${secondaryColor};
        }
    `;
    document.head.appendChild(style);
}

// Editar usuario
async function editUser(userId) {
    try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener datos del usuario');
        }
        
        const user = await response.json();
        showUserModal(user);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        showMessage('Error al obtener datos del usuario', 'error');
    }
}

// Configurar navegación del menú
function setupMenuNavigation() {
    // Esperar a que el DOM esté completamente cargado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMenuNavigation);
    } else {
        // DOM ya está cargado
        initMenuNavigation();
    }
}

function initMenuNavigation() {
    const menuLinks = document.querySelectorAll('.admin-menu a[data-section]');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase activa de todos los elementos del menú
            document.querySelectorAll('.admin-menu li').forEach(li => {
                li.classList.remove('active');
            });
            
            // Agregar clase activa al elemento seleccionado
            this.parentElement.classList.add('active');
            
            // Ocultar todas las secciones de contenido
            document.querySelectorAll('.admin-content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Mostrar la sección seleccionada
            const targetSection = this.getAttribute('data-section');
            const sectionElement = document.getElementById(targetSection);
            if (sectionElement) {
                sectionElement.classList.add('active');
            }
        });
    });
}

// Mostrar mensaje al usuario
function showMessage(message, type = 'info') {
    // Crear contenedor de mensajes si no existe
    let messageContainer = document.getElementById('admin-message-container');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'admin-message-container';
        messageContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            width: 300px;
        `;
        document.body.appendChild(messageContainer);
    }
    
    // Crear mensaje
    const messageElement = document.createElement('div');
    messageElement.style.cssText = `
        padding: 15px;
        margin-bottom: 10px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
    `;
    
    // Establecer estilo según el tipo de mensaje
    switch(type) {
        case 'success':
            messageElement.style.backgroundColor = '#28a745';
            break;
        case 'error':
            messageElement.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            messageElement.style.backgroundColor = '#ffc107';
            messageElement.style.color = '#212529';
            break;
        default:
            messageElement.style.backgroundColor = '#17a2b8';
    }
    
    messageElement.textContent = message;
    
    // Añadir mensaje al contenedor
    messageContainer.appendChild(messageElement);
    
    // Eliminar mensaje después de 3 segundos
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
        }
    }, 3000);
}

// Función para subir imágenes
async function uploadImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                // Convertir a base64
                const base64Image = e.target.result;
                
                // Enviar al servidor
                const token = getAuthToken();
                const response = await fetch(`${API_BASE_URL}/api/products/upload`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ image: base64Image })
                });
                
                const result = await response.json();
                
                if (!response.ok) {
                    throw new Error(result.error || 'Error al subir imagen');
                }
                
                resolve(result.imageUrl);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = function() {
            reject(new Error('Error al leer el archivo'));
        };
        reader.readAsDataURL(file);
    });
}

// Función para mostrar vista previa de imagen
function setupImagePreview() {
    // Vista previa para agregar producto
    const imageFileInput = document.getElementById('productImageFile');
    const imagePreview = document.getElementById('imagePreview');
    
    if (imageFileInput && imagePreview) {
        imageFileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Crear o actualizar imagen de vista previa
                    let previewImg = imagePreview.querySelector('img');
                    if (!previewImg) {
                        previewImg = document.createElement('img');
                        imagePreview.appendChild(previewImg);
                    }
                    previewImg.src = e.target.result;
                    previewImg.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Vista previa para editar producto
    const editImageFileInput = document.getElementById('editProductImageFile');
    const editImagePreview = document.getElementById('editImagePreview');
    
    if (editImageFileInput && editImagePreview) {
        editImageFileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Crear o actualizar imagen de vista previa
                    let previewImg = editImagePreview.querySelector('img');
                    if (!previewImg) {
                        previewImg = document.createElement('img');
                        editImagePreview.appendChild(previewImg);
                    }
                    previewImg.src = e.target.result;
                    previewImg.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
}
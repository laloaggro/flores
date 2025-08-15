// admin.js - Funcionalidad del panel de administración
import { API_BASE_URL, isAuthenticated, isAdmin, getAuthToken } from './utils.js';
import { initUserMenu } from './auth.js';

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
        }
        
        // Actualizar enlaces activos
        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });
    }
    
    // Agregar event listeners a los enlaces del menú
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            changeSection(sectionId);
        });
    });
    
    // Cargar datos del dashboard
    loadDashboardData();
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
                    <button class="btn-icon view-btn" title="Ver">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon edit-btn" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-btn" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            productsTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
    }
}

// Configurar eventos de productos
function setupProductEvents() {
    // Evento para el botón de agregar producto
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            // Mostrar formulario para agregar producto
            showAddProductForm();
        });
    }
}

// Mostrar formulario para agregar producto
function showAddProductForm() {
    // Crear modal para agregar producto
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'addProductModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Agregar Nuevo Producto</h3>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <form id="addProductForm">
                    <div class="form-group">
                        <label for="productName">Nombre:</label>
                        <input type="text" id="productName" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label for="productCategory">Categoría:</label>
                        <input type="text" id="productCategory" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label for="productPrice">Precio:</label>
                        <input type="number" id="productPrice" class="form-input" min="0" step="100" required>
                    </div>
                    <div class="form-group">
                        <label for="productImage">URL de Imagen:</label>
                        <input type="text" id="productImage" class="form-input">
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
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
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
}

// Agregar producto
async function addProduct() {
    try {
        const formData = new FormData(document.getElementById('addProductForm'));
        const productData = {
            name: formData.get('productName'),
            category: formData.get('productCategory'),
            price: parseFloat(formData.get('productPrice')),
            image: formData.get('productImage'),
            description: formData.get('productDescription')
        };
        
        const token = localStorage.getItem('token');
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });
        
        if (!response.ok) {
            throw new Error('Error al agregar producto');
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
        showMessage('Error al agregar producto', 'error');
    }
}

// Cargar productos
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error('Error al cargar productos');
        }
        
        const data = await response.json();
        const tbody = document.getElementById('productsTableBody');
        
        if (data.products && data.products.length > 0) {
            tbody.innerHTML = data.products.map(product => `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>$${parseFloat(product.price).toLocaleString('es-CL')}</td>
                    <td>
                        <button class="btn-icon edit-product" data-id="${product.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete-product" data-id="${product.id}">
                            <i class="fas fa-trash"></i>
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
            });
            
            document.querySelectorAll('.delete-product').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.getAttribute('data-id');
                    deleteProduct(productId);
                });
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="5">No hay productos disponibles</td></tr>';
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
        document.getElementById('productsTableBody').innerHTML = '<tr><td colspan="5">Error al cargar productos</td></tr>';
    }
}

// Editar producto
function editProduct(productId) {
    // Obtener los datos del producto
    fetch(`/api/products/${productId}`)
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
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Editar Producto</h3>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <form id="editProductForm">
                    <input type="hidden" id="productId" value="${product.id}">
                    <div class="form-group">
                        <label for="editProductName">Nombre:</label>
                        <input type="text" id="editProductName" class="form-input" value="${product.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="editProductCategory">Categoría:</label>
                        <input type="text" id="editProductCategory" class="form-input" value="${product.category}" required>
                    </div>
                    <div class="form-group">
                        <label for="editProductPrice">Precio:</label>
                        <input type="number" id="editProductPrice" class="form-input" min="0" step="100" value="${product.price}" required>
                    </div>
                    <div class="form-group">
                        <label for="editProductImage">URL de Imagen:</label>
                        <input type="text" id="editProductImage" class="form-input" value="${product.image || ''}">
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
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
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
}

// Actualizar producto
async function updateProduct(productId) {
    try {
        const formData = new FormData(document.getElementById('editProductForm'));
        const productData = {
            id: productId,
            name: formData.get('editProductName'),
            category: formData.get('editProductCategory'),
            price: parseFloat(formData.get('editProductPrice')),
            image: formData.get('editProductImage'),
            description: formData.get('editProductDescription')
        };
        
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });
        
        if (!response.ok) {
            throw new Error('Error al actualizar producto');
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
        showMessage('Error al actualizar producto', 'error');
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
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/products/${productId}`, {
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
        // Simular carga de pedidos
        setTimeout(() => {
            const tbody = document.getElementById('ordersTableBody');
            tbody.innerHTML = `
                <tr>
                    <td>1</td>
                    <td>Juan Pérez</td>
                    <td>2025-08-10</td>
                    <td>$45.990</td>
                    <td><span class="status pending">Pendiente</span></td>
                    <td>
                        <button class="btn-icon edit-order" data-id="1">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>María González</td>
                    <td>2025-08-09</td>
                    <td>$32.500</td>
                    <td><span class="status completed">Completado</span></td>
                    <td>
                        <button class="btn-icon edit-order" data-id="2">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `;
        }, 1000);
    } catch (error) {
        console.error('Error al cargar pedidos:', error);
        document.getElementById('ordersTableBody').innerHTML = '<tr><td colspan="6">Error al cargar pedidos</td></tr>';
    }
}

// Cargar usuarios
async function loadUsers() {
    try {
        // Simular carga de usuarios
        setTimeout(() => {
            const tbody = document.getElementById('usersTableBody');
            tbody.innerHTML = `
                <tr>
                    <td>1</td>
                    <td>Administrador</td>
                    <td>admin@arreglosvictoria.com</td>
                    <td>+56963603177</td>
                    <td>admin</td>
                    <td>
                        <button class="btn-icon edit-user" data-id="1">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Juan Pérez</td>
                    <td>juan.perez@example.com</td>
                    <td>+56987654321</td>
                    <td>user</td>
                    <td>
                        <button class="btn-icon edit-user" data-id="2">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `;
        }, 1000);
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        document.getElementById('usersTableBody').innerHTML = '<tr><td colspan="6">Error al cargar usuarios</td></tr>';
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

// Función para mostrar mensajes al usuario
function showMessage(message, type = 'info') {
    // Crear elemento de mensaje
    const messageElement = document.createElement('div');
    messageElement.className = `alert alert-${type}`;
    messageElement.textContent = message;
    
    // Agregar al inicio del contenedor principal
    const container = document.querySelector('.admin-container');
    if (container) {
        container.insertBefore(messageElement, container.firstChild);
        
        // Eliminar el mensaje después de 5 segundos
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }
}
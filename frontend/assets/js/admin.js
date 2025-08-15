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
            case 'products':
                loadAllProducts();
                break;
            case 'orders':
                loadOrders();
                break;
            case 'users':
                loadUsers();
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
    } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
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
    try {
        const formData = new FormData(document.getElementById('addProductForm'));
        const productData = {
            name: formData.get('productName'),
            category: formData.get('productCategory'),
            price: parseFloat(formData.get('productPrice')),
            image: formData.get('productImage'),
            description: formData.get('productDescription')
        };
        
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/api/products`, {
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
    try {
        const formData = new FormData(document.getElementById('editProductForm'));
        const productData = {
            name: formData.get('editProductName'),
            category: formData.get('editProductCategory'),
            price: parseFloat(formData.get('editProductPrice')),
            image: formData.get('editProductImage'),
            description: formData.get('editProductDescription')
        };
        
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
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
                        <button class="btn-icon edit-order" data-id="1" aria-label="Editar pedido 1" title="Editar">
                            <i class="fas fa-edit" aria-hidden="true"></i>
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
                        <button class="btn-icon edit-order" data-id="2" aria-label="Editar pedido 2" title="Editar">
                            <i class="fas fa-edit" aria-hidden="true"></i>
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
                        <button class="btn-icon edit-user" data-id="1" aria-label="Editar usuario 1" title="Editar">
                            <i class="fas fa-edit" aria-hidden="true"></i>
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
                        <button class="btn-icon edit-user" data-id="2" aria-label="Editar usuario 2" title="Editar">
                            <i class="fas fa-edit" aria-hidden="true"></i>
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
    messageElement.setAttribute('role', 'alert');
    messageElement.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
    
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
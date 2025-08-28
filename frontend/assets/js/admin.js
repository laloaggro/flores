// admin.js - Funcionalidad del panel de administración
import { API_BASE_URL, isAuthenticated, isAdmin, getAuthToken, logout, showNotification } from './utils.js';
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
    
    // Configurar el evento de logout
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
            window.location.href = '../index.html';
        });
    }
    
    // Configurar botones de navegación
    const manageProductsBtn = document.getElementById('manageProductsBtn');
    const manageOrdersBtn = document.getElementById('manageOrdersBtn');
    const manageUsersBtn = document.getElementById('manageUsersBtn');
    const viewStatsBtn = document.getElementById('viewStatsBtn');
    
    if (manageProductsBtn) {
        manageProductsBtn.addEventListener('click', function() {
            showNotification('Funcionalidad en desarrollo', 'info');
        });
    }
    
    if (manageOrdersBtn) {
        manageOrdersBtn.addEventListener('click', function() {
            showNotification('Funcionalidad en desarrollo', 'info');
        });
    }
    
    if (manageUsersBtn) {
        manageUsersBtn.addEventListener('click', function() {
            showNotification('Funcionalidad en desarrollo', 'info');
        });
    }
    
    if (viewStatsBtn) {
        viewStatsBtn.addEventListener('click', function() {
            showNotification('Funcionalidad en desarrollo', 'info');
        });
    }
    
    // Función para cargar datos del dashboard
    function loadDashboardData() {
        // Esta función se implementará completamente cuando se conecte con la API
        console.log('Cargando datos del dashboard...');
    }
    
    // Función para cargar todos los productos
    function loadAllProducts() {
        // Esta función se implementará completamente cuando se conecte con la API
        console.log('Cargando productos...');
    }
    
    // Función para cargar pedidos
    function loadOrders() {
        // Esta función se implementará completamente cuando se conecte con la API
        console.log('Cargando pedidos...');
    }
    
    // Función para cargar usuarios
    function loadUsers() {
        // Esta función se implementará completamente cuando se conecte con la API
        console.log('Cargando usuarios...');
    }
    
    // Función para configurar eventos de usuario
    function setupUserEvents() {
        // Esta función se implementará completamente cuando se conecte con la API
        console.log('Configurando eventos de usuario...');
    }
    
    // Función para cargar reseñas
    function loadReviews() {
        // Esta función se implementará completamente cuando se conecte con la API
        console.log('Cargando reseñas...');
    }
    
    // Función para inicializar configuraciones
    function initSettings() {
        // Esta función se implementará completamente cuando se conecte con la API
        console.log('Inicializando configuraciones...');
    }
});

    // No need to keep the rest of the code as it's already replaced
                    <div class="form-group">
                        <label for="productPrice">Precio:</label>
                        <input type="number" id="productPrice" class="form-input" min="0" step="100" required aria-required="true">
                        <div class="form-error" id="productPriceError">El precio debe ser mayor o igual a 0</div>
                    </div>
                    <div class="form-group">
                        <label for="productImage">URL de Imagen:</label>
                        <input type="text" id="productImage" class="form-input">
                        <div class="form-error" id="productImageError">Ingrese una URL válida de imagen</div>
                    </div>
                    <div class="form-group">
                        <label for="productImageFile">Subir Imagen:</label>
                        <input type="file" id="productImageFile" class="form-input" accept="image/*">
                        <div class="form-error" id="productImageFileError">Seleccione un archivo de imagen válido</div>
                    </div>
                    <div class="form-group">
                        <label for="productDescription">Descripción:</label>
                        <textarea id="productDescription" class="form-input" rows="3"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary" id="submitProductBtn">
                            <span id="submitBtnText">Agregar Producto</span>
                            <span class="loading-spinner" id="submitBtnSpinner" style="display: none;"></span>
                        </button>
                        <button type="button" class="btn btn-secondary" id="resetProductBtn">Limpiar Formulario</button>
                    </div>
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
    const submitBtn = document.getElementById('submitProductBtn');
    const resetBtn = document.getElementById('resetProductBtn');
    
    // Validación en tiempo real
    setupFormValidation(form);
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar form
        if (!validateForm(form)) {
            showMessage('Por favor corrija los errores en el formulario', 'error');
            return;
        }
        
        // Deshabilitar botón y mostrar estado de carga
        submitBtn.disabled = true;
        document.getElementById('submitBtnText').style.display = 'none';
        document.getElementById('submitBtnSpinner').style.display = 'inline-block';
        
        // Agregar producto
        addProduct()
            .catch(error => {
                showMessage(error.message || 'Error al agregar producto', 'error');
            })
            .finally(() => {
                // Restablecer botón
                submitBtn.disabled = false;
                document.getElementById('submitBtnText').style.display = 'inline-block';
                document.getElementById('submitBtnSpinner').style.display = 'none';
            });
    });
    
    // Configurar botón de limpiar formulario
    resetBtn.addEventListener('click', function() {
        if (confirm('¿Está seguro de que desea limpiar el formulario?')) {
            form.reset();
            // Restablecer clases de error
            form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('has-error');
            });
            // Ocultar mensajes de error
            form.querySelectorAll('.form-error').forEach(error => {
                error.style.display = 'none';
            });
            // Restablecer imagen de vista previa
            const imagePreview = document.getElementById('imagePreview');
            if (imagePreview) {
                imagePreview.innerHTML = '';
            }
            // Enfocar el primer campo
            const firstInput = modal.querySelector('input, textarea, select');
            if (firstInput) {
                firstInput.focus();
            }
        }
    });
    
    // Configurar vista previa de imagen
    setupImagePreview();
    
    // Mostrar modal
    modal.style.display = 'block';
    
    // Enfocar el primer campo del formulario
    const firstInput = modal.querySelector('input, textarea, select');
    if (firstInput) {
        firstInput.focus();
    }
}

/**
 * Configura validación en tiempo real para el formulario
 * @param {HTMLFormElement} form - El formulario a validar
 */
function setupFormValidation(form) {
    if (!form) return;
    
    // Validación en tiempo real para campos individuales
    form.productName.addEventListener('input', () => validateField('name', form.productName, form.productNameError));
    form.productCategory.addEventListener('change', () => validateField('category', form.productCategory, form.productCategoryError));
    form.productPrice.addEventListener('input', () => validateField('price', form.productPrice, form.productPriceError));
    form.productImage.addEventListener('input', () => validateField('imageUrl', form.productImage, form.productImageError));
    form.productImageFile.addEventListener('change', () => validateField('imageFile', form.productImageFile, form.productImageFileError));
}

/**
 * Valida el formulario completo
 * @param {HTMLFormElement} form - El formulario a validar
 * @returns {boolean} - true si el formulario es válido
 */
function validateForm(form) {
    let isValid = true;
    
    // Validar cada campo
    isValid &= validateField('name', form.productName, form.productNameError);
    isValid &= validateField('category', form.productCategory, form.productCategoryError);
    isValid &= validateField('price', form.productPrice, form.productPriceError);
    
    // Validar al menos una fuente de imagen
    const imageUrl = form.productImage.value.trim();
    const imageFile = form.productImageFile.files[0];
    
    if (!imageUrl && !imageFile) {
        form.productImageFileError.style.display = 'block';
        form.productImageFile.parentElement.classList.add('has-error');
        isValid = false;
    } else {
        form.productImageFileError.style.display = 'none';
        form.productImageFile.parentElement.classList.remove('has-error');
    }
    
    return isValid;
}

/**
 * Valida un campo específico del formulario
 * @param {string} fieldType - Tipo de campo ('name', 'category', 'price', 'imageUrl', 'imageFile')
 * @param {HTMLElement} fieldElement - Elemento del campo a validar
 * @param {HTMLElement} errorElement - Elemento donde mostrar el error
 * @returns {boolean} - true si el campo es válido
 */
function validateField(fieldType, fieldElement, errorElement) {
    const value = fieldElement.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch(fieldType) {
        case 'name':
            isValid = value.length >= 3 && value.length <= 100;
            errorMessage = 'El nombre debe tener entre 3 y 100 caracteres';
            break;
            
        case 'category':
            isValid = value !== '';
            errorMessage = 'Seleccione una categoría';
            break;
            
        case 'price':
            isValid = !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
            errorMessage = 'El precio debe ser un número mayor o igual a 0';
            break;
            
        case 'imageUrl':
            isValid = value === '' || /^(ftp|http|https):\/\/[^ "]+$/.test(value);
            errorMessage = 'Ingrese una URL válida';
            break;
            
        case 'imageFile':
            isValid = !value || (fieldElement.files[0] && fieldElement.files[0].type.startsWith('image/'));
            errorMessage = 'Seleccione un archivo de imagen válido';
            break;
    }
    
    if (!isValid) {
        errorElement.style.display = 'block';
        fieldElement.parentElement.classList.add('has-error');
    } else {
        errorElement.style.display = 'none';
        fieldElement.parentElement.classList.remove('has-error');
    }
    
    return isValid;
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
            throw new Error(`Error al cargar productos: ${response.status} ${response.statusText}`);
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
                        <td>${translateCategory(product.category)}</td>
                        <td>
                            ${product.image ? 
                                `<img src="${product.image}" alt="${product.name}" width="50" loading="lazy" onerror="this.src='/assets/images/placeholder.svg'">` : 
                                'Sin imagen'}
                        </td>
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
            tbody.innerHTML = `<tr><td colspan="7">Error al cargar productos: ${error.message}</td></tr>`;
        }
        showMessage(`Error al cargar productos: ${error.message}`, 'error');
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
                        <select id="editProductCategory" class="form-input" required aria-required="true">
                            <option value="">Seleccione una categoría</option>
                            <option value="arreglos" ${product.category === 'arreglos' ? 'selected' : ''}>Arreglos Florales</option>
                            <option value="ramos" ${product.category === 'ramos' ? 'selected' : ''}>Ramos</option>
                            <option value="plantas" ${product.category === 'plantas' ? 'selected' : ''}>Plantas</option>
                            <option value="accesorios" ${product.category === 'accesorios' ? 'selected' : ''}>Accesorios</option>
                        </select>
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
                        <input type="file" id="editProductImageFile" class="form-input" accept="image/*">
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
        // Mostrar indicador de carga
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Actualizando...';
        submitButton.disabled = true;
        
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
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            return;
        }
        
        // Si no hay imagen, usar una por defecto
        if (!productData.image) {
            productData.image = '/assets/images/placeholder.svg';
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
        showMessage(`Error al actualizar producto: ${error.message}`, 'error');
    } finally {
        // Restaurar botón de envío
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Actualizar Producto';
            submitButton.disabled = false;
        }
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
        if (!tbody) return;
        
        tbody.innerHTML = '<tr><td colspan="6">Cargando pedidos...</td></tr>';
        
        // Obtener pedidos del backend
        const response = await fetch('http://localhost:5000/api/orders');
        
        if (!response.ok) {
            throw new Error('Error al cargar los pedidos');
        }
        
        const orders = await response.json();
        
        if (orders.length > 0) {
            tbody.innerHTML = orders.map(order => `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.customerName}</td>
                    <td>${new Date(order.date).toLocaleDateString('es-CL')}</td>
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
    } catch (error) {
        console.error('Error al cargar pedidos:', error);
        const tbody = document.getElementById('ordersTableBody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="6">Error al cargar pedidos</td></tr>';
        }
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
    showMessage(`Filtrando pedidos por estado: ${status === '' ? 'Todos' : status}`, 'info');
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

// Mostrar modal de usuario (crear o editar)
function showUserModal(user = null) {
    const modal = document.getElementById('userModal');
    const title = document.getElementById('userModalTitle');
    
    // Verificar que los elementos existen antes de usarlos
    if (!modal || !title) {
        console.error('No se encontraron los elementos necesarios para mostrar el modal de usuario');
        return;
    }
    
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
        if (userId) userId.value = user.id;
        if (userName) userName.value = user.name;
        if (userEmail) userEmail.value = user.email;
        if (userPhone) userPhone.value = user.phone || '';
        if (userRole) userRole.value = user.role || 'user';
        if (userPassword) userPassword.value = '';
        if (passwordHelp) passwordHelp.style.display = 'block';
        if (userPassword) userPassword.removeAttribute('required');
    } else {
        // Crear nuevo usuario
        title.textContent = 'Agregar Usuario';
        if (userId) userId.value = '';
        if (userName) userName.value = '';
        if (userEmail) userEmail.value = '';
        if (userPhone) userPhone.value = '';
        if (userRole) userRole.value = 'user';
        if (userPassword) userPassword.value = '';
        if (passwordHelp) passwordHelp.style.display = 'block';
        if (userPassword) userPassword.setAttribute('required', 'required');
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

// Cargar configuración
function loadSettings() {
    console.log('Cargando configuración...');
    
    // Cargar información de la tienda
    const storeInfo = JSON.parse(localStorage.getItem('storeInfo')) || {};
    const storeName = document.getElementById('storeName');
    const storeEmail = document.getElementById('storeEmail');
    const storePhone = document.getElementById('storePhone');
    const storeAddress = document.getElementById('storeAddress');
    
    if (storeName) storeName.value = storeInfo.name || '';
    if (storeEmail) storeEmail.value = storeInfo.email || '';
    if (storePhone) storePhone.value = storeInfo.phone || '';
    if (storeAddress) storeAddress.value = storeInfo.address || '';
    
    // Cargar personalización
    const customization = JSON.parse(localStorage.getItem('customization')) || {};
    const primaryColor = document.getElementById('primaryColor');
    const secondaryColor = document.getElementById('secondaryColor');
    
    if (primaryColor) primaryColor.value = customization.primaryColor || '#4a7c59';
    if (secondaryColor) secondaryColor.value = customization.secondaryColor || '#3a6c49';
    
    // Cargar configuración de envíos
    const shipping = JSON.parse(localStorage.getItem('shippingSettings')) || {};
    const shippingCost = document.getElementById('shippingCost');
    
    if (shippingCost) shippingCost.value = shipping.cost || '';
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
                    body: JSON.stringify({ 
                        image: base64Image,
                        filename: file.name,
                        contentType: file.type
                    })
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
                // Validar que es una imagen
                if (!file.type.startsWith('image/')) {
                    showMessage('Por favor seleccione un archivo de imagen válido', 'error');
                    this.value = '';
                    return;
                }
                
                // Mostrar vista previa
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Crear o actualizar imagen de vista previa
                    let previewImg = imagePreview.querySelector('img');
                    if (!previewImg) {
                        previewImg = document.createElement('img');
                        previewImg.className = 'preview-image';
                        imagePreview.appendChild(previewImg);
                    }
                    previewImg.src = e.target.result;
                    previewImg.style.display = 'block';
                    
                    // Mostrar tamaño de la imagen
                    const sizeInfo = document.createElement('div');
                    sizeInfo.className = 'image-size-info';
                    sizeInfo.textContent = `Tamaño: ${(file.size / 1024).toFixed(2)} KB`;
                    imagePreview.appendChild(sizeInfo);
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
                // Validar que es una imagen
                if (!file.type.startsWith('image/')) {
                    showMessage('Por favor seleccione un archivo de imagen válido', 'error');
                    this.value = '';
                    return;
                }
                
                // Mostrar vista previa
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Crear o actualizar imagen de vista previa
                    let previewImg = editImagePreview.querySelector('img');
                    if (!previewImg) {
                        previewImg = document.createElement('img');
                        previewImg.className = 'preview-image';
                        editImagePreview.appendChild(previewImg);
                    }
                    previewImg.src = e.target.result;
                    previewImg.style.display = 'block';
                    
                    // Mostrar tamaño de la imagen
                    const sizeInfo = document.createElement('div');
                    sizeInfo.className = 'image-size-info';
                    sizeInfo.textContent = `Tamaño: ${(file.size / 1024).toFixed(2)} KB`;
                    editImagePreview.appendChild(sizeInfo);
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// Función para traducir categorías
function translateCategory(category) {
    const categories = {
        'arreglos': 'Arreglos Florales',
        'ramos': 'Ramos',
        'plantas': 'Plantas',
        'accesorios': 'Accesorios'
    };
    return categories[category] || category;
}

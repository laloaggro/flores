// adminProducts.js - Funciones para manejar productos en el panel de administración

// Cargar productos en el panel de administración
async function loadAdminProducts() {
    try {
        showLoadingMessage('productsTableBody', 'Cargando productos...');
        
        const response = await fetch('/api/products?page=1&limit=100');
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
                        <button class="btn-icon edit-product" data-id="${product.id}" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete-product" data-id="${product.id}" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
            
            // Adjuntar event listeners
            attachProductEventListeners();
        } else {
            tbody.innerHTML = '<tr><td colspan="5">No hay productos disponibles</td></tr>';
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
        document.getElementById('productsTableBody').innerHTML = '<tr><td colspan="5">Error al cargar productos</td></tr>';
    }
}

// Mostrar mensaje de carga
function showLoadingMessage(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<tr><td colspan="5">${message}</td></tr>`;
    }
}

// Adjuntar event listeners a los botones de productos
function attachProductEventListeners() {
    // Botones de editar
    document.querySelectorAll('.edit-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            editProduct(productId);
        });
    });
    
    // Botones de eliminar
    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            deleteProduct(productId);
        });
    });
}

// Editar producto
async function editProduct(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
            throw new Error('Error al obtener producto');
        }
        
        const product = await response.json();
        
        // Crear modal de edición
        createProductModal(product);
    } catch (error) {
        console.error('Error al editar producto:', error);
        alert('Error al cargar el producto para edición');
    }
}

// Crear producto
function createProduct() {
    // Crear modal de creación con datos vacíos
    const emptyProduct = {
        id: '',
        name: '',
        description: '',
        price: '',
        category: '',
        size: '',
        image_url: ''
    };
    
    createProductModal(emptyProduct, true);
}

// Crear modal para producto (crear o editar)
function createProductModal(product, isNew = false) {
    const modalHtml = `
        <div class="modal product-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${isNew ? 'Crear Producto' : 'Editar Producto'}</h3>
                    <span class="modal-close">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="productForm">
                        <input type="hidden" id="productId" value="${product.id}">
                        
                        <div class="form-group">
                            <label for="productName">Nombre *</label>
                            <input type="text" id="productName" class="form-input" value="${product.name}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="productDescription">Descripción *</label>
                            <textarea id="productDescription" class="form-input" required>${product.description}</textarea>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="productPrice">Precio *</label>
                                <input type="number" id="productPrice" class="form-input" value="${product.price}" step="0.01" min="0" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="productCategory">Categoría *</label>
                                <input type="text" id="productCategory" class="form-input" value="${product.category}" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="productSize">Tamaño</label>
                                <input type="text" id="productSize" class="form-input" value="${product.size || ''}">
                            </div>
                            
                            <div class="form-group">
                                <label for="productImage">URL de Imagen</label>
                                <input type="text" id="productImage" class="form-input" value="${product.image_url || ''}">
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary modal-close-btn">Cancelar</button>
                            <button type="submit" class="btn btn-primary">${isNew ? 'Crear' : 'Actualizar'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Agregar modal al body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Adjuntar event listeners
    const modal = document.querySelector('.product-modal');
    const closeButtons = modal.querySelectorAll('.modal-close, .modal-close-btn');
    const productForm = document.getElementById('productForm');
    
    // Cerrar modal
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.remove();
        });
    });
    
    // Enviar formulario
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (isNew) {
            saveNewProduct();
        } else {
            updateProduct(product.id);
        }
    });
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Guardar nuevo producto
async function saveNewProduct() {
    try {
        const productData = {
            name: document.getElementById('productName').value,
            description: document.getElementById('productDescription').value,
            price: document.getElementById('productPrice').value,
            category: document.getElementById('productCategory').value,
            size: document.getElementById('productSize').value,
            image_url: document.getElementById('productImage').value
        };
        
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(productData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al crear producto');
        }
        
        // Cerrar modal
        document.querySelector('.product-modal').remove();
        
        // Recargar productos
        loadAdminProducts();
        
        // Mostrar mensaje de éxito
        alert('Producto creado exitosamente');
    } catch (error) {
        console.error('Error al crear producto:', error);
        alert(`Error al crear producto: ${error.message}`);
    }
}

// Actualizar producto
async function updateProduct(productId) {
    try {
        const productData = {
            name: document.getElementById('productName').value,
            description: document.getElementById('productDescription').value,
            price: document.getElementById('productPrice').value,
            category: document.getElementById('productCategory').value,
            size: document.getElementById('productSize').value,
            image_url: document.getElementById('productImage').value
        };
        
        const response = await fetch(`/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(productData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al actualizar producto');
        }
        
        // Cerrar modal
        document.querySelector('.product-modal').remove();
        
        // Recargar productos
        loadAdminProducts();
        
        // Mostrar mensaje de éxito
        alert('Producto actualizado exitosamente');
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        alert(`Error al actualizar producto: ${error.message}`);
    }
}

// Eliminar producto
async function deleteProduct(productId) {
    if (!confirm('¿Está seguro de que desea eliminar este producto?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al eliminar producto');
        }
        
        // Recargar productos
        loadAdminProducts();
        
        // Mostrar mensaje de éxito
        alert('Producto eliminado exitosamente');
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert(`Error al eliminar producto: ${error.message}`);
    }
}

// Exportar funciones
export { 
    loadAdminProducts, 
    createProduct, 
    editProduct, 
    deleteProduct 
};
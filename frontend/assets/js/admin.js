// admin.js - Funcionalidad del panel de administración

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario es administrador
    checkAdminAccess();
    
    // Inicializar el panel de administración
    initAdminPanel();
    
    // Manejar la navegación del menú
    setupMenuNavigation();
});

// Verificar si el usuario tiene acceso de administrador
async function checkAdminAccess() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirigir al login si no hay token
            window.location.href = '../login.html';
            return;
        }
        
        const response = await fetch('/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('No autorizado');
        }
        
        const userData = await response.json();
        
        // Verificar si el usuario es administrador
        if (userData.role !== 'admin') {
            // Mostrar mensaje de error y redirigir
            alert('Acceso denegado. Necesitas permisos de administrador.');
            window.location.href = '../index.html';
            return;
        }
        
        // Mostrar el nombre del administrador
        document.getElementById('userName').textContent = userData.name;
    } catch (error) {
        console.error('Error al verificar acceso de administrador:', error);
        window.location.href = '../login.html';
    }
}

// Inicializar el panel de administración
function initAdminPanel() {
    // Cargar estadísticas
    loadStats();
    
    // Cargar productos
    loadProducts();
    
    // Cargar pedidos
    loadOrders();
    
    // Cargar usuarios
    loadUsers();
}

// Cargar estadísticas del dashboard
async function loadStats() {
    try {
        // Simular carga de estadísticas
        setTimeout(() => {
            document.getElementById('productCount').textContent = '24';
            document.getElementById('orderCount').textContent = '18';
            document.getElementById('userCount').textContent = '42';
            document.getElementById('revenueCount').textContent = '$2.450.000';
        }, 1000);
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}

// Cargar productos
async function loadProducts() {
    try {
        const response = await fetch('/api/products?page=1&limit=10');
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
        } else {
            tbody.innerHTML = '<tr><td colspan="5">No hay productos disponibles</td></tr>';
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
        document.getElementById('productsTableBody').innerHTML = '<tr><td colspan="5">Error al cargar productos</td></tr>';
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
                    <td>Juan Pérez</td>
                    <td>juan@example.com</td>
                    <td>+56912345678</td>
                    <td>admin</td>
                    <td>
                        <button class="btn-icon edit-user" data-id="1">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete-user" data-id="1">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>María González</td>
                    <td>maria@example.com</td>
                    <td>+56987654321</td>
                    <td>user</td>
                    <td>
                        <button class="btn-icon edit-user" data-id="2">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete-user" data-id="2">
                            <i class="fas fa-trash"></i>
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
    const menuLinks = document.querySelectorAll('.admin-menu a');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase activa de todos los elementos
            document.querySelectorAll('.admin-menu li').forEach(li => {
                li.classList.remove('active');
            });
            
            // Agregar clase activa al elemento seleccionado
            this.parentElement.classList.add('active');
            
            // Ocultar todas las secciones
            document.querySelectorAll('.admin-content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Mostrar la sección seleccionada
            const targetSection = this.getAttribute('data-section');
            document.getElementById(targetSection).classList.add('active');
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
    container.insertBefore(messageElement, container.firstChild);
    
    // Eliminar el mensaje después de 5 segundos
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}
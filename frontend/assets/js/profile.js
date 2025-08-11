// profile.js - Manejo de la página de perfil de usuario
import { initUserMenu, getUser, isAuthenticated, requireAuth } from './auth.js';

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está logueado
    if (!requireAuth()) {
        return;
    }
    
    const user = getUser();
    
    // Mostrar información del usuario
    displayUserInfo(user);
    
    // Configurar event listeners
    setupEventListeners();
    
    // Cargar datos adicionales del usuario
    loadUserStats();
    
    // Inicializar el menú de usuario
    initUserMenu();
});

// Mostrar información del usuario
function displayUserInfo(user) {
    // Actualizar elementos del DOM con la información del usuario
    const profileNameElement = document.getElementById('profileName');
    const userEmailElement = document.getElementById('userEmail');
    const nameElement = document.getElementById('name');
    const emailElement = document.getElementById('email');
    const phoneElement = document.getElementById('phone');
    const addressElement = document.getElementById('address');
    
    if (profileNameElement) profileNameElement.textContent = user.name || 'Usuario';
    if (userEmailElement) userEmailElement.textContent = user.email || '';
    if (nameElement) nameElement.value = user.name || '';
    if (emailElement) emailElement.value = user.email || '';
    if (phoneElement) phoneElement.value = user.phone || '';
    if (addressElement) addressElement.value = user.address || '';
}

// Configurar event listeners
function setupEventListeners() {
    // Botón de cerrar sesión
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Eliminar datos de sesión
            localStorage.removeItem('user');
            
            // Redirigir a la página principal
            window.location.href = 'index.html';
        });
    }
    
    // Formulario de perfil
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateProfile();
        });
    }
    
    // Enlaces de navegación del perfil
    const profileNavLinks = document.querySelectorAll('.profile-menu a');
    profileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            loadProfileSection(sectionId);
            
            // Actualizar clase activa
            document.querySelectorAll('.profile-menu li').forEach(li => {
                li.classList.remove('active');
            });
            this.parentElement.classList.add('active');
        });
    });
}

// Actualizar perfil de usuario
function updateProfile() {
    // Obtener datos del formulario
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    
    // Validaciones básicas
    if (!name || !email) {
        alert('Nombre y correo electrónico son obligatorios');
        return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Formato de email inválido');
        return;
    }
    
    // Obtener usuario actual
    let user = getUser();
    
    // Actualizar datos del usuario
    user.name = name;
    user.email = email;
    user.phone = phone;
    user.address = address;
    
    // Guardar en localStorage
    localStorage.setItem('user', JSON.stringify(user));
    
    // Mostrar notificación de éxito
    alert('Perfil actualizado correctamente');
    
    // Actualizar también el nombre en el encabezado
    const profileNameElement = document.getElementById('profileName');
    if (profileNameElement) profileNameElement.textContent = user.name || 'Usuario';
}

// Cargar sección del perfil
function loadProfileSection(sectionId) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.profile-content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
        
        // Si es la sección de pedidos, cargar los pedidos
        if (sectionId === 'orders') {
            loadUserOrders();
        }
    }
}

// Cargar estadísticas del usuario (simulación)
function loadUserStats() {
    // En una implementación real, esto haría una llamada a la API
    const statsContainer = document.querySelector('.profile-stats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stat">
                <span class="stat-number" id="orderCount">5</span>
                <span class="stat-label">Pedidos</span>
            </div>
            <div class="stat">
                <span class="stat-number" id="productCount">3</span>
                <span class="stat-label">Productos</span>
            </div>
            <div class="stat">
                <span class="stat-number" id="totalSpent">$120.000</span>
                <span class="stat-label">Gastado</span>
            </div>
        `;
    }
}

// Cargar pedidos del usuario
function loadUserOrders() {
    // Verificar autenticación
    if (!requireAuth()) {
        return;
    }
    
    // Obtener usuario actual
    const user = getUser();
    
    // Obtener pedidos del usuario (simulación)
    // En una implementación real, esto haría una llamada a la API
    const orders = getStoredOrders(user.id);
    
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p class="no-orders-message">No tienes pedidos aún.</p>';
        return;
    }
    
    // Renderizar pedidos
    ordersList.innerHTML = `
        <div class="orders-table">
            <div class="orders-header">
                <div>ID Pedido</div>
                <div>Fecha</div>
                <div>Total</div>
                <div>Estado</div>
                <div>Acciones</div>
            </div>
            ${orders.map(order => `
                <div class="order-row">
                    <div>#${order.id}</div>
                    <div>${new Date(order.date).toLocaleDateString('es-CL')}</div>
                    <div>$${order.total.toLocaleString('es-CL')}</div>
                    <div><span class="status ${order.status}">${getStatusText(order.status)}</span></div>
                    <div><button class="btn btn-small view-details" data-order-id="${order.id}">Ver Detalles</button></div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Añadir event listeners a los botones de detalles
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            showOrderDetails(orderId);
        });
    });
}

// Obtener pedidos almacenados (simulación)
function getStoredOrders(userId) {
    // En una implementación real, esto haría una llamada a la API
    const storedOrders = localStorage.getItem('userOrders');
    if (!storedOrders) return [];
    
    const allOrders = JSON.parse(storedOrders);
    return allOrders.filter(order => order.userId == userId);
}

// Obtener texto del estado
function getStatusText(status) {
    const statusMap = {
        'pending': 'Pendiente',
        'processing': 'Procesando',
        'shipped': 'Enviado',
        'delivered': 'Entregado',
        'cancelled': 'Cancelado'
    };
    
    return statusMap[status] || status;
}

// Mostrar detalles del pedido
function showOrderDetails(orderId) {
    // Verificar autenticación
    if (!requireAuth()) {
        return;
    }
    
    // En una implementación real, esto haría una llamada a la API para obtener los detalles
    const storedOrders = localStorage.getItem('userOrders');
    if (!storedOrders) return;
    
    const allOrders = JSON.parse(storedOrders);
    const order = allOrders.find(o => o.id == orderId);
    
    if (!order) {
        alert('Pedido no encontrado');
        return;
    }
    
    // Verificar que el pedido pertenece al usuario actual
    const user = getUser();
    if (order.userId != user.id) {
        alert('No tienes permiso para ver este pedido');
        return;
    }
    
    // Crear modal con detalles del pedido
    const modalHTML = `
        <div id="orderDetailsModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Detalles del Pedido #${order.id}</h2>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="order-details">
                        <div class="order-info">
                            <h3>Información del Pedido</h3>
                            <p><strong>Fecha:</strong> ${new Date(order.date).toLocaleDateString('es-CL')}</p>
                            <p><strong>Estado:</strong> <span class="status ${order.status}">${getStatusText(order.status)}</span></p>
                            <p><strong>Total:</strong> $${order.total.toLocaleString('es-CL')}</p>
                        </div>
                        
                        <div class="order-items">
                            <h3>Productos</h3>
                            ${order.items.map(item => `
                                <div class="order-item">
                                    <div class="order-item-image">
                                        <img src="${item.image}" alt="${item.name}">
                                    </div>
                                    <div class="order-item-details">
                                        <h4>${item.name}</h4>
                                        <p>${item.quantity} x $${item.price.toLocaleString('es-CL')}</p>
                                    </div>
                                    <div class="order-item-total">
                                        $${(item.quantity * item.price).toLocaleString('es-CL')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="order-address">
                            <h3>Dirección de Envío</h3>
                            <p>${order.shippingAddress || 'Dirección no especificada'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Insertar modal en el DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Añadir event listeners al modal
    const modal = document.getElementById('orderDetailsModal');
    const closeBtn = modal.querySelector('.close');
    
    closeBtn.addEventListener('click', function() {
        modal.remove();
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    });
}

// Exportar funciones si es necesario
export { displayUserInfo, setupEventListeners, loadProfileSection, loadUserStats };
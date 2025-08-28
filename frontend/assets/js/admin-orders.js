// admin-orders.js - Manejo de la página de gestión de pedidos del administrador
import { initUserMenu, logout } from './auth.js';
import { API_BASE_URL, isAuthenticated, isAdmin, getAuthToken, showNotification } from './utils.js';

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar menú de usuario
    initUserMenu();
    
    // Verificar autenticación
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Verificar rol de administrador
    if (!isAdmin()) {
        window.location.href = 'index.html';
        return;
    }
    
    // Cargar todos los pedidos
    loadAllOrders();
    
    // Configurar eventos
    setupEventListeners();
});

// Configurar eventos
function setupEventListeners() {
    // Botón de refrescar pedidos
    const refreshOrdersBtn = document.getElementById('refreshOrdersBtn');
    if (refreshOrdersBtn) {
        refreshOrdersBtn.addEventListener('click', loadAllOrders);
    }
    
    // Formulario de edición de pedido
    const editOrderForm = document.getElementById('editOrderForm');
    if (editOrderForm) {
        editOrderForm.addEventListener('submit', updateOrderStatus);
    }
    
    // Botón de cancelar edición
    const cancelEditOrder = document.getElementById('cancelEditOrder');
    if (cancelEditOrder) {
        cancelEditOrder.addEventListener('click', closeEditOrderModal);
    }
    
    // Cerrar modal al hacer clic en la X
    const closeButtons = document.querySelectorAll('.btn-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', closeEditOrderModal);
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    const modal = document.getElementById('editOrderModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeEditOrderModal();
            }
        });
    }
    
    // Cerrar modal con la tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeEditOrderModal();
        }
    });
}

// Cargar todos los pedidos
async function loadAllOrders() {
    try {
        // Mostrar indicador de carga
        document.getElementById('ordersList').innerHTML = '<tr><td colspan="6" class="text-center">Cargando pedidos...</td></tr>';
        
        // En una implementación real, esto cargaría datos desde la API
        // const response = await fetch(`${API_BASE_URL}/api/orders`, {
        //     headers: {
        //         'Authorization': `Bearer ${getAuthToken()}`
        //     }
        // });
        // const orders = await response.json();
        
        // Generar pedidos de ejemplo (simulación)
        const orders = generateMockOrders();
        
        // Simular demora de red
        setTimeout(() => {
            renderOrders(orders);
        }, 500);
        
    } catch (error) {
        console.error('Error al cargar pedidos:', error);
        document.getElementById('ordersList').innerHTML = '<tr><td colspan="6" class="text-center">Error al cargar los pedidos. Por favor, intenta nuevamente.</td></tr>';
    }
}

// Generar pedidos de ejemplo (simulación)
function generateMockOrders() {
    return [
        {
            id: 'ORD-001',
            date: '2025-08-25T10:30:00Z',
            customer: 'Juan Pérez',
            total: 25990,
            status: 'pending'
        },
        {
            id: 'ORD-002',
            date: '2025-08-24T14:15:00Z',
            customer: 'María González',
            total: 18500,
            status: 'processing'
        },
        {
            id: 'ORD-003',
            date: '2025-08-23T09:45:00Z',
            customer: 'Carlos López',
            total: 32750,
            status: 'shipped'
        },
        {
            id: 'ORD-004',
            date: '2025-08-22T16:20:00Z',
            customer: 'Ana Rodríguez',
            total: 15200,
            status: 'delivered'
        },
        {
            id: 'ORD-005',
            date: '2025-08-21T11:10:00Z',
            customer: 'Pedro Sánchez',
            total: 21000,
            status: 'cancelled'
        }
    ];
}

// Renderizar pedidos en la tabla
function renderOrders(orders) {
    const ordersList = document.getElementById('ordersList');
    
    if (!orders || orders.length === 0) {
        ordersList.innerHTML = '<tr><td colspan="6" class="text-center">No se encontraron pedidos.</td></tr>';
        return;
    }
    
    ordersList.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${new Date(order.date).toLocaleDateString('es-CL')}</td>
            <td>${order.customer}</td>
            <td>$${order.total.toLocaleString('es-CL')}</td>
            <td><span class="order-status ${order.status}">${getStatusLabel(order.status)}</span></td>
            <td>
                <button class="btn-small btn-secondary" onclick="viewOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i> Ver
                </button>
                <button class="btn-small btn-primary" onclick="editOrderStatus('${order.id}', '${order.status}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
            </td>
        </tr>
    `).join('');
}

// Obtener etiqueta de estado en español
function getStatusLabel(status) {
    const statusLabels = {
        'pending': 'Pendiente',
        'processing': 'Procesando',
        'shipped': 'Enviado',
        'delivered': 'Entregado',
        'cancelled': 'Cancelado'
    };
    
    return statusLabels[status] || status;
}

// Ver detalles del pedido
window.viewOrderDetails = function(orderId) {
    showNotification(`Funcionalidad para ver detalles del pedido #${orderId}`, 'info');
    // En una implementación real, esto mostraría un modal con los detalles del pedido
};

// Editar estado del pedido
window.editOrderStatus = function(orderId, currentStatus) {
    const modal = document.getElementById('editOrderModal');
    const orderIdInput = document.getElementById('editOrderId');
    const statusSelect = document.getElementById('orderStatus');
    
    if (modal && orderIdInput && statusSelect) {
        orderIdInput.value = orderId;
        statusSelect.value = currentStatus;
        modal.style.display = 'block';
        
        // Prevenir el scroll del body cuando el modal está abierto
        document.body.style.overflow = 'hidden';
    }
};

// Cerrar modal de edición de pedido
function closeEditOrderModal() {
    const modal = document.getElementById('editOrderModal');
    if (modal) {
        modal.style.display = 'none';
        
        // Restaurar el scroll del body
        document.body.style.overflow = '';
        
        // Limpiar el formulario
        const editOrderForm = document.getElementById('editOrderForm');
        if (editOrderForm) {
            editOrderForm.reset();
        }
    }
}

// Actualizar estado del pedido
async function updateOrderStatus(e) {
    e.preventDefault();
    
    try {
        const orderId = document.getElementById('editOrderId').value;
        const status = document.getElementById('orderStatus').value;
        const notes = document.getElementById('orderNotes').value;
        
        // En una implementación real, esto enviaría una solicitud a la API
        console.log(`Actualizando pedido ${orderId} a estado: ${status}`);
        console.log(`Notas: ${notes}`);
        
        // Simular actualización
        setTimeout(() => {
            showNotification(`Estado del pedido #${orderId} actualizado a ${getStatusLabel(status)}`, 'success');
            closeEditOrderModal();
            loadAllOrders(); // Recargar la lista de pedidos
        }, 500);
        
    } catch (error) {
        console.error('Error al actualizar estado del pedido:', error);
        showNotification('Error al actualizar el estado del pedido', 'error');
    }
}

// Función para limitar la frecuencia de ejecución de una función
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

// Función para filtrar pedidos
function filterOrders() {
    const searchTerm = document.getElementById('searchOrders').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const rows = document.querySelectorAll('#ordersList tr:not(.no-results)');
    
    rows.forEach(row => {
        const orderId = row.cells[0].textContent.toLowerCase();
        const customer = row.cells[2].textContent.toLowerCase();
        const statusCell = row.cells[4].querySelector('.order-status');
        const status = statusCell ? statusCell.classList[1] : '';
        
        const matchesSearch = orderId.includes(searchTerm) || customer.includes(searchTerm);
        const matchesStatus = !statusFilter || status === statusFilter;
        
        if (matchesSearch && matchesStatus) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Exportar funciones para uso en otros archivos
window.editOrderStatus = editOrderStatus;
window.viewOrderDetails = viewOrderDetails;
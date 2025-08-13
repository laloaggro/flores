import { API_BASE_URL, showNotification, isAuthenticated, requireAuth, formatPrice } from './utils.js';
import { getCartItems, clearCart } from './cart.js';
import { initUserMenu } from './auth.js';

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth()) {
        return;
    }
    
    // Inicializar menú de usuario
    initUserMenu();
    
    // Cargar items del carrito
    loadCartItems();
    
    // Configurar eventos
    setupEventListeners();
    
    // Configurar fecha mínima de entrega
    setupDeliveryDate();
});

// Cargar items del carrito
function loadCartItems() {
    const cartItems = getCartItems();
    
    if (cartItems.length === 0) {
        showNotification('Tu carrito está vacío', 'warning');
        window.location.href = 'products.html';
        return;
    }
    
    displayCartItems(cartItems);
    updateTotalAmount(cartItems);
}

// Mostrar items del carrito
function displayCartItems(items) {
    const orderItemsContainer = document.querySelector('.order-items-summary');
    const emptyMessage = document.querySelector('.empty-order-message');
    
    if (!orderItemsContainer) return;
    
    if (items.length === 0) {
        if (emptyMessage) emptyMessage.style.display = 'block';
        return;
    }
    
    if (emptyMessage) emptyMessage.style.display = 'none';
    
    orderItemsContainer.innerHTML = items.map(item => `
        <div class="order-item">
            <div>
                <strong>${item.name}</strong>
                <div>Cantidad: ${item.quantity}</div>
            </div>
            <div>${formatPrice(item.price * item.quantity)}</div>
        </div>
    `).join('');
}

// Actualizar monto total
function updateTotalAmount(items) {
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalElement = document.querySelector('.total-amount');
    
    if (totalElement) {
        totalElement.textContent = formatPrice(totalAmount);
    }
}

// Configurar fecha mínima de entrega
function setupDeliveryDate() {
    const deliveryDateInput = document.getElementById('deliveryDate');
    if (deliveryDateInput) {
        // Establecer la fecha mínima como mañana
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Formatear como YYYY-MM-DD
        const minDate = tomorrow.toISOString().split('T')[0];
        deliveryDateInput.min = minDate;
        
        // Establecer valor por defecto (mañana)
        deliveryDateInput.value = minDate;
    }
}

// Configurar eventos
function setupEventListeners() {
    // Selección de método de entrega
    const shippingMethods = document.querySelectorAll('.shipping-method');
    shippingMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remover clase seleccionada de todos los métodos
            shippingMethods.forEach(m => m.classList.remove('selected'));
            
            // Agregar clase seleccionada al método clickeado
            this.classList.add('selected');
            
            // Mostrar/ocultar campos de dirección según el método
            const methodType = this.dataset.method;
            const addressFields = document.getElementById('addressFields');
            
            if (addressFields) {
                if (methodType === 'delivery') {
                    addressFields.style.display = 'block';
                } else {
                    addressFields.style.display = 'none';
                }
            }
        });
    });
    
    // Selección de método de pago
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remover clase seleccionada de todos los métodos
            paymentMethods.forEach(m => m.classList.remove('selected'));
            
            // Agregar clase seleccionada al método clickeado
            this.classList.add('selected');
        });
    });
    
    // Botón de finalizar compra
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', placeOrder);
    }
}

// Finalizar compra
async function placeOrder() {
    try {
        // Validar formulario
        if (!validateForm()) {
            return;
        }
        
        // Obtener datos del pedido
        const orderData = getOrderData();
        
        // En una implementación real, aquí se enviaría la orden al backend
        console.log('Datos del pedido:', orderData);
        
        // Mostrar mensaje de éxito
        showNotification('Pedido realizado con éxito', 'success');
        
        // Limpiar carrito
        clearCart();
        
        // Redirigir a página de confirmación
        setTimeout(() => {
            window.location.href = 'order-confirmation.html';
        }, 2000);
    } catch (error) {
        console.error('Error al realizar el pedido:', error);
        showNotification('Error al realizar el pedido', 'error');
    }
}

// Validar formulario
function validateForm() {
    const customerEmail = document.getElementById('customerEmail');
    const recipientName = document.getElementById('recipientName');
    const recipientPhone = document.getElementById('recipientPhone');
    const deliveryDate = document.getElementById('deliveryDate');
    
    // Validar email
    if (!customerEmail || !customerEmail.value) {
        showNotification('Por favor, ingresa tu correo electrónico', 'error');
        return false;
    }
    
    // Validar nombre del destinatario
    if (!recipientName || !recipientName.value) {
        showNotification('Por favor, ingresa el nombre del destinatario', 'error');
        return false;
    }
    
    // Validar teléfono del destinatario
    if (!recipientPhone || !recipientPhone.value) {
        showNotification('Por favor, ingresa el teléfono del destinatario', 'error');
        return false;
    }
    
    // Validar fecha de entrega
    if (!deliveryDate || !deliveryDate.value) {
        showNotification('Por favor, selecciona una fecha de entrega', 'error');
        return false;
    }
    
    // Validar dirección si es entrega a domicilio
    const selectedShippingMethod = document.querySelector('.shipping-method.selected');
    if (selectedShippingMethod && selectedShippingMethod.dataset.method === 'delivery') {
        const deliveryAddress = document.getElementById('deliveryAddress');
        if (!deliveryAddress || !deliveryAddress.value) {
            showNotification('Por favor, ingresa la dirección de entrega', 'error');
            return false;
        }
    }
    
    return true;
}

// Obtener datos del pedido
function getOrderData() {
    const cartItems = getCartItems();
    
    const orderData = {
        customer: {
            email: document.getElementById('customerEmail').value
        },
        recipient: {
            name: document.getElementById('recipientName').value,
            phone: document.getElementById('recipientPhone').value
        },
        shipping: {
            method: document.querySelector('.shipping-method.selected').dataset.method,
            date: document.getElementById('deliveryDate').value,
            address: document.getElementById('deliveryAddress')?.value || ''
        },
        additionalInfo: {
            presentation: document.getElementById('presentation').value,
            giftMessage: document.getElementById('giftMessage').value,
            deliveryNotes: document.getElementById('deliveryNotes').value
        },
        payment: {
            method: document.querySelector('.payment-method.selected').dataset.method
        },
        items: cartItems.map(item => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        total: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    };
    
    return orderData;
}
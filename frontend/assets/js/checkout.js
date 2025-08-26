import { showNotification, updateCartCount, formatPrice, getUser, isAuthenticated } from './utils.js';
import { initUserMenu } from './auth.js';

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar menú de usuario
  initUserMenu();
  
  // Elementos del DOM
  const orderItems = document.querySelector('.order-items');
  const totalAmount = document.querySelector('.total-amount');
  const paymentForm = document.getElementById('paymentForm');
  
  // Verificar autenticación
  if (!isAuthenticated()) {
    showNotification('Debes iniciar sesión para continuar con el pedido', 'error');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
    return;
  }
  
  // Cargar resumen del pedido
  loadOrderSummary();
  
  // Manejar envío del formulario de pago
  paymentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener datos del formulario
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const cardName = document.getElementById('cardName').value;
    const billingAddress = document.getElementById('billingAddress').value;
    
    // Validaciones básicas (en un entorno real, estas validaciones serían más robustas)
    if (!cardNumber || !expiryDate || !cvv || !cardName || !billingAddress) {
      showNotification('Por favor completa todos los campos', 'error');
      return;
    }
    
    // Procesar pago (simulado)
    processPayment({
      cardNumber,
      expiryDate,
      cvv,
      cardName,
      billingAddress
    });
  });
  
  // Cargar resumen del pedido
  function loadOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
      orderItems.innerHTML = '<p class="empty-order-message">No hay productos en tu pedido</p>';
      totalAmount.textContent = '$0.00';
      return;
    }
    
    // Calcular total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Renderizar items del pedido
    orderItems.innerHTML = cart.map(item => `
      <div class="order-item">
        <div class="order-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="order-item-details">
          <h4>${item.name}</h4>
          <p>${item.quantity} x ${formatPrice(item.price)}</p>
        </div>
        <div class="order-item-total">
          ${formatPrice(item.price * item.quantity)}
        </div>
      </div>
    `).join('');
    
    // Actualizar total
    totalAmount.textContent = formatPrice(total);
  }
  
  // Función para mostrar indicador de carga
  function showLoading(message = 'Procesando...') {
    const loadingElement = document.createElement('div');
    loadingElement.id = 'checkout-loading';
    loadingElement.className = 'loading-overlay';
    loadingElement.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(loadingElement);
  }

  // Función para ocultar indicador de carga
  function hideLoading() {
    const loadingElement = document.getElementById('checkout-loading');
    if (loadingElement) {
        loadingElement.remove();
    }
  }

  // Función para mostrar mensaje de error
  function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <p>${message}</p>
        <button class="btn btn-primary" onclick="this.parentElement.remove()">Cerrar</button>
    `;
    document.body.appendChild(errorElement);
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        if (errorElement.parentElement) {
            errorElement.remove();
        }
    }, 5000);
  }

  // Función para procesar el pago con manejo de errores
  async function processPayment() {
    showLoading('Procesando pago...');
    
    try {
        // Simular proceso de pago
        const response = await fetch('/api/checkout/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(getPaymentData())
        });
        
        if (!response.ok) {
            throw new Error(`Error en el proceso de pago: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        showConfirmation(result.orderId);
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        showError('No se pudo procesar el pago. Por favor, verifica tus datos e inténtalo de nuevo.');
    } finally {
        hideLoading();
    }
  }
  
  // Inicializar contador del carrito
  updateCartCount();
});
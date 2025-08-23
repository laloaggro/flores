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
  
  // Procesar pago (simulado)
  async function processPayment(paymentData) {
    // Mostrar mensaje de procesamiento
    showNotification('Procesando pago...', 'info');
    
    try {
      // Obtener datos del carrito y usuario
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const user = getUser();
      
      if (cart.length === 0) {
        throw new Error('El carrito está vacío');
      }
      
      // Calcular total
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Obtener datos de envío del formulario (si existe)
      const shippingFirstName = document.getElementById('shippingFirstName')?.value || '';
      const shippingLastName = document.getElementById('shippingLastName')?.value || '';
      const shippingAddress = document.getElementById('shippingAddress')?.value || paymentData.billingAddress;
      const shippingPhone = document.getElementById('shippingPhone')?.value || '';
      const shippingEmail = document.getElementById('shippingEmail')?.value || user.email;
      
      // Crear pedido
      const orderData = {
        userId: user.id,
        customerName: user.name,
        customerEmail: shippingEmail,
        items: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: total,
        shippingAddress: shippingAddress,
        paymentMethod: 'Tarjeta de crédito'
      };
      
      // Enviar pedido al backend
      const response = await fetch('http://localhost:5000/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el pedido');
      }
      
      const order = await response.json();
      
      // Simular proceso de pago (en un entorno real, aquí se haría la llamada al API de pago)
      setTimeout(() => {
        // Simular éxito en el pago
        showNotification('¡Pago procesado exitosamente!', 'success');
        
        // Limpiar carrito
        localStorage.removeItem('cart');
        updateCartCount();
        
        // Mostrar información de depuración
        console.log('Pago procesado para el usuario:', user);
        console.log('Datos de pago:', paymentData);
        console.log('Pedido creado:', order);
        
        // Mostrar número de pedido en la página de confirmación
        const orderNumberElement = document.getElementById('orderNumber');
        if (orderNumberElement) {
          orderNumberElement.innerHTML = `Número de pedido: <strong>#${order.id}</strong>`;
        }
        
        // Mostrar resumen del pedido en la página de confirmación
        const orderItemsElement = document.getElementById('orderItems');
        if (orderItemsElement) {
          orderItemsElement.innerHTML = order.items.map(item => `
            <div class="order-item">
              <div class="order-item-details">
                <h4>${item.productName}</h4>
                <p>${item.quantity} x ${formatPrice(item.price)}</p>
              </div>
              <div class="order-item-total">
                ${formatPrice(item.quantity * item.price)}
              </div>
            </div>
          `).join('');
        }
        
        // Mostrar total pagado
        const paidAmountElement = document.getElementById('paidAmount');
        if (paidAmountElement) {
          paidAmountElement.textContent = formatPrice(order.total);
        }
        
        // Cambiar a la pantalla de confirmación
        document.querySelectorAll('.checkout-step').forEach(step => {
          step.classList.remove('active');
        });
        document.getElementById('confirmation-step').classList.add('active');
        
        // Actualizar indicador de pasos
        document.querySelectorAll('.step').forEach(step => {
          step.classList.remove('active', 'completed');
        });
        document.querySelector('.step[data-step="confirmation"]').classList.add('active', 'completed');
        document.querySelector('.step[data-step="payment"]').classList.add('completed');
      }, 2000);
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      showNotification(`Error al procesar el pago: ${error.message}`, 'error');
    }
  }
  
  // Inicializar contador del carrito
  updateCartCount();
});
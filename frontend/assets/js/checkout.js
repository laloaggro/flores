import { showNotification, updateCartCount, formatPrice, getUser, isAuthenticated, requireAuth } from './utils.js';

document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const orderItems = document.querySelector('.order-items');
  const totalAmount = document.querySelector('.total-amount');
  const paymentForm = document.getElementById('paymentForm');
  
  // Verificar autenticación
  if (!requireAuth()) {
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
    
    // Validar formato de número de tarjeta (simplificado)
    const cardRegex = /^\d{4} \d{4} \d{4} \d{4}$/;
    if (!cardRegex.test(cardNumber)) {
      showNotification('Formato de número de tarjeta inválido', 'error');
      return;
    }
    
    // Validar formato de fecha de expiración
    const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!expiryRegex.test(expiryDate)) {
      showNotification('Formato de fecha de expiración inválido', 'error');
      return;
    }
    
    // Validar formato de CVV
    const cvvRegex = /^\d{3,4}$/;
    if (!cvvRegex.test(cvv)) {
      showNotification('Formato de CVV inválido', 'error');
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
  function processPayment(paymentData) {
    // Mostrar mensaje de procesamiento
    showNotification('Procesando pago...', 'info');
    
    // Simular proceso de pago (en un entorno real, aquí se haría la llamada al API de pago)
    setTimeout(() => {
      // Simular éxito en el pago
      showNotification('¡Pago procesado exitosamente!', 'success');
      
      // Guardar pedido
      saveOrder(paymentData);
      
      // Limpiar carrito
      localStorage.removeItem('cart');
      updateCartCount();
      
      // Mostrar información de depuración
      console.log('Pago procesado para el usuario:', getUser());
      console.log('Datos de pago:', paymentData);
      
      // Redirigir a página de confirmación o inicio después de 2 segundos
      setTimeout(() => {
        window.location.href = 'profile.html#orders';
      }, 2000);
    }, 2000);
  }
  
  // Guardar pedido
  function saveOrder(paymentData) {
    const user = getUser();
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Crear objeto de pedido
    const order = {
      id: Date.now(), // ID único basado en timestamp
      userId: user.id,
      date: new Date().toISOString(),
      items: cart,
      total: total,
      status: 'pending',
      paymentData: {
        cardName: paymentData.cardName,
        billingAddress: paymentData.billingAddress
        // Nota: En producción, no almacenar información sensible real como números de tarjeta
      },
      shippingAddress: user.address || paymentData.billingAddress
    };
    
    // Obtener pedidos existentes
    let userOrders = JSON.parse(localStorage.getItem('userOrders')) || [];
    
    // Añadir nuevo pedido
    userOrders.push(order);
    
    // Guardar en localStorage
    localStorage.setItem('userOrders', JSON.stringify(userOrders));
    
    console.log('Pedido guardado:', order);
  }
  
  // Inicializar contador del carrito
  updateCartCount();
});
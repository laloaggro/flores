const fs = require('fs');
const path = require('path');

// Simular datos de usuario
const mockUser = {
  id: 1,
  name: "Juan Pérez",
  email: "juan.perez@example.com",
  phone: "+56912345678"
};

// Simular datos de envío
const mockShippingInfo = {
  firstName: "Juan",
  lastName: "Pérez",
  address: "Av. Principal 123, Depto. 45",
  phone: "+56912345678",
  email: "juan.perez@example.com",
  notes: "Dejar en recepción"
};

// Simular datos de pago
const mockPaymentInfo = {
  cardNumber: "4111111111111111",
  expiryDate: "12/25",
  cvv: "123",
  cardName: "Juan Pérez"
};

// Simular carrito de compras
const mockCart = [
  {
    id: 1,
    name: "Ramo de Rosas",
    price: 15990,
    quantity: 2
  },
  {
    id: 2,
    name: "Arreglo Floral",
    price: 24990,
    quantity: 1
  }
];

// Función para calcular total del carrito
function calculateCartTotal(cart) {
  return cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}

// Función para procesar pago (simulación)
async function processPayment(paymentInfo) {
  console.log("Procesando pago...");
  
  // Simular demora de red
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simular respuesta exitosa del procesador de pagos
  const paymentResult = {
    success: true,
    transactionId: "txn_" + Math.random().toString(36).substr(2, 9),
    amount: calculateCartTotal(mockCart)
  };
  
  console.log(`Pago procesado exitosamente. ID de transacción: ${paymentResult.transactionId}`);
  return paymentResult;
}

// Función para crear pedido
function createOrder(user, shippingInfo, cart, paymentResult) {
  const order = {
    id: "ORD-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
    userId: user.id,
    customerName: user.name,
    customerEmail: user.email,
    shippingInfo,
    items: cart,
    total: calculateCartTotal(cart),
    paymentTransactionId: paymentResult.transactionId,
    status: "confirmed",
    createdAt: new Date().toISOString()
  };
  
  // Guardar pedido en archivo
  const ordersFile = path.join(__dirname, 'orders-test.json');
  let orders = [];
  
  try {
    const ordersData = fs.readFileSync(ordersFile, 'utf8');
    orders = JSON.parse(ordersData);
  } catch (err) {
    // Si no existe el archivo, comenzar con lista vacía
    orders = [];
  }
  
  orders.push(order);
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
  
  return order;
}

// Función para mostrar resumen del pedido
function displayOrderSummary(order) {
  console.log("\n=== RESUMEN DEL PEDIDO ===");
  console.log(`Número de pedido: ${order.id}`);
  console.log(`Cliente: ${order.customerName}`);
  console.log(`Email: ${order.customerEmail}`);
  console.log(`Dirección de envío: ${order.shippingInfo.address}`);
  console.log(`Teléfono: ${order.shippingInfo.phone}`);
  
  console.log("\n--- Productos ---");
  order.items.forEach(item => {
    console.log(`${item.name} - $${item.price} x ${item.quantity} = $${item.price * item.quantity}`);
  });
  
  console.log(`\nTotal: $${order.total}`);
  console.log(`Estado: ${order.status}`);
  console.log(`ID de transacción: ${order.paymentTransactionId}`);
}

// Función principal para ejecutar el proceso de checkout
async function runCheckoutProcess() {
  console.log("Iniciando proceso de checkout...\n");
  
  try {
    // 1. Procesar pago
    const paymentResult = await processPayment(mockPaymentInfo);
    
    if (!paymentResult.success) {
      throw new Error("Error al procesar el pago");
    }
    
    // 2. Crear pedido
    const order = createOrder(mockUser, mockShippingInfo, mockCart, paymentResult);
    
    // 3. Mostrar resumen del pedido
    displayOrderSummary(order);
    
    console.log("\n✅ ¡Pedido completado exitosamente!");
    return order;
  } catch (error) {
    console.error("❌ Error en el proceso de checkout:", error.message);
    throw error;
  }
}

// Ejecutar prueba
runCheckoutProcess()
  .then(() => {
    console.log("\nPrueba de checkout completada exitosamente.");
  })
  .catch((error) => {
    console.error("\n❌ Prueba de checkout fallida:", error.message);
    process.exit(1);
  });
const fs = require('fs');
const path = require('path');

// Simular datos de productos
const mockProducts = [
  {
    id: 1,
    name: "Ramo de Rosas",
    price: 15990,
    image: "ramo-rosas.jpg",
    description: "Hermoso ramo de rosas rojas"
  },
  {
    id: 2,
    name: "Arreglo Floral",
    price: 24990,
    image: "arreglo-floral.jpg",
    description: "Arreglo floral variado"
  }
];

// Función para simular agregar productos al carrito
function addToCart(product, quantity = 1) {
  let cart = [];
  
  // Intentar cargar carrito existente
  try {
    const cartData = fs.readFileSync(path.join(__dirname, 'cart-test.json'), 'utf8');
    cart = JSON.parse(cartData);
  } catch (err) {
    // Si no existe el archivo, comenzar con carrito vacío
    cart = [];
  }
  
  // Verificar si el producto ya está en el carrito
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      ...product,
      quantity
    });
  }
  
  // Guardar carrito actualizado
  fs.writeFileSync(path.join(__dirname, 'cart-test.json'), JSON.stringify(cart, null, 2));
  
  console.log(`Producto "${product.name}" agregado al carrito. Cantidad: ${quantity}`);
  return cart;
}

// Función para calcular total del carrito
function calculateCartTotal(cart) {
  return cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}

// Función para mostrar contenido del carrito
function displayCart(cart) {
  console.log("\n=== CARRITO DE COMPRAS ===");
  if (cart.length === 0) {
    console.log("El carrito está vacío");
    return;
  }
  
  cart.forEach(item => {
    console.log(`${item.name} - $${item.price} x ${item.quantity} = $${item.price * item.quantity}`);
  });
  
  const total = calculateCartTotal(cart);
  console.log(`\nTOTAL: $${total}`);
}

// Ejecutar prueba
console.log("Iniciando prueba del carrito de compras...\n");

// Agregar productos al carrito
let cart = addToCart(mockProducts[0], 2); // 2 ramos de rosas
cart = addToCart(mockProducts[1], 1); // 1 arreglo floral

// Mostrar contenido del carrito
displayCart(cart);

console.log("\nPrueba completada exitosamente.");
# Pruebas

## Tipos de pruebas

### Pruebas unitarias

Las pruebas unitarias se enfocan en funciones individuales y componentes aislados.

#### Funciones de utilidad (utils.js)
- `isAuthenticated()`: Verifica que devuelva true/false correctamente
- `getUserInfoFromToken()`: Verifica que extraiga la información correctamente
- `showNotification()`: Verifica que cree y muestre notificaciones

#### Funciones de autenticación (auth.js)
- `login()`: Verifica el flujo de inicio de sesión exitoso y fallido
- `register()`: Verifica el flujo de registro exitoso y fallido
- `logout()`: Verifica que elimine correctamente los datos del usuario

#### Funciones de productos (products.js)
- `loadProducts()`: Verifica que cargue productos correctamente
- `loadProductById()`: Verifica que cargue un producto específico
- `displayProducts()`: Verifica que muestre productos en el DOM
- `displayProductDetail()`: Verifica que muestre detalles del producto

#### Funciones del carrito (cart.js)
- `addToCart()`: Verifica que agregue productos correctamente
- `removeFromCart()`: Verifica que elimine productos correctamente
- `updateQuantity()`: Verifica que actualice cantidades correctamente
- `getCartTotal()`: Verifica que calcule totales correctamente

### Pruebas de integración

Las pruebas de integración verifican la interacción entre múltiples componentes.

#### Autenticación y menú de usuario
- Verificar que el menú de usuario se actualice después de iniciar sesión
- Verificar que se muestre el nombre del usuario correctamente
- Verificar que el menú se oculte al cerrar sesión

#### Carrito y productos
- Verificar que se puedan agregar productos al carrito desde la página de productos
- Verificar que se puedan agregar productos al carrito desde la página de detalle
- Verificar que el contador del carrito se actualice correctamente

#### Navegación y routing
- Verificar que las páginas protegidas redirijan a login si no hay sesión
- Verificar que las páginas de administración solo sean accesibles por administradores

### Pruebas de interfaz de usuario

Las pruebas de interfaz verifican la experiencia del usuario y la usabilidad.

#### Componentes web
- Verificar que el header se muestre correctamente en todas las páginas
- Verificar que el footer se muestre correctamente en todas las páginas
- Verificar que las tarjetas de productos se muestren correctamente

#### Menú de usuario
- Verificar que el menú se abra y cierre correctamente
- Verificar que las opciones del menú sean accesibles
- Verificar que el avatar del usuario se muestre correctamente

#### Carrito de compras
- Verificar que el modal del carrito se abra y cierre correctamente
- Verificar que los productos se muestren correctamente en el carrito
- Verificar que se puedan modificar cantidades en el carrito

## Herramientas de prueba recomendadas

### Para pruebas unitarias
- Jest: Framework de pruebas para JavaScript
- jsdom: Simulación del DOM para pruebas en Node.js

### Para pruebas de integración
- Cypress: Pruebas end-to-end con navegador real
- Puppeteer: Automatización de Chrome para pruebas

### Para pruebas de accesibilidad
- axe-core: Verificación de accesibilidad web
- Lighthouse: Auditorías automatizadas de calidad web

## Ejemplos de pruebas

### Prueba unitaria de isAuthenticated
```javascript
// Verificar que isAuthenticated devuelva false sin token
localStorage.removeItem('token');
expect(isAuthenticated()).toBe(false);

// Verificar que isAuthenticated devuelva true con token válido
const futurePayload = { exp: Date.now() / 1000 + 3600 };
const token = btoa(JSON.stringify(futurePayload));
localStorage.setItem('token', token);
expect(isAuthenticated()).toBe(true);
```

### Prueba de integración del carrito
```javascript
// Verificar que se pueda agregar un producto al carrito
const product = { id: '1', name: 'Producto', price: 10 };
addToCart(product);
const cart = JSON.parse(localStorage.getItem('cart'));
expect(cart).toHaveLength(1);
expect(cart[0].id).toBe('1');
```

## Cobertura de pruebas

Objetivo de cobertura mínima:
- Funciones de utilidad: 80%
- Funciones de autenticación: 85%
- Funciones de productos: 80%
- Funciones del carrito: 85%
- Componentes web: 70%

## Ejecución de pruebas

### Pruebas unitarias
```
npm run test:unit
```

### Pruebas de integración
```
npm run test:integration
```

### Pruebas end-to-end
```
npm run test:e2e
```

### Todas las pruebas
```
npm run test
```

## Mejores prácticas

1. **Mantener pruebas independientes**: Cada prueba debe poder ejecutarse de forma aislada
2. **Usar nombres descriptivos**: Los nombres de las pruebas deben describir claramente qué se está probando
3. **Probar casos extremos**: Incluir pruebas para casos de error y datos inválidos
4. **Mantener las pruebas actualizadas**: Actualizar las pruebas cuando se modifica el código
5. **Escribir pruebas antes del código**: Cuando sea posible, seguir la metodología TDD
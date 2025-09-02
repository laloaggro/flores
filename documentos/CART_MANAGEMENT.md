# Gestión del Carrito de Compras

## Descripción general

El sistema de carrito de compras permite a los usuarios agregar productos, modificar cantidades y proceder al proceso de checkout. La información del carrito se almacena en `localStorage` para persistencia entre sesiones.

## Estructura de datos

El carrito se almacena como un array de objetos en `localStorage` con la clave `cart`:

```json
[
  {
    "id": "producto-id",
    "name": "Nombre del producto",
    "price": 25.99,
    "quantity": 2,
    "image": "ruta/a/la/imagen.jpg"
  }
]
```

## Funcionalidades principales

### Agregar productos al carrito

1. El usuario hace clic en "Agregar al carrito" en un producto
2. Se verifica si el producto ya existe en el carrito
3. Si existe, se incrementa la cantidad
4. Si no existe, se agrega como nuevo elemento
5. El carrito se actualiza en `localStorage`
6. Se actualiza el contador visual del carrito

### Modificar cantidades

1. El usuario puede aumentar o disminuir la cantidad de un producto
2. Se actualiza la cantidad en el carrito
3. Se recalculan los totales
4. Se actualiza el carrito en `localStorage`

### Eliminar productos

1. El usuario puede eliminar productos del carrito
2. Se elimina el producto del array del carrito
3. Se actualiza el carrito en `localStorage`
4. Se actualiza la interfaz del carrito

### Visualización del carrito

1. El usuario hace clic en el ícono del carrito
2. Se muestra el modal del carrito
3. Se cargan los productos del carrito desde `localStorage`
4. Se calculan y muestran los totales
5. Se permite modificar cantidades o eliminar productos

## Persistencia

El carrito se almacena en `localStorage` con la clave `cart`. Esto permite que los productos permanezcan en el carrito incluso si el usuario cierra el navegador.

## Sincronización con el servidor

Durante el proceso de checkout:

1. Se envía el contenido del carrito al servidor
2. Se procesa el pedido
3. Si el pedido es exitoso, se vacía el carrito local

## Manejo de errores

El sistema maneja los siguientes errores:

- Productos no disponibles
- Cambios en los precios
- Problemas de conexión durante el checkout
- Carrito corrupto en `localStorage`

## Optimizaciones

- Los productos se cargan solo cuando se abre el carrito
- Los cálculos de totales se realizan en tiempo real
- El carrito se guarda automáticamente después de cada modificación
- Se utiliza delegación de eventos para mejorar el rendimiento
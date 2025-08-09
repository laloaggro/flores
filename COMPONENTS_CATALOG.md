# Catálogo de Componentes

Documento que detalla los componentes del proyecto Arreglos Florales Victoria.

## Componentes Principales

### Componentes de Página
Estos son los archivos HTML principales que representan páginas completas:

1. **[index.html](file:///laloaggro/flores/frontend/index.html)** - Página de inicio
2. **[products.html](file:///laloaggro/flores/frontend/products.html)** - Página de productos
3. **[login.html](file:///laloaggro/flores/frontend/login.html)** - Página de inicio de sesión
4. **[checkout.html](file:///laloaggro/flores/frontend/checkout.html)** - Página de checkout
5. **[profile.html](file:///laloaggro/flores/frontend/profile.html)** - Página de perfil de usuario

### Componentes Reutilizables
Estos son componentes JavaScript modulares ubicados en `/frontend/components/`:

1. **[Cart.js](file:///laloaggro/flores/frontend/components/Cart.js)** - Componente del carrito de compras
2. **[ProductCard.js](file:///laloaggro/flores/frontend/components/ProductCard.js)** - Componente de tarjeta de producto individual
3. **[Products.js](file:///laloaggro/flores/frontend/components/Products.js)** - Componente de lista de productos
4. **[ProductFilters.js](file:///laloaggro/flores/frontend/components/ProductFilters.js)** - Componente de filtros de productos
5. **[Pagination.js](file:///laloaggro/flores/frontend/components/Pagination.js)** - Componente de paginación

### Módulos JavaScript
Archivos ubicados en `/frontend/assets/js/` que manejan funcionalidades específicas:

1. **[cart.js](file:///laloaggro/flores/frontend/assets/js/cart.js)** - Funcionalidad del carrito de compras
2. **[products.js](file:///laloaggro/flores/frontend/assets/js/products.js)** - Funcionalidad de la página de productos
3. **[homeProducts.js](file:///laloaggro/flores/frontend/assets/js/homeProducts.js)** - Funcionalidad de productos en la página de inicio
4. **[productManager.js](file:///laloaggro/flores/frontend/assets/js/productManager.js)** - Gestor centralizado de productos
5. **[cartUtils.js](file:///laloaggro/flores/frontend/assets/js/cartUtils.js)** - Utilidades del carrito
6. **[utils.js](file:///laloaggro/flores/frontend/assets/js/utils.js)** - Funciones de utilidad general
7. **[contact.js](file:///laloaggro/flores/frontend/assets/js/contact.js)** - Funcionalidad del formulario de contacto
8. **[login.js](file:///laloaggro/flores/frontend/assets/js/login.js)** - Funcionalidad de inicio de sesión
9. **[checkout.js](file:///laloaggro/flores/frontend/assets/js/checkout.js)** - Funcionalidad del proceso de checkout

## Estructura del Proyecto

```
/frontend/
├── index.html
├── products.html
├── login.html
├── checkout.html
├── profile.html
├── components/
│   ├── Cart.js
│   ├── ProductCard.js
│   ├── Products.js
│   ├── ProductFilters.js
│   └── Pagination.js
└── assets/
    ├── css/
    │   └── styles.css
    ├── images/
    │   ├── products/
    │   └── backgrounds/
    └── js/
        ├── cart.js
        ├── products.js
        ├── homeProducts.js
        ├── productManager.js
        ├── cartUtils.js
        ├── utils.js
        ├── contact.js
        ├── login.js
        └── checkout.js
```

## Descripción de Componentes Clave

### [ProductCard.js](file:///laloaggro/flores/frontend/components/ProductCard.js)
Componente que representa una tarjeta de producto individual con:
- Imagen del producto
- Nombre y descripción
- Categoría y fecha de creación
- Precio
- Botón para agregar al carrito

### [Products.js](file:///laloaggro/flores/frontend/components/Products.js)
Componente que maneja la visualización de múltiples productos en una cuadrícula.

### [Cart.js](file:///laloaggro/flores/frontend/components/Cart.js)
Componente que maneja la funcionalidad del carrito de compras, incluyendo:
- Agregar/eliminar productos
- Actualizar cantidades
- Calcular totales
- Mostrar modal del carrito

### [productManager.js](file:///laloaggro/flores/frontend/assets/js/productManager.js)
Módulo central que maneja:
- Carga de productos desde la API
- Caché de productos
- Operaciones del carrito de compras
- Gestión de categorías

### [Pagination.js](file:///laloaggro/flores/frontend/components/Pagination.js)
Componente que maneja la paginación de listados de productos.

### [ProductFilters.js](file:///laloaggro/flores/frontend/components/ProductFilters.js)
Componente que maneja los filtros de productos por categoría y búsqueda.

## Dependencias y Relaciones

- Los componentes de página (HTML) incluyen los módulos JavaScript necesarios
- Los componentes reutilizables se importan según sea necesario
- [productManager.js](file:///laloaggro/flores/frontend/assets/js/productManager.js) actúa como punto central para la gestión de productos y el carrito
- Los estilos CSS se aplican globalmente desde [styles.css](file:///laloaggro/flores/frontend/assets/css/styles.css)

Última actualización: 9 de agosto de 2025
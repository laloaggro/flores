# Arquitectura del Frontend

## Estructura general

El frontend sigue una arquitectura basada en componentes web reutilizables con una clara separación de responsabilidades:

```
frontend/
├── assets/
│   ├── css/           # Hojas de estilo
│   ├── images/        # Imágenes y recursos visuales
│   └── js/            # Scripts JavaScript
├── components/        # Componentes web reutilizables
└── ...                # Páginas HTML
```

## Componentes web personalizados

Los componentes web personalizados se encuentran en el directorio `frontend/components/`:

- `Header.js` - Encabezado del sitio con navegación y menú de usuario
- `Footer.js` - Pie de página con enlaces y información
- `ProductCard.js` - Tarjeta de producto reutilizable
- `Cart.js` - Componente del carrito de compras

Estos componentes solo se encargan de la estructura HTML y estilos. No contienen lógica de negocio.

## Scripts de funcionalidad

Los scripts en `frontend/assets/js/` manejan la lógica de negocio y eventos:

- `header.js` - Gestiona la funcionalidad del encabezado (eventos del menú, carrito, etc.)
- `userMenu.js` - Gestiona el estado del menú de usuario
- `products.js` - Gestiona la carga y visualización de productos
- `cart.js` - Gestiona la funcionalidad del carrito de compras
- `utils.js` - Funciones de utilidad compartidas
- `auth.js` - Funciones de autenticación

## Principios de arquitectura

### Separación de responsabilidades

1. **Componentes web personalizados**: Solo estructura HTML y estilos
2. **Scripts de funcionalidad**: Lógica de negocio y eventos
3. **Hojas de estilo**: Presentación visual

### Gestión del estado

El estado de la aplicación se gestiona principalmente a través de:

1. `localStorage` para datos persistentes (token de autenticación, carrito, preferencias)
2. Variables en memoria para datos temporales
3. El servidor para datos persistentes en backend

### Autenticación

La autenticación se maneja mediante tokens JWT almacenados en `localStorage`. Los scripts de autenticación se encuentran en `auth.js` y funciones de utilidad en `utils.js`.

### Comunicación con el backend

Todas las llamadas al backend se realizan a través de funciones en los scripts JavaScript, utilizando la URL base definida en `utils.js`.

## Convenciones de código

- Uso de módulos ES6
- Nombres de variables y funciones en inglés
- Comentarios en español para facilitar el mantenimiento
- Seguir el estilo definido en `.eslintrc.json`

## Manejo de errores

Todos los scripts deben incluir manejo de errores apropiado, especialmente en:
- Llamadas a la API
- Parseo de JSON
- Acceso a localStorage
- Operaciones asíncronas

## Optimización de rendimiento

- Lazy loading de imágenes
- Debounce en eventos frecuentes (scroll, resize)
- Caching de datos cuando sea apropiado
- Minimización de reflows y repaints
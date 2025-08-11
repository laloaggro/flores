# Arreglos Victoria Florería

Sitio web para la florería Arreglos Victoria, con funcionalidades de catálogo de productos, carrito de compras y formulario de contacto.

## Estructura del proyecto

```
.
├── backend/
│   ├── config/
│   ├── routes/
│   ├── contact.php
│   ├── contact-enhanced.php
│   ├── server.js
│   └── ...
├── frontend/
│   ├── assets/
│   ├── components/
│   └── index.html
├── README.md
├── PRODUCTION.md
├── DOCUMENTATION.md
└── SECURITY.md
```

## Tecnologías utilizadas

- Frontend: HTML, CSS (Flexbox/Grid), JavaScript (ES6+)
- Backend: Node.js con Express, PHP
- Correo: PHPMailer
- Gestión de dependencias: npm, Composer
- Base de datos: SQLite

## Características principales

### Catálogo de productos
- Visualización de productos con imágenes, descripción y precio
- Filtrado por categorías
- Paginación para una mejor experiencia de usuario

### Carrito de compras
- Añadir productos al carrito desde la página de productos
- Visualizar y gestionar el contenido del carrito
- Actualizar cantidades de productos
- Eliminar productos del carrito
- Calcular total de la compra

### Sistema de pedidos
- Proceso de checkout para finalizar compras
- Guardado de historial de pedidos por usuario
- Visualización de pedidos anteriores en el perfil de usuario
- Estados de pedido para seguimiento

### Autenticación de usuarios
- Registro e inicio de sesión de usuarios
- Perfil de usuario con datos personales
- Persistencia de sesión
- Protección contra fuerza bruta

### Formulario de contacto
- Envío de mensajes de contacto
- Validación de datos del formulario
- Recepción de mensajes por correo electrónico

## Seguridad

El sitio implementa varias medidas de seguridad:

- Contraseñas almacenadas con hash bcrypt
- Validación de entrada en frontend y backend
- Protección contra fuerza bruta con límites de tasa
- Verificación de sesión en páginas protegidas
- Control de acceso a recursos basado en identidad de usuario
- Protección contra acceso no autorizado a pedidos

Para más detalles sobre las prácticas de seguridad, consulte [SECURITY.md](SECURITY.md).

## Últimas mejoras (v1.2)

### Mejoras en el carrito de compras
- Corrección de errores en la visualización del carrito
- Mejora en la navegación y usabilidad del carrito
- Añadido fallback para carga de componentes del carrito
- Corrección de rutas de componentes
- Mejoras en la gestión de eventos del carrito

### Sistema de pedidos mejorado
- Implementación del guardado y visualización de historial de pedidos
- Añadido sistema de estados para pedidos
- Visualización de detalles de pedidos en el perfil de usuario
- Mejoras en la experiencia de checkout

### Mejoras de seguridad
- Implementación de límites de tasa para prevenir ataques de fuerza bruta
- Validación mejorada de datos de entrada
- Protección contra acceso no autorizado a pedidos
- Verificación de sesión en páginas protegidas

## Instalación y ejecución

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
Abrir `frontend/index.html` en un navegador web o servirlo con un servidor web local.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir qué te gustaría cambiar.

## Licencia

[MIT License](LICENSE)
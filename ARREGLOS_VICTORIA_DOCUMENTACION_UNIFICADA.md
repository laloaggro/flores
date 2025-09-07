# Arreglos Victoria Florería - Documentación Unificada

## Índice

1. [Descripción General](#descripción-general)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Arquitectura del Frontend](#arquitectura-del-frontend)
5. [Arquitectura del Backend](#arquitectura-del-backend)
6. [Flujo de Trabajo de Desarrollo](#flujo-de-trabajo-de-desarrollo)
7. [Características Clave](#características-clave)
8. [Consideraciones de Seguridad](#consideraciones-de-seguridad)
9. [Scripts Disponibles](#scripts-disponibles)
10. [Servidores y Puertos](#servidores-y-puertos)

## Descripción General

Arreglos Victoria Florería es una tienda en línea para una florería ubicada en Recoleta, Chile. El proyecto permite a los usuarios navegar por productos, agregar artículos al carrito, realizar pedidos y gestionar su cuenta. También incluye un panel de administración para gestionar productos y pedidos.

## Tecnologías Utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- Web Components
- Vite (para empaquetado y desarrollo)

### Backend
- Node.js
- Express
- SQLite (para almacenamiento de datos)
- JSON Web Tokens (JWT) para autenticación

### Herramientas de Desarrollo
- Git para control de versiones
- npm para gestión de paquetes
- ESLint y Prettier para linting y formateo
- Jest para pruebas unitarias

## Estructura del Proyecto

```
flores-1/
├── backend/                 # Código del servidor
├── dev/                     # Entorno de desarrollo principal
│   ├── assets/              # Recursos para desarrollo
│   │   ├── css/             # Hojas de estilo
│   │   ├── images/          # Imágenes del sitio
│   │   └── js/              # Código JavaScript
│   ├── components/          # Componentes web reutilizables
│   │   ├── cart/            # Componentes del carrito de compras
│   │   ├── header/          # Componentes de encabezado y pie de página
│   │   ├── product/         # Componentes de productos
│   │   └── utils/           # Utilidades y funciones auxiliares
│   ├── pages/               # Páginas HTML individuales
│   └── index.html           # Página principal
├── dist/                    # Archivos compilados para producción
├── docs/                    # Documentación del proyecto
└── scripts/                 # Scripts de utilidad
```

## Arquitectura del Frontend

### Componentes Principales

1. **Header** - Encabezado del sitio con navegación, logo, menú de usuario y carrito
2. **Footer** - Pie de página con información de contacto y enlaces sociales
3. **ProductCard** - Tarjeta de producto para mostrar información básica de productos
4. **ProductSearch** - Componente de búsqueda de productos
5. **ProductFilters** - Filtros para categorizar productos
6. **CartItem** - Elemento individual en el carrito de compras
7. **MobileMenu** - Menú desplegable para dispositivos móviles

### Páginas Principales

1. **index.html** - Página de inicio con productos destacados
2. **products.html** - Catálogo completo de productos
3. **product-detail.html** - Detalle individual de cada producto
4. **cart.html** - Carrito de compras
5. **checkout.html** - Proceso de pago
6. **login.html** - Inicio de sesión
7. **register.html** - Registro de nuevos usuarios
8. **profile.html** - Perfil de usuario
9. **orders.html** - Historial de pedidos
10. **wishlist.html** - Lista de deseos
11. **admin.html** - Panel de administración
12. **admin-orders.html** - Gestión de pedidos (administrador)
13. **about.html** - Información sobre la empresa
14. **contact.html** - Formulario de contacto
15. **faq.html** - Preguntas frecuentes
16. **shipping.html** - Información de envío
17. **privacy.html** - Política de privacidad
18. **terms.html** - Términos y condiciones

## Arquitectura del Backend

### API Endpoints

1. **Productos**
   - `GET /api/products` - Obtener todos los productos
   - `GET /api/products/:id` - Obtener un producto específico
   - `POST /api/products` - Crear un nuevo producto (solo admin)
   - `PUT /api/products/:id` - Actualizar un producto (solo admin)
   - `DELETE /api/products/:id` - Eliminar un producto (solo admin)

2. **Usuarios**
   - `POST /api/users/register` - Registro de nuevos usuarios
   - `POST /api/users/login` - Inicio de sesión
   - `GET /api/users/profile` - Obtener perfil de usuario
   - `PUT /api/users/profile` - Actualizar perfil de usuario

3. **Pedidos**
   - `GET /api/orders` - Obtener pedidos del usuario
   - `POST /api/orders` - Crear un nuevo pedido

4. **Reseñas**
   - `GET /api/reviews/:productId` - Obtener reseñas de un producto
   - `POST /api/reviews` - Crear una nueva reseña

5. **Lista de Deseos**
   - `GET /api/wishlist` - Obtener lista de deseos del usuario
   - `POST /api/wishlist` - Agregar producto a la lista de deseos
   - `DELETE /api/wishlist/:productId` - Eliminar producto de la lista de deseos

### Base de Datos

El proyecto utiliza SQLite para almacenar información en varias bases de datos:
- products.db - Información de productos
- users.db - Información de usuarios
- Bases de datos separadas para reseñas, lista de deseos y carrito de compras

## Flujo de Trabajo de Desarrollo

### Entornos

1. **Desarrollo** - Trabajar en el directorio `dev/`
2. **Producción** - Archivos compilados en el directorio `dist/`

### Servidores

1. **Frontend** - Puerto 3006 (Vite)
2. **Backend** - Puerto 5000 (Express)

## Características Clave

### Funcionalidades para Usuarios

1. **Navegación de productos** - Catálogo con filtros y búsqueda
2. **Carrito de compras** - Agregar, eliminar y modificar cantidades
3. **Gestión de cuenta** - Registro, inicio de sesión y perfil de usuario
4. **Lista de deseos** - Guardar productos favoritos
5. **Historial de pedidos** - Seguimiento de compras anteriores
6. **Reseñas de productos** - Calificar y comentar productos

### Funcionalidades de Administración

1. **Gestión de productos** - CRUD completo de productos
2. **Gestión de pedidos** - Visualización y actualización de pedidos
3. **Panel de control** - Visión general de métricas del negocio

### Características Técnicas

1. **Diseño responsive** - Compatible con dispositivos móviles y de escritorio
2. **Modo oscuro** - Alternar entre temas claro y oscuro
3. **Accesibilidad** - Implementación de prácticas de accesibilidad web
4. **Carga diferida** - Optimización de carga de recursos
5. **Service Worker** - Caché para funcionamiento offline
6. **SEO** - Meta etiquetas y datos estructurados para motores de búsqueda

## Consideraciones de Seguridad

1. **Content Security Policy** - Política estricta para prevenir XSS
2. **Rate Limiting** - Limitación de solicitudes para prevenir abusos
3. **Autenticación JWT** - Tokens seguros para sesiones de usuario
4. **Validación de entrada** - Verificación de datos en frontend y backend
5. **HTTPS** - Uso de conexiones seguras

## Scripts Disponibles

- `npm run dev:vite` - Inicia el servidor de desarrollo frontend
- `npm run start:backend` - Inicia el servidor backend
- `npm run start:both` - Inicia ambos servidores simultáneamente
- `npm run build:vite` - Construye el proyecto para producción
- `npm run preview:vite` - Previsualiza la construcción de producción

## Servidores y Puertos

- **Frontend**: http://localhost:3006
- **Backend**: http://localhost:5000

Para iniciar ambos servidores simultáneamente:
```bash
npm run start:both
```

O iniciarlos individualmente:
```bash
# Iniciar servidor backend
npm run start:backend

# En otra terminal, iniciar servidor frontend
npm run dev:vite
```
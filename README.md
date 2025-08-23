# Arreglos Florales Victoria 🌹

¡Bienvenido a Arreglos Florales Victoria! Somos una florería familiar con más de 10 años de experiencia en Recoleta, Región Metropolitana, especializados en crear hermosos arreglos florales para todas las ocasiones.

## Características del Sitio Web

### ✅ Funcionalidades Principales

- **Visualización de productos**: Catálogo completo de arreglos florales, ramos, plantas y accesorios
- **Sistema de autenticación**: Registro e inicio de sesión de usuarios
- **Carrito de compras**: Agregar productos y proceder al checkout
- **Panel de administración**: Gestión de productos, pedidos, usuarios y reseñas
- **Sistema de reseñas**: Los usuarios pueden dejar reseñas y calificaciones de productos
- **Lista de deseos**: Guardar productos favoritos para comprarlos más tarde
- **Búsqueda y filtrado**: Buscar productos por nombre, categoría o precio
- **Responsive design**: Diseño adaptable a dispositivos móviles y de escritorio

### ✅ Mejoras de UX/UI

- **Interfaz intuitiva**: Navegación clara y sencilla
- **Carga optimizada**: Implementación de lazy loading y preloading de recursos
- **Feedback visual**: Notificaciones para acciones del usuario
- **Accesibilidad**: Soporte para lectores de pantalla y navegación por teclado
- **Optimización de imágenes**: Conversión automática a formatos modernos (WebP)
- **Navegación por teclado**: Mejoras en accesibilidad para usuarios con discapacidad motriz

### ✅ Optimizaciones Técnicas

- **Rendimiento**: Optimización de carga de imágenes y recursos
- **SEO**: Meta etiquetas y estructura semántica para mejor posicionamiento
- **Responsive**: Diseño adaptable a diferentes tamaños de pantalla
- **Manejo de errores**: Sistema centralizado de manejo de errores
- **Componentes reutilizables**: Arquitectura modular para facilitar el mantenimiento
- **Carga diferida**: Implementación mejorada de lazy loading para imágenes

## Estructura del Proyecto

```
.
├── backend/
│   ├── middleware/              # Middleware de autenticación y otros
│   ├── routes/                  # Rutas de la API (contacto, productos, usuarios)
│   ├── uploads/                 # Directorio para archivos subidos
│   ├── server.js                # Punto de entrada del servidor
│   ├── init-db.js               # Script de inicialización de base de datos
│   ├── users.db                 # Base de datos de usuarios
│   ├── products.db              # Base de datos de productos
│   └── arreglos_victoria.db     # Base de datos principal
│
├── frontend/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── styles.css       # Hoja de estilos principal
│   │   │   └── accessibility.css# Estilos específicos para accesibilidad
│   │   ├── images/              # Imágenes del sitio
│   │   └── js/                  # Scripts JavaScript
│   │       ├── accessibility.js # Mejoras de accesibilidad
│   │       ├── admin.js         # Funcionalidades del panel de administración
│   │       ├── auth.js          # Funciones de autenticación y menú de usuario
│   │       ├── cart.js          # Funcionalidades del carrito de compras
│   │       ├── cartUtils.js     # Utilidades para el carrito de compras
│   │       ├── checkout.js      # Funcionalidades del proceso de compra
│   │       ├── errorHandler.js  # Manejo centralizado de errores
│   │       ├── home.js          # Funcionalidades de la página principal
│   │       ├── homeProducts.js  # Gestión de productos en la página de inicio
│   │       ├── imageOptimizer.js# Optimización de imágenes
│   │       ├── lazyLoad.js      # Carga diferida de imágenes
│   │       ├── mobile-menu.js   # Menú responsive para dispositivos móviles
│   │       ├── productManager.js# Gestión de productos y carrito
│   │       ├── products.js      # Funcionalidades de la página de productos
│   │       ├── profile.js       # Funcionalidades del perfil de usuario
│   │       ├── register-sw.js   # Registro del Service Worker
│   │       ├── utils.js         # Funciones de utilidad compartidas
│   │       └── wishlist.js      # Funcionalidades de la lista de deseos
│   │
│   ├── components/              # Componentes reutilizables
│   │   ├── Cart.js              # Componente del carrito
│   │   ├── ProductCard.js       # Componente de tarjeta de producto
│   │   └── Products.js          # Componente de lista de productos
│   │
│   ├── pages/                   # Páginas adicionales
│   │   └── admin.html           # Panel de administración
│   │
│   ├── index.html               # Página principal
│   ├── products.html            # Catálogo de productos
│   ├── product-detail.html      # Detalle de producto
│   ├── wishlist.html            # Lista de deseos
│   ├── profile.html             # Perfil de usuario
│   ├── checkout.html            # Proceso de compra
│   ├── login.html               # Inicio de sesión
│   ├── register.html            # Registro de usuarios
│   └── sitemap.html             # Mapa del sitio
│
├── js/                          # Scripts auxiliares
├── temp_images/                 # Imágenes temporales
└── deploy.sh                    # Script de despliegue

```

## Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js con Express
- **Base de datos**: SQLite
- **Autenticación**: JWT (JSON Web Tokens)
- **Despliegue**: Render
- **Herramientas**: Git, GitHub

## Instalación y Uso Local

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/arreglos-victoria.git
```

2. Navegar al directorio del proyecto:
```bash
cd arreglos-victoria
```

3. Iniciar el servidor backend:
```bash
cd backend
node server.js
```

4. Servir los archivos frontend (puedes usar Live Server en VSCode o cualquier servidor estático)

5. Abrir el navegador en `http://localhost:5000`

## Despliegue

El sitio web está configurado para desplegarse automáticamente en Render. Para desplegar manualmente:

```bash
./deploy.sh
```

## Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes, por favor abre un issue primero para discutir lo que te gustaría cambiar.

## Licencia

Derechos reservados © 2025 Arreglos Florales Victoria

## Contacto

- 📞 Teléfono: +569 6360 3177
- 📍 Dirección: Av. Valdivieso 593, Recoleta, Región Metropolitana
- 🌐 Sitio web: https://arreglos-victoria-backend.onrender.com
- 📧 Email: contacto@arreglosvictoria.cl

---

Desarrollado con ❤️ para Arreglos Florales Victoria
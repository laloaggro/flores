# Arquitectura y Funcionalidad Avanzada del Sitio Web de Arreglos Florales Victoria

## 1. Introducción

Este documento detalla la arquitectura técnica avanzada y el funcionamiento del sitio web de Arreglos Florales Victoria. El sitio es una aplicación web moderna construida con tecnologías frontend estándar (HTML5, CSS3, JavaScript ES6+) y se comunica con un backend API REST construido con Node.js y Express.

## 2. Arquitectura General

### 2.1 Estructura del Proyecto

```
frontend/
├── assets/
│   ├── css/           # Hojas de estilo
│   ├── js/            # Scripts JavaScript
│   └── images/        # Recursos de imagen
├── components/        # Componentes web personalizados
├── index.html         # Página principal
├── products.html      # Catálogo de productos
├── product-detail.html # Detalle de producto
├── login.html         # Autenticación de usuarios
├── register.html      # Registro de nuevos usuarios
├── profile.html       # Perfil de usuario
├── admin.html         # Panel de administración
├── admin-orders.html  # Gestión de pedidos (admin)
├── contact.html       # Formulario de contacto
├── ...
└── sw.js              # Service Worker para PWA

backend/
├── server.js          # Punto de entrada del servidor
├── routes/            # Rutas de la API
├── controllers/       # Lógica de negocio
├── models/            # Modelos de datos
├── middleware/        # Middleware de autenticación
├── database/          # Configuración de base de datos
└── ...
```

### 2.2 Tecnologías Principales

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Web Components
- **Backend**: Node.js, Express.js
- **Base de Datos**: SQLite
- **Autenticación**: JWT (JSON Web Tokens)
- **Almacenamiento Local**: localStorage para persistencia del carrito
- **API REST**: Comunicación entre frontend y backend

## 3. Componentes Web Personalizados

El sitio utiliza una arquitectura basada en componentes web personalizados para mejorar la reutilización y mantenibilidad del código.

### 3.1 Componente Header (`site-header`)

Implementado en `components/Header.js`, este componente muestra la barra de navegación principal del sitio. Incluye:

- Logo de la empresa
- Menú de navegación responsive
- Icono de carrito con contador
- Menú de usuario con opciones contextuales (perfil, pedidos, administración)

**Características avanzadas:**
- Menú hamburguesa para dispositivos móviles
- Gestión de estado de autenticación (muestra/oculta elementos según el rol del usuario)
- Actualización dinámica del contador del carrito

### 3.2 Componente Footer (`site-footer`)

Implementado en `components/Footer.js`, muestra información de contacto, enlaces importantes y redes sociales.

### 3.3 Componente ProductCard (`product-card`)

Implementado en `components/ProductCard.js`, representa visualmente un producto individual con:

- Imagen del producto
- Nombre y descripción
- Precio
- Botones de acción (Agregar al carrito, Ver detalles)

**Características avanzadas:**
- Observa cambios en el atributo `product-data` para renderizar dinámicamente
- Integración con el sistema de carrito de compras
- Manejo de errores en la carga de datos

### 3.4 Componente Products

Implementado en `components/Products.js`, gestiona la visualización de productos destacados y testimonios de clientes en la página principal.

## 4. Gestión de Estado y Datos

### 4.1 Comunicación con el Backend

La comunicación entre frontend y backend se realiza a través de una API RESTful. El punto de entrada se configura dinámicamente en `assets/js/utils.js`:

```javascript
const getApiBaseUrl = () => {
  // En producción, usar la URL del backend en Render
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://arreglos-victoria-backend.onrender.com';
  }
  
  // Detectar si se está usando Live Server (puerto 5500)
  if (typeof window !== 'undefined' && window.location.port === '5500') {
    return 'http://localhost:5000';
  }
  
  // En desarrollo normal, usar localhost con puerto 5000
  return 'http://localhost:5000';
};
```

### 4.2 Gestión del Carrito de Compras

El carrito se implementa con una combinación de:

- **Componente Cart**: Visualización del carrito en modal
- **CartUtils**: Funciones de utilidad para operaciones del carrito
- **localStorage**: Persistencia local de los datos del carrito

Los datos del carrito se almacenan en formato JSON en `localStorage` bajo la clave `cart`.

### 4.3 Sistema de Autenticación

El sistema de autenticación utiliza JWT (JSON Web Tokens) para gestionar sesiones de usuario:

1. **Login**: El usuario envía credenciales al endpoint `/api/users/login`
2. **Token**: El servidor responde con un JWT que se almacena en `localStorage`
3. **Autorización**: Las solicitudes protegidas incluyen el token en el header `Authorization`
4. **Verificación**: El servidor verifica la validez del token en cada solicitud protegida

## 5. Optimizaciones de Rendimiento

### 5.1 Carga Diferida de Imágenes

Se implementa una solución de carga diferida (lazy loading) para mejorar el tiempo de carga inicial:

```javascript
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    const srcset = img.dataset.srcset;
                    
                    if (src) img.src = src;
                    if (srcset) img.srcset = srcset;
                    
                    img.classList.remove('lazy');
                    img.classList.add('lazy-loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img.lazy');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}
```

### 5.2 Service Worker para Caché

Se implementa un Service Worker (`sw.js`) para habilitar funcionalidades PWA:

- Caché de recursos estáticos
- Estrategia de red primero, caché como respaldo
- Actualización automática de caché

### 5.3 Preload de Recursos Críticos

Se utilizan etiquetas `<link rel="preload">` para cargar anticipadamente recursos críticos:

```html
<link rel="preload" href="assets/css/styles.css" as="style">
<link rel="preload" href="assets/js/main-app.js" as="script">
```

## 6. Accesibilidad

### 6.1 Navegación por Teclado

El sitio implementa una navegación completamente accesible por teclado:

- Indicadores visuales de foco
- Atributos ARIA para estructura semántica
- Manejo adecuado de tabindex

### 6.2 Atributos ARIA

Se utilizan atributos ARIA extensivamente para mejorar la experiencia de usuarios con tecnologías asistivas:

- `role` para definir roles semánticos
- `aria-label` y `aria-labelledby` para etiquetas
- `aria-live` para contenido dinámico
- `aria-expanded` para elementos colapsables

## 7. Sistema de Temas

El sitio soporta modo claro y oscuro con persistencia de preferencias del usuario:

- CSS personalizado para cada tema
- Detección automática de preferencias del sistema
- Almacenamiento de preferencias en `localStorage`

## 8. Gestión de Productos

### 8.1 Carga Dinámica

Los productos se cargan dinámicamente desde la API con paginación:

```javascript
async loadProducts(category = null, search = null) {
    try {
        let url = `${API_BASE_URL}/api/products?page=${this.currentPage}&limit=${this.productsPerPage}`;
        
        if (category) {
            url += `&category=${encodeURIComponent(category)}`;
        }
        
        if (search) {
            url += `&search=${encodeURIComponent(search)}`;
        }
        
        const response = await fetch(url);
        // ... procesamiento de respuesta
    } catch (error) {
        // ... manejo de errores
    }
}
```

### 8.2 Filtros y Búsqueda

La página de productos incluye funcionalidades de filtrado por categoría y búsqueda textual.

## 9. Panel de Administración

El panel de administración (`admin.html`) permite a los usuarios con rol de administrador:

- Gestionar productos (crear, editar, eliminar)
- Ver y gestionar pedidos
- Administrar usuarios
- Ver estadísticas del negocio

## 10. Consideraciones de Seguridad

### 10.1 Content Security Policy (CSP)

Se implementa una política de seguridad de contenido estricta:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com https://accounts.google.com/gsi/; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self' https://accounts.google.com/gsi/;">
```

### 10.2 Protección contra Clickjacking

```html
<meta http-equiv="X-Frame-Options" content="DENY">
```

### 10.3 Protección contra Sniffing MIME

```html
<meta http-equiv="X-Content-Type-Options" content="nosniff">
```

## 11. Internacionalización y Localización

El sitio está completamente en español y utiliza formatos locales para:

- Precios en formato chileno (`$1.000`)
- Fechas en formato local
- Números con separadores de miles adecuados

## 12. Pruebas y Depuración

### 12.1 Manejo de Errores Global

Se implementa un sistema de manejo de errores global en `assets/js/errorHandler.js` para capturar y reportar errores no manejados.

### 12.2 Logging

El sistema utiliza `console.log` extensivamente para facilitar la depuración durante el desarrollo.

## 13. Despliegue y Entornos

### 13.1 Entornos

El sitio se adapta automáticamente a diferentes entornos:

- **Desarrollo local**: `http://localhost:5000`
- **Live Server**: `http://localhost:5500` (redirige a backend en puerto 5000)
- **Producción**: `https://arreglos-victoria-backend.onrender.com`

### 13.2 Estrategia de Caché

Se implementa una estrategia de caché en el Service Worker para mejorar el rendimiento y permitir el funcionamiento offline parcial.

## 14. Futuras Mejoras

1. **Migración a Framework**: Considerar migrar a React o Vue para una mejor gestión del estado
2. **Sistema de Estado Global**: Implementar Redux o Context API para manejar el estado global
3. **Pruebas Automatizadas**: Agregar pruebas unitarias y de integración
4. **Mejoras de SEO**: Implementar más estructuras de datos Schema.org
5. **Notificaciones Push**: Implementar Web Push API para notificaciones
6. **Mejoras de Rendimiento**: Implementar Code Splitting y optimización de imágenes
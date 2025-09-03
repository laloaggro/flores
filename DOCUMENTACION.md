# Documentación del Proyecto - Arreglos Victoria Florería

## Descripción del Proyecto

Este proyecto es una tienda en línea para una florería llamada "Arreglos Victoria". Permite a los usuarios navegar por productos, agregar artículos al carrito, realizar pedidos y gestionar su cuenta. También incluye un panel de administración para gestionar productos y pedidos.

## Estructura del Proyecto

```
flores-1/
├── backend/                 # Código del servidor
│   ├── routes/              # Rutas de la API
│   ├── middleware/          # Middleware de Express
│   ├── utils/               # Utilidades del backend
│   ├── config/              # Configuración del backend
│   └── ...
├── frontend/                # Código del cliente original
│   ├── assets/              # Recursos estáticos (CSS, JS, imágenes)
│   │   ├── css/             # Hojas de estilo (incluyendo combined.css)
│   │   ├── js/              # Código JavaScript
│   │   │   ├── components/  # Componentes JavaScript
│   │   │   │   ├── auth/    # Componentes de autenticación
│   │   │   │   ├── cart/    # Componentes del carrito
│   │   │   │   ├── product/ # Componentes de productos
│   │   │   │   ├── ui/      # Componentes de interfaz de usuario
│   │   │   │   └── utils/   # Utilidades
│   │   │   └── main.js      # Punto de entrada principal
│   │   └── images/          # Imágenes del sitio
│   ├── components/          # Componentes web personalizados
│   ├── pages/               # Páginas HTML
│   └── ...
├── dev/                     # Entorno de desarrollo
│   ├── assets/              # Recursos para desarrollo
│   ├── components/          # Componentes para desarrollo
│   ├── pages/               # Páginas HTML para desarrollo
│   └── dev-config.json      # Configuración de desarrollo
├── prod/                    # Entorno de producción
│   ├── assets/              # Recursos para producción
│   ├── components/          # Componentes para producción
│   ├── pages/               # Páginas HTML para producción
│   └── prod-config.json     # Configuración de producción
├── dist/                    # Archivos compilados para producción
├── docs/                    # Documentación adicional del proyecto
├── backup/                  # Componentes y archivos en backup
│   ├── components/          # Componentes no utilizados
│   └── COMPONENTES_BACKUP.md # Registro de componentes en backup
├── scripts/                 # Scripts de utilidad
├── tests/                   # Pruebas del sistema
└── jest.config.js           # Configuración de Jest
```

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
- SQLite (con sqlite3)

### Herramientas de Desarrollo
- Git para control de versiones
- npm para gestión de paquetes
- ESLint y Prettier para linting y formateo
- Jest para pruebas unitarias

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone <url-del-repositorio>
   ```

2. Navegar al directorio del proyecto:
   ```bash
   cd flores-1
   ```

3. Instalar dependencias:
   ```bash
   npm install
   ```

4. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   # Editar .env con las configuraciones apropiadas
   ```

## Desarrollo

### Flujo de trabajo de desarrollo y producción

El proyecto utiliza entornos separados para desarrollo y producción:

1. **Desarrollo**: Trabajar en el directorio `dev/`
2. **Producción**: Promocionar cambios al directorio `prod/` cuando estén listos
3. **Empaquetado**: Generar la versión final en el directorio `dist/`

### Iniciar servidor de desarrollo
```bash
node scripts/start-dev-env.js
```

Esto iniciará el servidor de desarrollo en el puerto 3000.

### Scripts disponibles
- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye el proyecto para producción
- `npm run build:components` - Construye los componentes para producción
- `npm run preview` - Previsualiza la construcción de producción
- `npm test` - Ejecuta las pruebas
- `npm test:watch` - Ejecuta las pruebas en modo observador
- `npm test:coverage` - Ejecuta las pruebas y genera reporte de cobertura
- `npm run lint` - Verifica el código con ESLint

## Optimizaciones implementadas

### 1. Combinación de archivos CSS
Se ha implementado un script para combinar todos los archivos CSS en un solo archivo `combined.css` para reducir el número de solicitudes HTTP y mejorar el rendimiento.

### 2. Carga diferida de imágenes (Lazy Loading)
Se ha implementado lazy loading para imágenes utilizando IntersectionObserver para cargar solo las imágenes que están cerca de la ventana gráfica.

### 3. Configuración de seguridad mejorada
Se ha añadido una configuración de seguridad específica por entorno con:
- Configuración de CORS más segura
- Rate limiting para prevenir abusos
- Política de seguridad de contenido (CSP)

### 4. Sistema de pruebas
Se ha implementado un sistema de pruebas con Jest para validar el comportamiento de los componentes.

### 5. Autenticación con Google
Se ha añadido un componente para autenticación con Google utilizando la API de Google Identity Services.

### 6. Manejo de errores mejorado
Se ha implementado un sistema de manejo de errores global para proporcionar una mejor experiencia de usuario.

## Componentes Principales

### Componentes Web

1. **Header** - Encabezado con navegación, carrito y menú de usuario
2. **Footer** - Pie de página con información de contacto
3. **ProductCard** - Tarjetas de productos con información, precios y acciones
4. **CartItem** - Elementos del carrito de compras
5. **Testimonials** - Componente de testimonios
6. **GoogleAuth** - Componente para autenticación con Google

### Sistema de Carrito

El carrito de compras está implementado con JavaScript y utiliza localStorage para persistencia de datos en el cliente. Permite:
- Agregar productos
- Modificar cantidades
- Guardar productos para más tarde
- Eliminar productos

### Sistema de Usuarios

El sistema de autenticación permite:
- Registro de nuevos usuarios
- Inicio de sesión
- Inicio de sesión con Google
- Perfiles de usuario
- Historial de pedidos

## API Endpoints

### Productos
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener un producto específico
- `GET /api/products/categories` - Obtener todas las categorías
- `GET /api/products/popular` - Obtener productos populares

### Usuarios
- `POST /api/users/register` - Registrar un nuevo usuario
- `POST /api/users/login` - Iniciar sesión
- `POST /api/users/google-login` - Iniciar sesión con Google
- `GET /api/users/profile` - Obtener perfil de usuario
- `PUT /api/users/profile` - Actualizar perfil de usuario

### Contacto
- `POST /api/contact` - Enviar mensaje de contacto

## Mejores Prácticas Implementadas

1. **Rutas absolutas**: Se utilizan rutas absolutas en lugar de relativas para evitar problemas de navegación
2. **Separación de entornos**: Desarrollo y producción están claramente separados
3. **Componentes reutilizables**: Se utilizan Web Components para una mejor reutilización de código
4. **SEO optimizado**: Meta etiquetas y estructura semántica adecuada
5. **Accesibilidad**: Atributos ARIA y navegación por teclado
6. **Seguridad**: Headers de seguridad y CSP configurados
7. **Rendimiento**: Combinación de CSS, lazy loading de imágenes
8. **Pruebas**: Sistema de pruebas con Jest
9. **Manejo de errores**: Sistema de manejo de errores global

## Problemas Conocidos

1. Algunas rutas relativas aún existen en ciertos archivos y deben corregirse
2. El sistema de pruebas no está completamente implementado
3. La documentación está dispersa en varios archivos

## Próximas Mejoras

1. Implementar más pruebas unitarias y E2E
2. Mejorar el sistema de logging
3. Implementar recuperación de contraseña
4. Añadir más métricas de análisis
5. Optimizar aún más el rendimiento del frontend
6. Implementar un sistema de estado global
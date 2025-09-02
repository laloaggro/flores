# Arreglos Victoria Florería

Sitio web de una florería familiar con más de 20 años de experiencia en Recoleta.

## Estructura del Proyecto

```
frontend/
├── assets/
│   ├── css/
│   │   ├── styles.css          # Estilos principales
│   │   ├── index.css           # Estilos específicos de la página de inicio
│   │   ├── consistent-theme.css # Sistema de temas unificado
│   │   └── theme.css           # Variables de tema (obsoleto)
│   ├── images/                 # Imágenes del sitio
│   │   ├── products/           # Imágenes de productos
│   │   ├── categories/         # Imágenes de categorías
│   │   └── ...                 # Otras imágenes
│   └── js/                     # Scripts JavaScript
│       ├── utils.js            # Funciones de utilidad
│       ├── theme.js            # Manejo de temas claro/oscuro
│       ├── cart.js             # Funcionalidad del carrito
│       ├── contact.js          # Manejo del formulario de contacto
│       ├── userMenu.js         # Manejo del menú de usuario
│       ├── lazyLoad.js         # Carga diferida de imágenes
│       └── ...                 # Otros scripts auxiliares
├── components/                 # Componentes web reutilizables
│   ├── header/                 # Componentes del encabezado
│   │   ├── Header.js           # Componente de encabezado principal
│   │   └── Footer.js           # Componente de pie de página
│   ├── product/                # Componentes relacionados con productos
│   │   ├── Products.js         # Componente de lista de productos
│   │   ├── ProductCard.js      # Componente de tarjeta de producto
│   │   └── styles.css          # Estilos de componentes de productos
│   ├── cart/                   # Componentes del carrito
│   │   └── CartItem.js         # Componente de ítem del carrito
│   └── Testimonials.js         # Componente de testimonios
├── pages/                      # Páginas adicionales
│   └── admin/                  # Páginas del panel de administración
├── __tests__/                  # Pruebas unitarias
├── dist/                       # Archivos compilados (si se usa un proceso de compilación)
└── documentacion/             # Documentación adicional

backend/
├── routes/                     # Rutas de la API
├── controllers/                # Controladores de la lógica de negocio
├── models/                     # Modelos de datos
├── middleware/                 # Middleware de la aplicación
├── database/                   # Archivos de configuración de base de datos
├── utils/                      # Funciones de utilidad del backend
└── tests/                      # Pruebas del backend
```

## Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Web Components
- **Backend**: Node.js, Express.js
- **Base de Datos**: SQLite
- **Autenticación**: JWT (JSON Web Tokens)
- **Pruebas**: Jest (unitarias), Cypress (E2E)
- **Herramientas de Desarrollo**: ESLint, Prettier

## Características Principales

1. **Sistema de Temas**: Modo claro y oscuro con persistencia de preferencias
2. **Carrito de Compras**: Funcionalidad completa de carrito con almacenamiento local
3. **Gestión de Productos**: Visualización, filtrado y búsqueda de productos
4. **Sistema de Usuarios**: Registro, inicio de sesión y perfiles de usuario
5. **Formulario de Contacto**: Envío de mensajes con validación
6. **Responsive Design**: Diseño adaptable a diferentes dispositivos
7. **Accesibilidad**: Cumplimiento de estándares WCAG

## Instalación y Configuración

1. **Instalar dependencias del backend**:
   ```bash
   cd backend
   npm install
   ```

2. **Configurar variables de entorno**:
   Crear un archivo `.env` en el directorio backend con las siguientes variables:
   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret_here
   SMTP_HOST=smtp.yourprovider.com
   SMTP_PORT=587
   SMTP_USERNAME=your_email@yourprovider.com
   SMTP_PASSWORD=your_email_password
   ```

3. **Iniciar el servidor**:
   ```bash
   npm start
   ```

4. **Acceder al sitio**:
   Abrir `http://localhost:5000` en el navegador

## Archivos Importantes

- `frontend/index.html`: Página de inicio
- `frontend/products.html`: Página de productos
- `frontend/contact.html`: Página de contacto
- `frontend/login.html`: Página de inicio de sesión
- `frontend/register.html`: Página de registro
- `frontend/cart.html`: Página del carrito de compras
- `backend/server.js`: Punto de entrada del servidor
- `backend/routes/products.js`: Rutas de la API de productos

## Mantenimiento

### Limpieza de Archivos

El directorio `frontend/assets/js/` contiene muchos archivos que parecen ser dependencias de terceros. Estos pueden ser limpiados para mantener una estructura más clara:

1. Identificar scripts realmente utilizados en el proyecto
2. Eliminar bibliotecas de terceros no utilizadas
3. Consolidar scripts auxiliares en archivos específicos por funcionalidad

### Mejora Continua

1. **Optimización de Rendimiento**:
   - Implementar carga diferida de imágenes
   - Minimizar y combinar archivos CSS/JS
   - Utilizar compresión GZIP

2. **SEO y Accesibilidad**:
   - Verificar metadatos de todas las páginas
   - Asegurar etiquetas semánticas HTML
   - Implementar atributos ARIA

3. **Seguridad**:
   - Validar y sanitizar entradas de usuario
   - Implementar protección CSRF
   - Asegurar almacenamiento de contraseñas

## Documentación Adicional

- [Sistema de Temas](FRONTEND_THEME.md): Documentación detallada del sistema de temas claro/oscuro
- Documentación de la API: Pendiente de crear
- Guía de contribución: Pendiente de crear
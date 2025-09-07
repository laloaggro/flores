# Guía para Probar el Sitio Web

## Descripción

Este documento proporciona instrucciones detalladas sobre cómo probar el sitio web de Arreglos Victoria Florería después de las optimizaciones realizadas.

## Estado Actual del Proyecto

### Estructura del Proyecto
```
flores-1/
├── backend/                 # Código del servidor (Node.js/Express)
├── config/                  # Archivos de configuración
├── dev/                     # Entorno de desarrollo
├── dist/                    # Archivos compilados para producción
├── docs/                    # Documentación del proyecto
├── frontend/                # Código del cliente
│   ├── assets/              # Recursos (CSS, JS, imágenes)
│   ├── components/          # Componentes web
│   ├── pages/               # Páginas HTML
│   └── index.html           # Página principal
├── prod/                    # Entorno de producción
├── scripts/                 # Scripts de automatización
├── temp/                    # Archivos temporales
├── tests/                   # Pruebas del proyecto
├── utils/                   # Utilidades y herramientas
├── node_modules/            # Dependencias de Node.js
└── README.md                # Documentación principal
```

### Tecnologías Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Web Components
- **Backend**: Node.js, Express
- **Herramientas de Construcción**: Vite
- **Gestión de Dependencias**: npm

## Métodos para Probar el Sitio Web

### 1. Usar un Servidor HTTP Local

#### Método 1: Python HTTP Server
```bash
# Navegar al directorio frontend
cd /home/laloaggro/Proyectos/flores-1/frontend

# Iniciar servidor HTTP en el puerto 3000
python3 -m http.server 3000
```

Si el puerto 3000 está ocupado, usar otro puerto:
```bash
python3 -m http.server 3001
```

#### Método 2: Node.js HTTP Server
```bash
# Instalar http-server globalmente (si no está instalado)
npm install -g http-server

# Navegar al directorio frontend
cd /home/laloaggro/Proyectos/flores-1/frontend

# Iniciar servidor HTTP
http-server -p 3000
```

### 2. Usar Vite para Desarrollo

#### Iniciar el entorno de desarrollo con Vite
```bash
# Navegar al directorio raíz del proyecto
cd /home/laloaggro/Proyectos/flores-1

# Iniciar Vite con la configuración existente
npx vite --config config/vite.config.js
```

#### Iniciar con configuración simple
```bash
# Usar la configuración simple creada
npx vite --config vite.simple.config.js
```

### 3. Usar el Script Personalizado

#### Ejecutar el script de prueba personalizado
```bash
# Navegar al directorio raíz del proyecto
cd /home/laloaggro/Proyectos/flores-1

# Ejecutar el script de prueba (usa el puerto 3001)
node scripts/test-website.js
```

## Páginas Principales para Probar

1. **Página Principal**: `index.html`
2. **Productos**: `pages/products.html`
3. **Detalle de Producto**: `pages/product-detail.html`
4. **Carrito**: `pages/cart.html`
5. **Checkout**: `pages/checkout.html`
6. **Login/Registro**: `pages/login.html`, `pages/register.html`
7. **Perfil de Usuario**: `pages/profile.html`
8. **Administración**: `pages/admin.html`, `pages/admin-orders.html`

## Verificación de Recursos

### Archivos CSS
- `assets/css/styles.css`
- `assets/css/index.css`

### Archivos JavaScript
- `assets/js/main.js`
- Componentes en `assets/js/components/`

### Imágenes y Recursos
- `assets/images/`
- `assets/fonts/`

## Funcionalidades Clave a Probar

### 1. Navegación
- Verificar que todos los enlaces funcionen correctamente
- Comprobar la navegación entre páginas
- Verificar el menú responsive

### 2. Componentes Web
- Header y Footer
- Product Cards
- Carrito de compras
- Testimonios

### 3. Formularios
- Formulario de contacto
- Formulario de login/registro
- Formulario de checkout

### 4. Funcionalidades JavaScript
- Cambio de tema (claro/oscuro)
- Carga diferida de imágenes
- Menú de usuario
- Gestión del carrito

## Solución de Problemas Comunes

### 1. Errores de Rutas
- Verificar que todas las rutas a recursos sean relativas
- Comprobar que los archivos referenciados existan

### 2. Problemas con Vite
- Asegurarse de que todas las dependencias estén instaladas
- Verificar la configuración de Vite
- Comprobar alias y rutas de resolución

### 3. Errores de JavaScript
- Verificar la consola del navegador para errores
- Comprobar que todos los módulos se carguen correctamente
- Asegurarse de que los componentes personalizados estén registrados

## Pruebas Específicas

### 1. Prueba de Carga
- Verificar tiempos de carga de páginas
- Comprobar optimización de imágenes
- Verificar carga diferida de recursos

### 2. Prueba de Responsividad
- Verificar diseño en diferentes tamaños de pantalla
- Comprobar comportamiento en dispositivos móviles
- Verificar adaptación de componentes

### 3. Prueba de Funcionalidades
- Verificar todas las interacciones de usuario
- Comprobar formularios y validaciones
- Verificar gestión del carrito de compras

## Verificación del Backend

### 1. APIs
- Verificar endpoints de productos
- Comprobar autenticación de usuarios
- Verificar gestión de pedidos

### 2. Base de Datos
- Comprobar conexión a MongoDB
- Verificar operaciones CRUD

## Documentación Relacionada

- [PROJECT_MASTER_GUIDE.md](file:///home/laloaggro/Proyectos/flores-1/docs/PROJECT_MASTER_GUIDE.md): Documento maestro del proyecto
- [ADMIN_GUIDE.md](file:///home/laloaggro/Proyectos/flores-1/docs/ADMIN_GUIDE.md): Guía de administración
- [DEVELOPMENT_GUIDE.md](file:///home/laloaggro/Proyectos/flores-1/docs/DEVELOPMENT_GUIDE.md): Guía de desarrollo
- [API_DOCUMENTATION.md](file:///home/laloaggro/Proyectos/flores-1/docs/API_DOCUMENTATION.md): Documentación de APIs
- [TESTING.md](file:///home/laloaggro/Proyectos/flores-1/docs/TESTING.md): Guía de pruebas

## Siguientes Pasos

1. **Prueba Local**: Ejecutar el sitio web localmente usando uno de los métodos descritos
2. **Verificación de Funcionalidades**: Probar todas las funcionalidades clave
3. **Prueba de Rendimiento**: Verificar tiempos de carga y optimización
4. **Prueba de Compatibilidad**: Verificar funcionamiento en diferentes navegadores
5. **Prueba de Seguridad**: Verificar prácticas de seguridad implementadas

## Contacto

Para cualquier problema o pregunta sobre la prueba del sitio web, contactar al equipo de desarrollo.
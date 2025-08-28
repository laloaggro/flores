# Arreglos Florales Victoria 🌹

Tienda online de arreglos florales.

## Descripción

Este proyecto es una tienda en línea para la venta de arreglos florales. Incluye funcionalidades como catálogo de productos, carrito de compras, gestión de usuarios, panel de administración y más.

## Estructura del Proyecto

```
arreglos-victoria/
├── backend/          # Servidor y API
├── frontend/         # Cliente web
│   ├── assets/       # Recursos estáticos
│   ├── components/   # Componentes web reutilizables
│   └── ...           # Páginas HTML
├── build-simple.js   # Script de construcción
└── package.json      # Configuración del proyecto
```

## Instalación

1. Clonar el repositorio:
   ```
   git clone <repositorio-url>
   ```

2. Instalar dependencias:
   ```
   npm install
   ```

## Desarrollo

### Iniciar servidor de desarrollo:
```
npm run dev
```

### Construir para producción:
```
npm run build
```

Esto generará archivos optimizados en el directorio `frontend/dist/`.

## Estructura de Archivos Frontend

- `assets/css/` - Hojas de estilo
- `assets/js/` - Scripts JavaScript
- `components/` - Componentes web reutilizables
- `dist/` - Archivos construidos para producción

## Arquitectura del Frontend

Para información detallada sobre la arquitectura del frontend, consulte [FRONTEND_ARCHITECTURE.md](FRONTEND_ARCHITECTURE.md).

## Convenciones de Código

- Usar indentación de 4 espacios
- Seguir el estilo de código definido en `.eslintrc.json`
- Mantener funciones y variables con nombres descriptivos en inglés
- Comentar código cuando sea necesario para entender la lógica compleja

## Despliegue

1. Construir el proyecto:
   ```
   npm run build
   ```

2. Subir los archivos del directorio `frontend/` al servidor de producción.

## Mantenimiento

### Actualizar dependencias:
```
npm update
```

### Verificar problemas de código:
```
npx eslint frontend/assets/js/
```

## Contribución

1. Crear una rama para la nueva funcionalidad:
   ```
   git checkout -b feature/nueva-funcionalidad
   ```

2. Hacer commits descriptivos:
   ```
   git commit -m "Añadir: nueva funcionalidad para ..."
   ```

3. Hacer push de la rama y crear un Pull Request

## Licencia

MIT
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

### ✅ Optimizaciones Técnicas

- **Rendimiento**: Optimización de carga de imágenes y recursos
- **SEO**: Meta etiquetas y estructura semántica para mejor posicionamiento
- **Responsive**: Diseño adaptable a diferentes tamaños de pantalla
- **Manejo de errores**: Sistema centralizado de manejo de errores

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
│   │   │   └── styles.css       # Hoja de estilos principal
│   │   ├── images/              # Imágenes del sitio
│   │   └── js/                  # Scripts JavaScript
│   │       ├── admin.js         # Funcionalidades del panel de administración
│   │       ├── auth.js          # Funciones de autenticación y menú de usuario
│   │       ├── checkout.js      # Funcionalidades del proceso de compra
│   │       ├── errorHandler.js  # Manejo centralizado de errores
│   │       ├── home.js          # Funcionalidades de la página principal
│   │       ├── mobile-menu.js   # Menú responsive para dispositivos móviles
│   │       ├── productManager.js# Gestión de productos y carrito
│   │       ├── products.js      # Funcionalidades de la página de productos
│   │       ├── profile.js       # Funcionalidades del perfil de usuario
│   │       ├── utils.js         # Funciones de utilidad compartidas
│   │       └── wishlist.js      # Funcionalidades de la lista de deseos
│   │
│   ├── components/              # Componentes reutilizables
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

## Uso del Sitio Web

### Para Usuarios

1. **Navegación de productos**: 
   - Visita la página principal para ver productos destacados
   - Navega a "Productos" para ver el catálogo completo
   - Usa los filtros por categoría, búsqueda y ordenamiento para encontrar productos específicos

2. **Autenticación**:
   - Regístrate en la página de registro con tus datos
   - Inicia sesión con tu email y contraseña
   - Una vez autenticado, podrás acceder a tu perfil, lista de deseos y carrito de compras

3. **Carrito de compras**:
   - Agrega productos al carrito desde la página de productos o detalle de producto
   - Accede al carrito para ver los productos agregados
   - Procede al checkout para finalizar tu compra

4. **Lista de deseos**:
   - Guarda productos en tu lista de deseos para recordarlos
   - Accede a tu lista de deseos desde el menú de usuario

5. **Perfil de usuario**:
   - Edita tu información personal
   - Revisa tu historial de compras (simulado)

### Para Administradores

1. **Acceso al panel de administración**:
   - Inicia sesión con credenciales de administrador
   - Accede al panel de administración desde el menú de usuario

2. **Gestión de productos**:
   - Agrega nuevos productos con nombre, descripción, precio, categoría e imagen
   - Edita productos existentes
   - Elimina productos del catálogo

3. **Gestión de usuarios**:
   - Visualiza la lista de usuarios registrados
   - Edita información de usuarios
   - Elimina usuarios (excepto administradores)

4. **Gestión de reseñas**:
   - Visualiza todas las reseñas de productos
   - Elimina reseñas inapropiadas

## Instalación y Configuración

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/arreglos-victoria.git
```

2. Navegar al directorio del proyecto:
```bash
cd arreglos-victoria
```

3. Instalar dependencias del backend:
```bash
cd backend
npm install
```

4. Iniciar el servidor de desarrollo:
```bash
npm start
```

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
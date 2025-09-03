# Arreglos Victoria Florería

Florería en línea con catálogo de productos, carrito de compras y panel de administración.

## Descripción

Este proyecto es una tienda en línea para una florería llamada "Arreglos Victoria". Permite a los usuarios navegar por productos, agregar artículos al carrito, realizar pedidos y gestionar su cuenta. También incluye un panel de administración para gestionar productos y pedidos.

**Para una documentación completa del proyecto, consulte [DOCUMENTACION.md](DOCUMENTACION.md).**

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
- MongoDB (con Mongoose)

### Herramientas de Desarrollo
- Git para control de versiones
- npm para gestión de paquetes
- ESLint y Prettier para linting y formateo
- Jest para pruebas unitarias

## Estructura del Proyecto

```
flores-1/
├── backend/                 # Código del servidor
├── frontend/                # Código del cliente original
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
├── docs/                    # Documentación del proyecto
└── scripts/                 # Scripts de utilidad
```

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

Para más detalles sobre este flujo de trabajo, consulte [DOCUMENTACION.md](DOCUMENTACION.md).

### Iniciar servidor de desarrollo
```bash
node scripts/start-dev-env.js
```

Esto iniciará el servidor de desarrollo en el puerto 3000.

### Scripts disponibles
- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye el proyecto para producción
- `npm run preview` - Previsualiza la construcción de producción
- `npm test` - Ejecuta las pruebas
- `npm run lint` - Verifica el código con ESLint

## Componentes Principales

### Componentes Web
1. **Header** - Barra de navegación principal
2. **Footer** - Pie de página
3. **ProductCard** - Tarjeta de producto
4. **Products** - Lista de productos
5. **CartItem** - Elemento del carrito de compras
6. **Testimonials** - Sección de testimonios

### Páginas Principales
- Inicio (index.html)
- Productos (products.html)
- Detalle de producto (product-detail.html)
- Carrito (cart.html)
- Checkout (checkout.html)
- Login/Registro (login.html, register.html)
- Perfil de usuario (profile.html)
- Panel de administración (admin.html)

## Funcionalidades Clave

### Para Usuarios
- Navegación por productos
- Agregar productos al carrito
- Realizar pedidos
- Gestión de cuenta de usuario
- Lista de deseos
- Historial de pedidos

### Para Administradores
- Gestión de productos
- Gestión de pedidos
- Panel de administración

## Empaquetado para Producción

Para crear una versión optimizada del sitio para producción:

```bash
npm run build
```

Este comando genera una versión optimizada del sitio en el directorio `dist/`.

## Despliegue

Los archivos del directorio `dist/` pueden ser desplegados en cualquier servidor web estático.

## Pruebas

Para ejecutar las pruebas unitarias:

```bash
npm test
```

## Contribuciones

1. Crear una rama específica para la funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
2. Realizar los cambios necesarios
3. Asegurarse de que las pruebas pasen
4. Crear un commit con un mensaje descriptivo (`git commit -m 'Añadir nueva funcionalidad'`)
5. Subir la rama (`git push origin feature/nueva-funcionalidad`)
6. Crear un pull request para revisión

## Licencia

[Incluir información de licencia si aplica]

## Contacto

Para preguntas o soporte, contactar al equipo de desarrollo.
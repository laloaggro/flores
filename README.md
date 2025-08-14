# Arreglos Victoria Florería

Sitio web de una florería que permite a los clientes navegar por productos, agregarlos al carrito y realizar pedidos. Incluye un panel de administración para gestionar productos, pedidos y usuarios.

## Estructura del proyecto

```
.
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── .env.example
│   ├── server.js
│   └── ...
├── frontend/
│   ├── assets/
│   │   ├── css/
│   │   ├── images/
│   │   └── js/
│   ├── components/
│   ├── pages/
│   │   └── admin.html
│   ├── index.html
│   ├── products.html
│   ├── login.html
│   ├── profile.html
│   └── ...
└── README.md
```

## Características

- Catálogo de productos con imágenes y descripciones
- Sistema de carrito de compras persistente
- Registro e inicio de sesión de usuarios
- Panel de administración para gestionar:
  - Productos
  - Pedidos
  - Usuarios
- Filtros y búsqueda de productos
- Diseño responsive
- Integración con pasarelas de pago (pendiente de implementación)

## Tecnologías utilizadas

- Frontend: HTML5, CSS3, JavaScript (ES6+)
- Backend: Node.js, Express.js
- Base de datos: SQLite
- Autenticación: JWT
- Almacenamiento: localStorage para el carrito

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
```

2. Instalar dependencias del backend:
```bash
cd backend
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar el archivo .env con tus configuraciones
```

4. Iniciar el servidor en modo desarrollo:
```bash
npm run dev
```

5. Acceder a la aplicación en `http://localhost:5000`

## Mejoras implementadas

### Sistema de carrito de compras
- Persistencia del carrito usando localStorage
- Interfaz mejorada con indicadores visuales
- Validaciones y manejo de errores

### Panel de administración
- Página dedicada para administradores
- Gestión de productos, pedidos y usuarios
- Estadísticas del negocio

### Funcionalidad de productos
- Filtros por categoría
- Búsqueda de productos
- Paginación mejorada

### Seguridad
- Verificación de roles de usuario
- Protección de rutas administrativas
- Manejo seguro de tokens JWT

## Solución de problemas comunes

### Problemas de carga de productos
- Verifica que el servidor esté corriendo
- Confirma que la base de datos de productos exista y tenga datos

### Problemas de autenticación
- Asegúrate de que las variables de entorno estén correctamente configuradas
- Verifica que el secreto JWT sea lo suficientemente seguro

### Problemas con el carrito
- Confirma que el navegador permita el uso de localStorage
- Verifica la consola del navegador en busca de errores

## Desarrollo

Para iniciar el servidor en modo desarrollo:
```bash
cd backend
npm run dev
```

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir qué te gustaría cambiar.

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Realiza tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

ISC
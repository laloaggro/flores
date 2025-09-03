# Entorno de Desarrollo - Arreglos Victoria Florería

## Descripción

Este documento describe cómo iniciar y usar el entorno de desarrollo completo para el sitio web de Arreglos Victoria Florería.

## Servicios en ejecución

1. **Frontend**: http://localhost:3006
2. **Backend**: http://localhost:5000

## Iniciar el entorno de desarrollo

### Opción 1: Iniciar servicios manualmente (Recomendado)

#### 1. Iniciar el backend

En una terminal, ejecuta:
```bash
cd /home/laloaggro/Proyectos/flores-1/backend
node server.js
```

El backend se ejecutará en el puerto 5000.

#### 2. Iniciar el frontend

En otra terminal, ejecuta:
```bash
cd /home/laloaggro/Proyectos/flores-1
node start-frontend.js
```

El frontend se ejecutará en el puerto 3006.

### Opción 2: Iniciar entorno limpio (Experimental)

Puedes intentar usar el script automatizado:
```bash
cd /home/laloaggro/Proyectos/flores-1
node start-dev-env-clean.js
```

**Nota**: Este método puede tener problemas con procesos residuales.

## Verificar el funcionamiento

### Manualmente

1. **Frontend - Página principal**: Abre tu navegador y visita http://localhost:3006
2. **Frontend - Página de productos**: http://localhost:3006/products.html
3. **Frontend - Página de contacto**: http://localhost:3006/contact.html
4. **Backend API de productos**: 
   ```bash
   curl http://localhost:5000/api/products
   ```

## Estructura de directorios

```
/home/laloaggro/Proyectos/flores-1/
├── dev/                 # Código fuente del frontend
├── backend/             # Código fuente del backend
├── start-frontend.js    # Script para iniciar el frontend
├── README_DEV.md        # Este documento
└── ...
```

## Características del entorno

### Frontend
- Servidor HTTP personalizado
- Carga de archivos estáticos (HTML, CSS, JS, imágenes)
- Tipos MIME correctos para todos los archivos
- Manejo de rutas en directorio raíz y en subdirectorio pages/
- Páginas accesibles:
  - Página principal: http://localhost:3006/
  - Productos: http://localhost:3006/products.html
  - Contacto: http://localhost:3006/contact.html
  - Carrito: http://localhost:3006/cart.html

### Backend
- Servidor Express.js
- API RESTful
- Base de datos SQLite
- Autenticación JWT
- APIs disponibles:
  - Productos: http://localhost:5000/api/products
  - Usuarios: http://localhost:5000/api/users
  - Carrito: http://localhost:5000/api/cart
  - Lista de deseos: http://localhost:5000/api/wishlist

## Correcciones realizadas

### Problemas de rutas solucionados

1. **Archivo index.html faltante en directorio pages**:
   - Se copió el archivo [index.html](file:///home/laloaggro/Proyectos/flores-1/dist/index.html) del directorio raíz al directorio `pages/`
   - Esto soluciona el error "No se puede encontrar /pages/index.html en este servidor"

2. **Manejo de rutas en el servidor frontend**:
   - El servidor ahora verifica si un archivo existe en el directorio raíz
   - Si no existe, busca en el subdirectorio `pages/`
   - Si tampoco existe, devuelve el [index.html](file:///home/laloaggro/Proyectos/flores-1/dist/index.html) principal (para SPA)

3. **Verificación de rutas**:
   - Se verificó que todas las páginas HTML sean accesibles tanto desde rutas directas como desde el subdirectorio `pages/`
   - Se confirmó que no hay enlaces incorrectos en el código que apunten a rutas inexistentes

## Solución de problemas

### Backend no inicia
Si el backend no inicia, verifica:
1. Que no haya otro proceso usando el puerto 5000:
   ```bash
   lsof -i :5000
   ```
2. Si hay procesos, deténlos:
   ```bash
   pkill -f "5000"
   ```

### Frontend no inicia
Si el frontend no inicia, verifica:
1. Que no haya otro proceso usando el puerto 3006:
   ```bash
   lsof -i :3006
   ```
2. Si hay procesos, deténlos:
   ```bash
   pkill -f "3006"
   ```

## Detener los servicios

Para detener los servicios, presiona `Ctrl+C` en cada terminal donde se estén ejecutando.

Alternativamente, puedes usar:
```bash
cd /home/laloaggro/Proyectos/flores-1
node stop-dev-env.js
```

## Desarrollo

### Frontend
Los archivos del frontend se encuentran en el directorio `dev/`. Puedes modificar estos archivos directamente y los cambios se reflejarán inmediatamente al recargar la página en el navegador.

El servidor frontend maneja correctamente las rutas tanto para archivos en el directorio raíz como en el subdirectorio `pages/`.

### Backend
Los archivos del backend se encuentran en el directorio `backend/`. Para que los cambios surtan efecto, necesitas reiniciar el servidor backend.

## APIs disponibles

### Productos
- `GET /api/products` - Obtener lista de productos
- `GET /api/products/:id` - Obtener un producto específico

### Usuarios
- `POST /api/users/register` - Registrar un nuevo usuario
- `POST /api/users/login` - Iniciar sesión
- `GET /api/users/profile` - Obtener perfil de usuario (requiere autenticación)

### Carrito
- `GET /api/cart` - Obtener carrito del usuario (requiere autenticación)
- `POST /api/cart` - Agregar producto al carrito (requiere autenticación)
- `DELETE /api/cart/:id` - Eliminar producto del carrito (requiere autenticación)

### Lista de deseos
- `GET /api/wishlist` - Obtener lista de deseos del usuario (requiere autenticación)
- `POST /api/wishlist` - Agregar producto a la lista de deseos (requiere autenticación)
- `DELETE /api/wishlist/:id` - Eliminar producto de la lista de deseos (requiere autenticación)

## Desarrollo

### Frontend
Los archivos del frontend se encuentran en el directorio `dev/`. Puedes modificar estos archivos directamente y los cambios se reflejarán inmediatamente al recargar la página en el navegador.

El servidor frontend maneja correctamente las rutas tanto para archivos en el directorio raíz como en el subdirectorio `pages/`.

### Backend
Los archivos del backend se encuentran en el directorio `backend/`. Para que los cambios surtan efecto, necesitas reiniciar el servidor backend.

## APIs disponibles

### Productos
- `GET /api/products` - Obtener lista de productos
- `GET /api/products/:id` - Obtener un producto específico

### Usuarios
- `POST /api/users/register` - Registrar un nuevo usuario
- `POST /api/users/login` - Iniciar sesión
- `GET /api/users/profile` - Obtener perfil de usuario (requiere autenticación)

### Carrito
- `GET /api/cart` - Obtener carrito del usuario (requiere autenticación)
- `POST /api/cart` - Agregar producto al carrito (requiere autenticación)
- `DELETE /api/cart/:id` - Eliminar producto del carrito (requiere autenticación)

### Lista de deseos
- `GET /api/wishlist` - Obtener lista de deseos del usuario (requiere autenticación)
- `POST /api/wishlist` - Agregar producto a la lista de deseos (requiere autenticación)
- `DELETE /api/wishlist/:id` - Eliminar producto de la lista de deseos (requiere autenticación)
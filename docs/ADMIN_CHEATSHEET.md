# Cheatsheet de Administración - Arreglos Florales Victoria

Documento de referencia rápida para administradores del sistema.

## Acceso al Panel de Administración

- **URL**: [https://tu-dominio.com/admin.html](https://tu-dominio.com/admin.html)
- **Requisitos**: Cuenta de usuario con rol de administrador
- **Credenciales por defecto**:
  - Email: admin@arreglosvictoria.com
  - Contraseña: admin123

## Funcionalidades Principales

### 1. Gestión de Productos

#### Ver productos
- Acceder desde el panel de administración -> "Gestionar Productos"
- Alternativamente: Ir directamente a [products.html](products.html)

#### Agregar nuevo producto
- En el panel de administración, hacer clic en "Agregar Nuevo Producto"
- Completar el formulario con:
  - Nombre del producto (obligatorio)
  - Precio (obligatorio)
  - Categoría (obligatorio)
  - URL de imagen (opcional)
  - Descripción (opcional)
- Hacer clic en "Agregar Producto"

#### Editar producto
- En la página de productos, hacer clic en el botón "Editar" del producto deseado
- Modificar los campos necesarios
- Guardar los cambios

#### Eliminar producto
- En la página de productos, hacer clic en el botón "Eliminar" del producto deseado
- Confirmar la eliminación

### 2. Gestión de Pedidos

#### Ver todos los pedidos
- En el panel de administración, hacer clic en "Gestionar Pedidos"
- Alternativamente: Ir a [admin-orders.html](admin-orders.html)

#### Ver pedidos pendientes
- En el panel de administración, hacer clic en "Ver Pedidos Pendientes"
- Alternativamente: Ir a [admin-orders.html#pending](admin-orders.html#pending)

#### Actualizar estado de pedido
- En la página de pedidos, hacer clic en el botón "Actualizar Estado" del pedido
- Seleccionar el nuevo estado del pedido
- Guardar los cambios

### 3. Gestión de Usuarios

#### Ver usuarios
- En el panel de administración, hacer clic en "Gestionar Usuarios"
- Alternativamente: Ir a [profile.html](profile.html)

#### Agregar nuevo usuario
- Funcionalidad en desarrollo

### 4. Estadísticas

#### Ver estadísticas del sitio
- En el panel de administración, hacer clic en "Ver Estadísticas"
- Se mostrará un modal con métricas clave del sitio

#### Generar informes
- Funcionalidad en desarrollo

### 5. Logs del Sistema

#### Actualizar logs
- En la sección de logs del panel de administración, hacer clic en "Actualizar Logs"

#### Limpiar logs
- En la sección de logs del panel de administración, hacer clic en "Limpiar Logs"
- Confirmar la acción en el diálogo que aparece

#### Filtrar logs por nivel
- Usar el selector "Nivel de Log" para filtrar por:
  - Todos
  - Info
  - Warning
  - Error

## Solución de Problemas Comunes

### No se puede agregar un nuevo producto
1. Verificar que todos los campos obligatorios estén completos:
   - Nombre del producto
   - Precio (debe ser mayor que 0)
   - Categoría
2. Verificar que el precio sea un número válido
3. Verificar la conexión a internet

### No se muestran los productos
1. Verificar la conexión a la API
2. Verificar que el backend esté funcionando correctamente
3. Revisar la consola del navegador para ver errores

### Problemas con el panel de administración
1. Verificar que el usuario tenga rol de administrador
2. Cerrar sesión y volver a iniciar
3. Limpiar la caché del navegador

## Atajos de Teclado

- **Ctrl + R**: Recargar la página
- **F12**: Abrir herramientas de desarrollo
- **Ctrl + Shift + I**: Abrir herramientas de desarrollo (alternativo)
- **Esc**: Cerrar modales

## Contacto y Soporte

- **Email de soporte**: [soporte@arreglosvictoria.com](mailto:soporte@arreglosvictoria.com)
- **Teléfono**: +595 981 XXX XXX

## Información Técnica

- **Versión del sistema**: 1.0
- **Tecnología**: HTML5, CSS3, JavaScript (ES6+), Node.js, Express.js, SQLite
- **API Base URL**: Configurado automáticamente según el entorno
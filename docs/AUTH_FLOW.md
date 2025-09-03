# Flujo de Autenticación

## Descripción general

El sistema de autenticación utiliza tokens JWT (JSON Web Tokens) para gestionar las sesiones de usuario. Los tokens se almacenan en `localStorage` y se utilizan para autenticar las solicitudes a la API.

## Proceso de inicio de sesión

1. El usuario introduce sus credenciales en el formulario de inicio de sesión
2. Las credenciales se envían a la API mediante una solicitud POST a `/api/users/login`
3. Si las credenciales son válidas, la API responde con un token JWT
4. El token se almacena en `localStorage` con la clave `token`
5. La información del usuario se extrae del token y se almacena en `localStorage` con la clave `user`
6. El menú de usuario se actualiza para mostrar la información del usuario
7. Se redirige al usuario a la página principal

## Proceso de registro

1. El usuario introduce sus datos en el formulario de registro
2. Los datos se envían a la API mediante una solicitud POST a `/api/users/register`
3. Si el registro es exitoso, la API responde con un mensaje de confirmación
4. Se muestra una notificación de éxito al usuario
5. El usuario es redirigido al formulario de inicio de sesión

## Verificación de autenticación

La función `isAuthenticated()` en `utils.js` verifica si el usuario está autenticado:

1. Comprueba si existe un token en `localStorage`
2. Si existe, verifica que no haya expirado
3. Si el token es válido, devuelve `true`, de lo contrario `false`

## Cierre de sesión

El proceso de cierre de sesión:

1. Se elimina el token de `localStorage`
2. Se elimina la información del usuario de `localStorage`
3. Se actualiza la interfaz para mostrar el enlace de inicio de sesión
4. Se redirige al usuario a la página principal

## Protección de rutas

Algunas páginas requieren que el usuario esté autenticado:

- `profile.html` - Perfil de usuario
- `orders.html` - Historial de pedidos
- `wishlist.html` - Lista de deseos
- `admin.html` - Panel de administración
- `admin-orders.html` - Gestión de pedidos (solo administradores)

Estas páginas verifican la autenticación al cargar y redirigen al usuario a la página de inicio de sesión si no está autenticado.

## Roles de usuario

El sistema soporta diferentes roles de usuario:

- `user` - Usuario regular
- `admin` - Administrador

Los roles se almacenan en el token JWT y se utilizan para controlar el acceso a ciertas funcionalidades.

## Manejo de errores

El sistema maneja los siguientes errores de autenticación:

- Credenciales inválidas
- Token expirado
- Token inválido
- Usuario no autorizado para ciertas acciones

## Seguridad

Medidas de seguridad implementadas:

- Uso de HTTPS en producción
- Tokens JWT con tiempo de expiración
- Eliminación automática de tokens inválidos
- Validación de datos en el frontend y backend
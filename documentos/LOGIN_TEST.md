# Prueba de inicio de sesión - Arreglos Victoria Florería

## Pasos para verificar si el problema de inicio de sesión ha sido resuelto

### 1. Limpiar el almacenamiento del navegador

Antes de comenzar las pruebas, es fundamental limpiar cualquier dato residual:

1. Abrir las herramientas de desarrollador (F12)
2. Ir a la pestaña "Application" (Aplicación)
3. En el menú izquierdo, seleccionar "Local Storage" > "file://"
4. Hacer clic derecho y seleccionar "Clear" (Limpiar)
5. Recargar la página

### 2. Iniciar el servidor backend

Asegurarse de que el servidor backend esté ejecutándose:

```bash
cd /laloaggro/flores/backend
npm start
```

Verificar que el servidor se esté ejecutando en el puerto 5000.

### 3. Probar el inicio de sesión con credenciales de administrador

1. Abrir el archivo `frontend/login.html` en el navegador
2. Utilizar las credenciales por defecto:
   - Email: `admin@arreglosvictoria.com`
   - Contraseña: `admin123`
3. Hacer clic en "Iniciar Sesión"

### 4. Verificar resultados esperados

#### Caso de éxito:
- Debería aparecer un mensaje de notificación "Inicio de sesión exitoso"
- Después de 1 segundo, debería redirigir automáticamente al panel de administración (`pages/admin.html`)
- En el panel de administración, debería mostrar "Administrador" en el menú de usuario

#### Caso de error:
- Si las credenciales son incorrectas, debería mostrar un mensaje de error
- Si hay problemas de conexión, debería mostrar un mensaje indicando que el servidor no está disponible

### 5. Probar el cierre de sesión

1. Una vez iniciada la sesión, hacer clic en el menú de usuario
2. Seleccionar "Cerrar Sesión"
3. Verificar que se redirija a la página de inicio (`index.html`)
4. Verificar que el botón muestre "Iniciar Sesión" nuevamente

### 6. Probar con credenciales inválidas

1. Intentar iniciar sesión con credenciales incorrectas:
   - Email: `usuario@falso.com`
   - Contraseña: `contraseña123`
2. Verificar que se muestre un mensaje de error apropiado

### 7. Probar el registro de nuevos usuarios

1. En la página de inicio de sesión, hacer clic en "¿No tienes cuenta? Regístrate"
2. Completar el formulario de registro con datos válidos
3. Verificar que se muestre un mensaje de "Registro exitoso"
4. Verificar que se cambie automáticamente al formulario de inicio de sesión

### 8. Probar inicio de sesión con usuario registrado

1. Utilizar las credenciales del usuario recién registrado
2. Verificar que se pueda iniciar sesión correctamente
3. Verificar que se redirija a la página de perfil (`profile.html`)

## Verificación del código

### Archivos modificados recientemente

1. `frontend/assets/js/login.js` - Rutas de API corregidas
2. `frontend/assets/js/auth.js` - Limpieza forzada de datos residuales
3. `frontend/assets/js/utils.js` - Verificaciones mejoradas de autenticación
4. `backend/.env` - Variable JWT_SECRET añadida

### Puntos críticos a verificar

1. El botón de "Iniciar Sesión" no debería mostrar nunca "administrador" sin haber iniciado sesión
2. Las credenciales por defecto deben funcionar correctamente
3. El proceso de registro debe crear usuarios correctamente en la base de datos
4. La redirección después del inicio de sesión debe funcionar según el rol del usuario
5. El cierre de sesión debe limpiar correctamente los datos del localStorage

## Solución de problemas

Si aún hay problemas con el inicio de sesión:

1. Verificar que el servidor backend esté ejecutándose en el puerto 5000
2. Verificar que la variable `JWT_SECRET` esté definida en `backend/.env`
3. Verificar que las rutas en `frontend/assets/js/login.js` apunten a `http://localhost:5000/api/users/`
4. Limpiar nuevamente el almacenamiento del navegador
5. Verificar la consola del navegador y del servidor en busca de errores

## Comandos útiles para verificación

```bash
# Verificar si el servidor está escuchando en el puerto 5000
netstat -tulpn | grep :5000

# Verificar los últimos commits
git log --oneline -5

# Verificar el estado del repositorio
git status
```
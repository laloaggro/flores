# Configuración del Envío de Correos Electrónicos

## Descripción

Esta guía explica cómo configurar correctamente la funcionalidad de envío de correos electrónicos en la aplicación Arreglos Victoria.

## Pasos de Configuración

### 1. Crear el archivo .env

Primero, asegúrate de tener un archivo `.env` en el directorio `backend/` con las credenciales correctas. Puedes copiar el archivo `.env.example` como punto de partida:

```bash
cd /laloaggro/flores/backend
cp .env.example .env
```

### 2. Configurar las credenciales de Gmail

Para usar Gmail como proveedor de correo, necesitas configurar una contraseña de aplicación:

1. Ve a [Google Account Settings](https://myaccount.google.com/)
2. En la sección "Seguridad", busca "Verificación en dos pasos" y actívala
3. Una vez activada, busca "Contraseñas de aplicaciones"
4. Genera una nueva contraseña de aplicación
5. Usa esta contraseña en lugar de tu contraseña normal de Google

### 3. Actualizar las variables de entorno

Edita el archivo `.env` y actualiza las siguientes variables:

```
# Configuración de correo electrónico
EMAIL_SERVICE=gmail
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=la-contraseña-de-aplicación-que-generaste
```

### 4. Reiniciar el servidor

Después de actualizar las credenciales, reinicia el servidor backend:

```bash
cd /laloaggro/flores/backend
npm start
```

## Solución de Problemas

### Problemas comunes y soluciones

1. **Error: "Invalid login" o "Authentication failed"**
   - Asegúrate de usar una contraseña de aplicación, no tu contraseña normal de Google
   - Verifica que las credenciales sean correctas
   - Comprueba que la verificación en dos pasos esté activada

2. **Error: "Connection timeout" o problemas de conexión**
   - Verifica tu conexión a Internet
   - Asegúrate de que no haya firewalls bloqueando la conexión
   - Intenta reiniciar el servidor

3. **Error: Variables de entorno no configuradas**
   - Verifica que el archivo `.env` exista en el directorio `backend/`
   - Confirma que las variables `EMAIL_USER` y `EMAIL_PASS` estén definidas

4. **Los correos no llegan**
   - Revisa la carpeta de spam o correo no deseado
   - Verifica que el correo se esté enviando a la dirección correcta
   - Comprueba los logs del servidor para ver si hay errores

## Prueba de Funcionamiento

Para probar si la funcionalidad está funcionando correctamente:

1. Abre la aplicación en tu navegador
2. Navega a la sección de contacto
3. Rellena el formulario con datos de prueba
4. Envía el mensaje
5. Comprueba si recibes el correo en la cuenta configurada

## Seguridad

- Nunca compartas tu archivo `.env` o las credenciales
- Asegúrate de que el archivo `.env` esté en `.gitignore` para no subirlo al repositorio
- Usa contraseñas de aplicación en lugar de contraseñas normales
- Cambia regularmente las contraseñas de aplicación

## Configuración de otros proveedores de correo

Si prefieres usar otro proveedor de correo en lugar de Gmail, puedes actualizar las variables de entorno:

```
# Para Outlook/Hotmail
EMAIL_SERVICE=hotmail
EMAIL_USER=tu-email@outlook.com
EMAIL_PASS=tu-contraseña

# Para Yahoo
EMAIL_SERVICE=yahoo
EMAIL_USER=tu-email@yahoo.com
EMAIL_PASS=tu-contraseña
```

Consulta la [documentación de Nodemailer](https://nodemailer.com/smtp/well-known/) para ver la lista completa de servicios compatibles.
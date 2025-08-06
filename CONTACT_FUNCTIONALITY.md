# Funcionalidad de Contacto - Arreglos Victoria

## Descripción

Esta funcionalidad permite a los visitantes del sitio web enviar mensajes a través del formulario de contacto, que son enviados por correo electrónico al propietario del sitio.

## Implementación

### Backend

1. **Controlador de Contacto** ([backend/controllers/contactController.js](file:///laloaggro/flores/backend/controllers/contactController.js)):
   - Utiliza `nodemailer` para enviar correos electrónicos
   - Valida los datos del formulario
   - Envía un correo con la información del formulario al propietario del sitio

2. **Ruta de Contacto** ([backend/routes/contact.js](file:///laloaggro/flores/backend/routes/contact.js)):
   - Define la ruta POST `/api/contact/send-message` para manejar el envío de mensajes

3. **Integración en el Servidor** ([backend/server.js](file:///laloaggro/flores/backend/server.js)):
   - Se ha añadido la ruta de contacto al servidor principal

### Frontend

1. **JavaScript** ([frontend/assets/js/app.js](file:///laloaggro/flores/frontend/assets/js/app.js)):
   - Se ha actualizado la función `handleContactFormSubmit` para enviar los datos del formulario al backend
   - Se muestra un mensaje de carga mientras se envía el formulario
   - Se manejan errores de red y respuestas del servidor

## Configuración

Para que la funcionalidad de contacto funcione correctamente, se deben configurar las siguientes variables de entorno en el archivo `.env`:

```
EMAIL_SERVICE=gmail
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña
```

### Configuración de Gmail

Si estás usando Gmail, necesitas:

1. Habilitar la verificación en dos pasos en tu cuenta de Google
2. Generar una contraseña de aplicación:
   - Ve a la configuración de tu cuenta de Google
   - Selecciona "Seguridad"
   - En "Inicio de sesión en Google", selecciona "Contraseñas de aplicaciones"
   - Genera una nueva contraseña de aplicación y úsala como `EMAIL_PASS`

## Pruebas

Para probar la funcionalidad:

1. Asegúrate de que el servidor backend está corriendo
2. Rellena el formulario de contacto en el frontend
3. Verifica que se reciba un correo electrónico con la información del formulario

## Posibles Mejoras Futuras

1. **Validación mejorada**:
   - Validar formato de correo electrónico
   - Validar formato de número de teléfono
   - Añadir límites de caracteres

2. **Protección contra spam**:
   - Añadir reCAPTCHA
   - Implementar límites de envío

3. **Respuesta automática**:
   - Enviar un correo automático al usuario que envía el formulario

4. **Almacenamiento de mensajes**:
   - Guardar mensajes en la base de datos para referencia futura
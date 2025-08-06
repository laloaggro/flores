# Guía de Validación del Formulario de Contacto

## Descripción

Esta guía proporciona instrucciones detalladas para validar el correcto funcionamiento del formulario de contacto en el sitio web de Arreglos Victoria.

## Validación del Backend

### 1. Verificar que el backend esté funcionando

Primero, asegúrate de que el servidor backend esté ejecutándose:

```bash
cd /laloaggro/flores/backend
npm start
```

### 2. Probar el endpoint con curl

Una vez que el servidor esté en funcionamiento, prueba el endpoint usando curl:

```bash
curl -X POST http://localhost:5000/api/contact/send-message -H "Content-Type: application/json" -d '{"name": "Test User", "email": "test@example.com", "phone": "123456789", "message": "Este es un mensaje de prueba para validar el envío de correos"}'
```

Deberías recibir una respuesta como:
```json
{"message":"Mensaje enviado exitosamente. Nos pondremos en contacto contigo pronto."}
```

### 3. Detener el servidor

Después de la prueba, detén el servidor:
```bash
cd /laloaggro/flores
pkill -f "node server.js"
```

## Validación del Frontend

### 1. Verificar la estructura del formulario

El formulario debe tener los siguientes elementos con los IDs especificados:
- Campo de nombre: `#name`
- Campo de email: `#email`
- Campo de teléfono: `#phone`
- Campo de mensaje: `#message`
- Formulario: `#contactForm`
- Área de mensajes: `#formMessage`
- Botón de envío: `#contactForm .btn`

### 2. Verificar el archivo JavaScript

El archivo [app.js](file:///laloaggro/flores/frontend/assets/js/app.js) debe contener:
1. Una función `handleContactFormSubmit` que maneje el evento de envío
2. Una función `initializeEventListeners` que adjunte el event listener al formulario
3. Una función `showFormMessage` para mostrar mensajes al usuario

### 3. Verificar que los event listeners se inicialicen correctamente

El código debe:
1. Esperar a que el DOM esté completamente cargado
2. Verificar que el formulario exista antes de adjuntar el event listener
3. Adjuntar el event listener al evento 'submit' del formulario

## Prueba de la Página de Prueba

### 1. Abrir el archivo de prueba

Abre el archivo `form_test.html` en tu navegador web:
```
/laloaggro/flores/form_test.html
```

### 2. Verificar los mensajes en la consola

Abre las herramientas de desarrollador (F12) y ve a la pestaña de consola. Deberías ver un mensaje:
```
Event listener adjuntado correctamente al formulario de prueba
```

### 3. Completar y enviar el formulario

Completa todos los campos del formulario:
- Nombre: (requerido)
- Email: (requerido)
- Teléfono: (opcional)
- Mensaje: (requerido)

Haz clic en el botón "Enviar Mensaje" y observa:
1. El botón debería cambiar a "Enviando..." y deshabilitarse temporalmente
2. Después de unos segundos, debería aparecer un mensaje de éxito
3. El formulario debería limpiarse automáticamente

## Problemas Comunes y Soluciones

### 1. El botón no hace nada al hacer clic

**Posibles causas:**
- El event listener no se adjuntó correctamente
- Hay un error en el JavaScript que previene la ejecución
- El formulario no existe cuando se intenta adjuntar el event listener

**Soluciones:**
- Verificar que el formulario exista en el DOM antes de adjuntar el event listener
- Revisar la consola del navegador en busca de errores de JavaScript
- Asegurarse de que el código se ejecute después de que el DOM esté completamente cargado

### 2. Mensajes de error al enviar el formulario

**Posibles causas:**
- El backend no está funcionando
- Hay un problema de CORS
- La ruta del API es incorrecta
- Los datos no se están enviando en el formato correcto

**Soluciones:**
- Verificar que el servidor backend esté ejecutándose
- Confirmar que la ruta del API sea correcta (`/api/contact/send-message`)
- Verificar que los datos se estén enviando como JSON

### 3. No se muestran los mensajes de éxito/error

**Posibles causas:**
- El elemento `#formMessage` no existe en el DOM
- Hay un error en la función `showFormMessage`
- Los estilos CSS están ocultando los mensajes

**Soluciones:**
- Verificar que exista un elemento con ID `formMessage` en el formulario
- Revisar la consola del navegador en busca de errores
- Inspeccionar los elementos en las herramientas de desarrollador para ver si los mensajes están presentes pero ocultos

## Verificación Final

Para asegurarte de que todo funciona correctamente:

1. Ejecuta el servidor backend
2. Abre el sitio web en tu navegador
3. Navega a la sección de contacto
4. Completa el formulario con datos de prueba
5. Haz clic en "Enviar Mensaje"
6. Verifica que:
   - El botón cambie a "Enviando..." y se deshabilite
   - Aparezca un mensaje de éxito en la parte superior del formulario
   - El formulario se limpie automáticamente
   - El botón vuelva a su estado normal
7. Verifica tu correo electrónico para confirmar que recibiste el mensaje

Si todos estos pasos funcionan correctamente, el formulario de contacto está funcionando como se espera.
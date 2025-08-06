# Validación de Cambios en el Sitio Web

## Descripción

Este documento proporciona instrucciones detalladas sobre cómo validar los cambios realizados en el sitio web, especialmente en relación con el formulario de contacto.

## Pasos para Validar los Cambios

### 1. Iniciar el Servidor

#### Iniciar el servidor backend:
```bash
cd /laloaggro/flores/backend
npm start
```

Deberías ver un mensaje como:
```
🚀 Servidor backend corriendo en http://localhost:5000
📄 Documentación de la API: http://localhost:5000/api/docs (próximamente)
```

### 2. Verificar el Funcionamiento del Backend

#### Probar el endpoint de contacto:
```bash
curl -X POST http://localhost:5000/api/contact/send-message -H "Content-Type: application/json" -d '{"name": "Test User", "email": "test@example.com", "phone": "123456789", "message": "Este es un mensaje de prueba para validar el envío de correos"}'
```

Deberías recibir una respuesta como:
```json
{"message":"Mensaje enviado exitosamente. Nos pondremos en contacto contigo pronto."}
```

### 3. Acceder al Sitio Web

Abre tu navegador y visita: http://localhost:5000

### 4. Validar el Formulario de Contacto

#### Pasos a seguir:
1. Desplázate hasta la sección de contacto
2. Completa todos los campos del formulario:
   - Nombre (requerido)
   - Email (requerido)
   - Teléfono (opcional)
   - Mensaje (requerido)
3. Haz clic en el botón "Enviar Mensaje"

#### Comportamiento esperado:
1. El botón debería cambiar a "Enviando..." y deshabilitarse temporalmente
2. Debería aparecer un mensaje de éxito en la parte superior del formulario
3. El formulario debería limpiarse automáticamente
4. El botón debería volver a su estado normal

### 5. Verificar la Recepción del Correo

Revisa la bandeja de entrada del correo configurado en `EMAIL_USER` para asegurarte de que el mensaje haya llegado.

### 6. Verificar la Consola del Navegador

#### Pasos a seguir:
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña de Consola
3. Completa y envía el formulario
4. Observa los mensajes en la consola:
   - Deberías ver mensajes indicando que el DOM se ha cargado
   - Deberías ver mensajes sobre la inicialización de event listeners
   - Deberías ver mensajes cuando se envíe el formulario

### 7. Verificar la Pestaña de Red (Network)

#### Pasos a seguir:
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña de Red (Network)
3. Completa y envía el formulario
4. Observa las solicitudes realizadas:
   - Debería aparecer una solicitud POST a `/api/contact/send-message`
   - El estado de la solicitud debería ser 200 (éxito)

## Archivos de Prueba Adicionales

### 1. Prueba de Depuración del Formulario

Abre el archivo `form_debug_test.html` en tu navegador:

```
/laloaggro/flores/form_debug_test.html
```

Este archivo permite:
- Cargar el formulario de contacto en un entorno controlado
- Verificar si el event listener se adjunta correctamente
- Probar el funcionamiento del formulario con registro detallado

### 2. Prueba del Formulario de Contacto

Abre el archivo `form_test.html` en tu navegador:

```
/laloaggro/flores/form_test.html
```

Este archivo permite:
- Probar el formulario de contacto en un entorno aislado
- Verificar su funcionamiento sin interferencias de otros elementos del sitio

## Validación de Mejoras Implementadas

### 1. Accesibilidad
- Verifica que todos los campos del formulario tengan atributos `id` y `name`
- Verifica que los campos tengan atributos `autocomplete` apropiados
- Usa la herramienta Lighthouse de Chrome para verificar la accesibilidad

### 2. Manejo de Errores
- Prueba enviar el formulario con campos requeridos vacíos
- Verifica que se muestren mensajes de error apropiados
- Prueba desconectando el internet y enviando el formulario
- Verifica que se muestre un mensaje de error de conexión

### 3. Sincronización del Event Listener
- Recarga la página y verifica que el formulario funcione inmediatamente
- Verifica la consola para asegurarte de que el event listener se adjunte correctamente

## Problemas Comunes y Soluciones

### 1. El formulario no hace nada al hacer clic en "Enviar Mensaje"
**Posibles causas:**
- El event listener no se adjuntó correctamente
- Hay un error en el JavaScript que previene la ejecución

**Soluciones:**
- Verifica la consola del navegador en busca de errores
- Asegúrate de que el servidor backend esté ejecutándose

### 2. Mensajes de error al enviar el formulario
**Posibles causas:**
- El backend no está funcionando
- Hay un problema de CORS
- La ruta del API es incorrecta

**Soluciones:**
- Verifica que el servidor backend esté ejecutándose
- Confirma que la ruta del API sea correcta (`/api/contact/send-message`)

### 3. No se muestran los mensajes de éxito/error
**Posibles causas:**
- El elemento `#formMessage` no existe en el DOM
- Hay un error en la función `showFormMessage`

**Soluciones:**
- Verifica que exista un elemento con ID `formMessage` en el formulario
- Revisa la consola del navegador en busca de errores

## Verificación Final

Para asegurarte de que todos los cambios funcionan correctamente:

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

Si todos estos pasos funcionan correctamente, los cambios se han implementado con éxito.
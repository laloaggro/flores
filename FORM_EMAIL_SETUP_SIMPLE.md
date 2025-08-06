# Cómo funciona el envío de correos del formulario (Explicación simple)

## Tecnologías utilizadas

### 1. Frontend (Lo que ve el usuario)
- **HTML**: Estructura del formulario
- **CSS**: Diseño y estilo del formulario
- **JavaScript**: Funcionalidad del formulario (validación, envío)

### 2. Backend (Lo que procesa la información)
- **Node.js**: Plataforma para ejecutar el servidor
- **Express.js**: Framework para crear el servidor web
- **Nodemailer**: Librería para enviar correos electrónicos

### 3. Servicio de correo
- **Gmail**: Servicio de correo utilizado para enviar los mensajes

## Cómo funciona el proceso

### 1. El usuario completa el formulario
```
Nombre: Juan Pérez
Email: juan@example.com
Teléfono: 123456789
Mensaje: Me interesa información sobre sus productos
```

### 2. El frontend envía la información al backend
- Cuando el usuario hace clic en "Enviar Mensaje", JavaScript recoge la información del formulario
- JavaScript envía esta información al servidor (backend) usando una llamada "fetch"

### 3. El backend procesa la información
- El servidor recibe la información del formulario
- El servidor usa Nodemailer para preparar un correo electrónico
- El servidor se conecta a Gmail y envía el correo

### 4. El correo llega al destinatario
- El mensaje aparece en la bandeja de entrada del correo configurado

## Configuración necesaria

### Archivo .env (configuración de correo)
```
EMAIL_SERVICE=gmail
EMAIL_USER=tu-correo@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicación
```

## Flujo completo

```
Usuario completa formulario
        ↓
JavaScript envía datos al servidor
        ↓
Servidor recibe los datos
        ↓
Servidor prepara correo con Nodemailer
        ↓
Servidor envía correo usando Gmail
        ↓
Correo llega a la bandeja de entrada
```

## Requisitos para que funcione

1. **Servidor ejecutándose**: El backend debe estar encendido
2. **Conexión a internet**: Tanto el frontend como el backend necesitan conexión
3. **Configuración de correo correcta**: Las credenciales de Gmail deben ser válidas
4. **Contraseña de aplicación de Gmail**: Se necesita una contraseña especial de Gmail, no la contraseña normal

## Problemas comunes

### 1. El formulario no envía correos
- El servidor no está encendido
- La configuración de correo es incorrecta
- La contraseña de aplicación de Gmail es inválida

### 2. Los correos llegan a spam
- El correo puede ser marcado como spam por el proveedor
- Es recomendable usar un servicio de correo más profesional para producción

## Ventajas de esta solución

1. **Fácil de implementar**: No requiere servicios externos costosos
2. **Personalizable**: Se puede modificar fácilmente
3. **Directo**: Los correos llegan directamente a tu bandeja de entrada
4. **Económico**: Usa servicios gratuitos (Gmail)

## Limitaciones

1. **Dependencia de Gmail**: Si Gmail tiene problemas, el servicio se interrumpe
2. **Límites de envío**: Gmail tiene límites en la cantidad de correos que se pueden enviar
3. **Posible marca como spam**: Algunos proveedores pueden marcar los correos como spam
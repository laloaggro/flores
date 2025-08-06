# Guía de Despliegue del Sitio Web Arreglos Victoria

## Descripción

Esta guía proporciona instrucciones detalladas para desplegar el sitio web de Arreglos Victoria en un entorno de producción.

## Requisitos Previos

1. **Node.js** (versión 14 o superior)
2. **npm** (normalmente se instala con Node.js)
3. **Git** para control de versiones
4. **Acceso al repositorio** en GitHub
5. **Configuración del archivo .env** con las credenciales necesarias

## Estructura del Proyecto

```
flores/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│   └── .env
├── frontend/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   └── index.html
└── ...
```

## Configuración del Entorno

### 1. Clonar el repositorio

```bash
git clone https://github.com/laloaggro/flores.git
cd flores
```

### 2. Configurar variables de entorno

Crear un archivo `.env` en el directorio `backend/` basado en `.env.example`:

```bash
cd backend
cp .env.example .env
```

Editar el archivo `.env` con las credenciales reales:

```
# Configuración del servidor
PORT=5000

# Configuración de la base de datos
DB_HOST=localhost
DB_USER=usuario
DB_PASSWORD=contraseña
DB_NAME=arreglosvictoria

# Configuración de correo electrónico
EMAIL_SERVICE=gmail
EMAIL_USER=arreglosvictoriafloreria@gmail.com
EMAIL_PASS=contraseña_de_aplicación
```

**Importante**: Para Gmail, se debe usar una contraseña de aplicación, no la contraseña normal de la cuenta.

## Instalación de Dependencias

### 1. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 2. Verificar dependencias del frontend

El frontend es una aplicación estática que no requiere instalación de dependencias especiales. Todos los recursos necesarios están incluidos en el directorio `frontend/`.

## Despliegue del Backend

### 1. Iniciar el servidor

```bash
cd backend
npm start
```

Esto iniciará el servidor en el puerto especificado en el archivo `.env` (por defecto el 5000).

### 2. Verificar que el servidor esté funcionando

```bash
curl http://localhost:5000
```

Deberías recibir una respuesta del servidor.

### 3. Probar el endpoint de contacto

```bash
curl -X POST http://localhost:5000/api/contact/send-message -H "Content-Type: application/json" -d '{"name": "Test User", "email": "test@example.com", "phone": "123456789", "message": "Este es un mensaje de prueba para validar el envío de correos"}'
```

Deberías recibir una respuesta como:
```json
{"message":"Mensaje enviado exitosamente. Nos pondremos en contacto contigo pronto."}
```

## Despliegue del Frontend

### 1. Sirviendo los archivos estáticos

El frontend se puede servir usando cualquier servidor web que pueda servir archivos estáticos. Algunas opciones:

#### Usando Node.js (express.static)

El backend ya está configurado para servir los archivos del frontend, por lo que no es necesario un paso adicional.

#### Usando Python (para pruebas locales)

```bash
cd frontend
python -m http.server 8000
```

#### Usando Nginx (para producción)

Configurar un bloque de servidor en Nginx:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        root /ruta/a/flores/frontend;
        index index.html;
        try_files $uri $uri/ =404;
    }

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Verificación del Sitio

### 1. Acceder al sitio

Abre tu navegador y visita `http://localhost:5000` (o el dominio configurado).

### 2. Navegar por las secciones

Verifica que todas las secciones se muestren correctamente:
- Inicio
- Categorías
- Productos
- Sobre nosotros
- Testimonios
- Blog
- Contacto

### 3. Probar el formulario de contacto

Completa el formulario de contacto y envíalo. Verifica que:
- El botón cambie a "Enviando..." durante el proceso
- Aparezca un mensaje de éxito
- El formulario se limpie después del envío

### 4. Verificar que el correo llegue

Revisa la bandeja de entrada de la cuenta de correo configurada en `EMAIL_USER` para asegurarte de que el mensaje haya llegado.

## Solución de Problemas

### Problemas comunes con el envío de correos

1. **Error de autenticación**:
   - Verifica que estés usando una contraseña de aplicación y no la contraseña normal de Gmail
   - Asegúrate de que la verificación en dos pasos esté activada en tu cuenta de Google

2. **Conexión rechazada**:
   - Verifica que el servidor backend esté ejecutándose
   - Confirma que el puerto esté correctamente configurado y no esté bloqueado por un firewall

3. **Formulario no funciona**:
   - Verifica la consola del navegador en busca de errores de JavaScript
   - Asegúrate de que el servidor backend esté accesible desde el frontend

### Problemas con el frontend

1. **Archivos no encontrados (404)**:
   - Verifica que todos los archivos del directorio `frontend/` estén presentes
   - Confirma que la configuración del servidor web apunte al directorio correcto

2. **Estilos no se aplican**:
   - Verifica que el archivo `styles.css` esté correctamente enlazado en el HTML
   - Confirma que la ruta al archivo CSS sea correcta

## Mantenimiento

### Actualización del sitio

Para actualizar el sitio con los últimos cambios:

```bash
git pull origin master
cd backend
npm install  # Si hay nuevas dependencias
```

Reinicia el servidor backend para aplicar los cambios.

### Monitoreo

- Verifica regularmente los logs del servidor backend
- Asegúrate de que el servicio se esté ejecutando correctamente
- Monitorea el correo para confirmar que los mensajes del formulario de contacto lleguen correctamente

## Seguridad

1. **Protección de credenciales**:
   - Nunca subas el archivo `.env` al repositorio público
   - Usa contraseñas de aplicación en lugar de contraseñas normales
   - Cambia regularmente las contraseñas de aplicación

2. **Actualizaciones**:
   - Mantén Node.js y las dependencias actualizadas
   - Revisa regularmente las vulnerabilidades de seguridad en las dependencias

## Backup

Es recomendable crear copias de seguridad regulares de:
1. El código fuente del sitio
2. La base de datos (si se usa una)
3. Las configuraciones del servidor

## Soporte

Si encuentras problemas durante el despliegue o funcionamiento del sitio, consulta:
1. Los logs del servidor backend
2. La consola del navegador
3. Esta guía de despliegue
4. La guía de configuración de correo electrónico ([EMAIL_SETUP_INSTRUCTIONS.md](file:///laloaggro/flores/EMAIL_SETUP_INSTRUCTIONS.md))
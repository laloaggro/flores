# Arreglos Victoria Florería

Sitio web para la florería Arreglos Victoria, con funcionalidades de catálogo de productos y formulario de contacto.

## Estructura del proyecto

```
.
├── backend/
│   ├── config/
│   ├── routes/
│   ├── contact.php
│   ├── contact-enhanced.php
│   ├── server.js
│   └── ...
├── frontend/
│   ├── assets/
│   ├── components/
│   └── index.html
├── README.md
└── PRODUCTION.md
```

## Tecnologías utilizadas

- Frontend: HTML, CSS (Tailwind), JavaScript (ES6)
- Backend: Node.js con Express, PHP
- Correo: PHPMailer
- Gestión de dependencias: npm, Composer

## Instalación

### Configuración del entorno

1. Copiar el archivo de ejemplo de variables de entorno:
   ```
   cp backend/.env.example backend/.env
   ```

2. Configurar las variables de entorno en `backend/.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=tu-correo@gmail.com
   SMTP_PASSWORD=tu-contraseña-o-contraseña-de-aplicación
   SMTP_ENCRYPTION=tls
   ```

## Instalación de dependencias

### Node.js (backend)
```
cd backend
npm install
```

### PHP (para envío de correos)
```
cd backend
# Si no tienes Composer instalado
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"

# Instalar dependencias de PHP
php composer.phar install
```

## Ejecutar el servidor de desarrollo

```
cd backend
npm start
```

El servidor se ejecutará en `http://localhost:5000`

## Pruebas

Para probar la funcionalidad de contacto sin enviar correos reales:
```
cd backend
php dev-contact-test.php
```

Para verificar la configuración de producción:
```
cd backend
php check-production.php
```

## Despliegue en producción

Para instrucciones detalladas sobre cómo desplegar en producción, consulta [PRODUCTION.md](PRODUCTION.md).

## Funcionalidades del sitio

1. **Catálogo de productos**: Muestra los arreglos florales disponibles con nombre, precio e imagen.
2. **Formulario de contacto**: Permite a los clientes enviar mensajes directamente al negocio.
3. **Sistema de pedidos**: Permite a los clientes realizar pedidos de productos.
4. **Integración con redes sociales**: Enlaces a Instagram y WhatsApp.

## API Endpoints

- `GET /api/products` - Obtener la lista de productos
- `POST /api/orders/create` - Crear un nuevo pedido
- `GET /api/orders` - Obtener la lista de pedidos
- `POST /api/contact` - Enviar un mensaje de contacto

## Configuración de correo

Para que la funcionalidad de contacto funcione correctamente, debes:

1. Configurar una contraseña de aplicación de Gmail (recomendado) o habilitar el acceso de aplicaciones menos seguras
2. Actualizar las variables de entorno en el archivo `.env` con tus credenciales
3. Verificar que el servidor tenga las extensiones PHP necesarias instaladas

## Extensiones recomendadas de VSCode

El proyecto incluye una configuración recomendada de extensiones para VSCode en `.vscode/extensions.json`.
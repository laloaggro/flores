# Arreglos Victoria Florería

Sitio web para la florería Arreglos Victoria, con funcionalidades de catálogo de productos, carrito de compras y formulario de contacto.

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
├── PRODUCTION.md
└── DOCUMENTATION.md
```

## Tecnologías utilizadas

- Frontend: HTML, CSS (Flexbox/Grid), JavaScript (ES6+)
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

## Documentación

Para una documentación más completa del proyecto, consulta los siguientes archivos:

- [DOCUMENTATION.md](DOCUMENTATION.md) - Documentación general del proyecto
- [PRODUCTION.md](PRODUCTION.md) - Instrucciones detalladas para despliegue en producción

## Funcionalidades del sitio

1. **Catálogo de productos**: Muestra los arreglos florales disponibles con nombre, precio e imagen.
2. **Carrito de compras**: Permite a los clientes agregar productos y realizar pedidos.
3. **Formulario de contacto**: Permite a los clientes enviar mensajes directamente al negocio.
4. **Sistema de pedidos**: Permite a los clientes realizar pedidos de productos.
5. **Integración con redes sociales**: Enlaces a Instagram y WhatsApp.

## Ramas del repositorio

- `main/master`: Código en producción
- `development`: Rama de desarrollo principal
- `release-*`: Ramas para versiones específicas
- `feature/*`: Ramas para nuevas funcionalidades
- `hotfix/*`: Ramas para correcciones urgentes

## Despliegue en producción

Para instrucciones detalladas sobre cómo desplegar en producción, consulta [PRODUCTION.md](PRODUCTION.md) y [DOCUMENTATION.md](DOCUMENTATION.md).
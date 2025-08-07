# Instrucciones para la puesta en producción

Este documento contiene las instrucciones necesarias para desplegar el sitio web en un entorno de producción.

## Requisitos previos

1. Servidor web con PHP 7.4 o superior
2. Node.js 14 o superior
3. Composer (gestor de dependencias de PHP)
4. Extensiones PHP necesarias:
   - openssl
   - curl
   - filter
   - hash

## Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd flores
```

### 2. Instalar dependencias del backend (Node.js)

```bash
cd backend
npm install
```

### 3. Instalar dependencias de PHP

```bash
# Instalar Composer si no está disponible
curl -sS https://getcomposer.org/installer | php

# Instalar dependencias de PHP
php composer.phar install
```

### 4. Configurar variables de entorno

```bash
# Crear archivo .env a partir del ejemplo
cp .env.production.example .env
```

Editar el archivo `.env` y actualizar las siguientes variables con valores reales:

- `SMTP_PASSWORD`: Contraseña de aplicación de Gmail
- Verificar que los demás valores sean correctos según el entorno de producción

## Configuración de credenciales de Gmail

Para que el sistema de contacto funcione correctamente, se debe configurar una contraseña de aplicación de Gmail:

1. Ir a la configuración de la cuenta de Google: https://myaccount.google.com/
2. Seleccionar "Seguridad" en el panel izquierdo
3. En la sección "Acceso a Google", seleccionar "Verificación en dos pasos" y activarla si no está activa
4. Una vez activada la verificación en dos pasos, seleccionar "Contraseñas de aplicaciones"
5. En "Seleccionar aplicación", elegir "Otra (personalizada)" y ponerle un nombre como "Floreria Website"
6. Se generará una contraseña de 16 caracteres. Copiar esta contraseña.
7. Pegar esta contraseña en el archivo `.env` en la variable `SMTP_PASSWORD`

Importante:
- No usar la contraseña normal de la cuenta de Gmail
- La contraseña de aplicación solo se muestra una vez, asegúrate de guardarla
- Las contraseñas de aplicación solo funcionan si la verificación en dos pasos está activada

## Configuración del servidor

### Configuración de Apache

Si estás usando Apache, asegúrate de tener el módulo `mod_rewrite` activado y permite el uso de `.htaccess`.

### Configuración de Nginx

Si estás usando Nginx, asegúrate de configurar los bloques de ubicación para enrutar las solicitudes al servidor Node.js.

## Verificación

Antes de iniciar el servidor en producción, ejecuta el script de verificación:

```bash
cd backend
php check-production.php
```

Este script verificará:
- Presencia del archivo `.env`
- Instalación de dependencias
- Variables de entorno críticas
- Extensiones PHP necesarias

## Iniciar el servidor

Para iniciar el servidor en producción, se recomienda usar un proceso administrador como `pm2`:

```bash
# Instalar pm2 globalmente
npm install -g pm2

# Iniciar la aplicación con pm2
pm2 start server.js --name "floreria"
```

## Configuración de seguridad

1. Asegúrate de que el archivo `.env` no sea accesible públicamente
2. Configura correctamente los permisos de archivos y directorios
3. Usa una contraseña de aplicación de Gmail en lugar de tu contraseña real
4. Considera usar un servicio de correo dedicado como SendGrid o Amazon SES para mayor confiabilidad

## Mantenimiento

- Realiza copias de seguridad regulares del archivo `.env` y cualquier otro archivo de configuración
- Mantén las dependencias actualizadas ejecutando `npm update` y `composer update` periódicamente
- Monitorea los registros de errores del servidor

## Solución de problemas

### Problemas comunes de correo

1. Si los correos no se envían, verifica:
   - Credenciales SMTP correctas
   - Acceso de aplicaciones menos seguras habilitado en Gmail o uso de contraseña de aplicación
   - Conectividad de red al servidor SMTP

2. Errores de dependencias:
   - Asegúrate de que todas las extensiones PHP requeridas estén instaladas
   - Verifica que Composer se haya ejecutado correctamente

### Problemas de API

1. Si las APIs no responden:
   - Verifica que el servidor Node.js esté en ejecución
   - Revisa los registros de error en la consola

## Actualizaciones

Para actualizar la aplicación:

```bash
# Detener el servidor
pm2 stop floreria

# Obtener los últimos cambios
git pull

# Actualizar dependencias si es necesario
npm install
php composer.phar install

# Iniciar el servidor
pm2 start floreria
```
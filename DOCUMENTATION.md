# Documentación General del Proyecto - Arreglos Victoria Florería

## Descripción del Proyecto

Este es el sitio web para la florería Arreglos Victoria, que incluye un catálogo de productos, sistema de carrito de compras, formulario de contacto y procesamiento de pedidos.

## Estructura del Proyecto

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
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   ├── components/
│   └── index.html
├── README.md
├── PRODUCTION.md
└── DOCUMENTATION.md
```

## Tecnologías Utilizadas

### Frontend
- HTML5
- CSS3 (con Flexbox y Grid)
- JavaScript (ES6+)
- Font Awesome para iconos

### Backend
- Node.js con Express
- PHP para procesamiento de correos
- PHPMailer para envío de correos electrónicos
- Dotenv para gestión de variables de entorno

### Herramientas
- npm para gestión de dependencias de Node.js
- Composer para gestión de dependencias de PHP
- Git para control de versiones

## Funcionalidades Principales

### 1. Catálogo de Productos
- Visualización de arreglos florales con nombre, descripción, precio e imagen
- Diseño responsivo que se adapta a diferentes dispositivos
- Información detallada de cada producto

### 2. Carrito de Compras
- Agregar productos al carrito
- Ver y modificar cantidades de productos
- Eliminar productos del carrito
- Calcular total de la compra
- Persistencia de datos usando localStorage
- Interfaz de usuario intuitiva

### 3. Formulario de Contacto
- Envío de mensajes a través de correo electrónico
- Validación de campos requeridos
- Validación de formato de correo electrónico
- Integración con carrito de compras para pedidos
- Feedback visual al usuario

### 4. Sistema de Pedidos
- Creación de pedidos con información del cliente
- Almacenamiento de pedidos en memoria
- API REST para gestión de pedidos

## Arquitectura del Sistema

### Frontend
El frontend está construido con HTML, CSS y JavaScript vanilla. Se comunica con el backend a través de llamadas AJAX a la API REST.

#### Componentes Principales:
1. **Header**: Navegación principal y carrito de compras
2. **Hero Section**: Sección principal con llamado a la acción
3. **Productos**: Catálogo de arreglos florales
4. **Sobre Nosotros**: Información de la empresa
5. **Contacto**: Formulario de contacto
6. **Footer**: Información de contacto y enlaces

### Backend
El backend utiliza Node.js con Express para servir archivos estáticos y proporcionar una API REST. El envío de correos se maneja con PHP y PHPMailer.

#### API Endpoints:
1. `GET /api/products` - Obtener lista de productos
2. `GET /api/orders` - Obtener lista de pedidos
3. `POST /api/orders/create` - Crear un nuevo pedido
4. `POST /api/contact` - Enviar mensaje de contacto

## Flujo de Trabajo de Desarrollo

### Ramas Git
- `main/master`: Código en producción
- `development`: Rama de desarrollo principal
- `release-*`: Ramas para versiones específicas
- `feature/*`: Ramas para nuevas funcionalidades
- `hotfix/*`: Ramas para correcciones urgentes

### Desarrollo Local
1. Clonar el repositorio
2. Instalar dependencias de Node.js y PHP
3. Configurar variables de entorno
4. Iniciar el servidor de desarrollo

### Despliegue
1. Crear una rama de release
2. Realizar pruebas finales
3. Fusionar con la rama principal
4. Etiquetar la versión
5. Desplegar en el servidor de producción

## Configuración y Personalización

### Variables de Entorno
Las variables de entorno se configuran en el archivo `backend/.env`:

```
# Configuración de correo
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=tu-correo@gmail.com
SMTP_PASSWORD=tu-contraseña-o-contraseña-de-aplicación
SMTP_ENCRYPTION=tls

# Configuración de remitente y destinatario
MAIL_FROM_ADDRESS=tu-correo@gmail.com
MAIL_FROM_NAME="Nombre del remitente"
MAIL_TO_ADDRESS=destinatario@gmail.com
MAIL_TO_NAME="Nombre del destinatario"
```

### Personalización del Contenido
- Los productos se pueden modificar en el archivo `frontend/components/Products.js`
- El contenido de "Sobre Nosotros" se encuentra en `frontend/index.html`
- La información de contacto se puede actualizar en `frontend/index.html`

## Pruebas

### Pruebas Manuales
1. Verificar que todos los enlaces funcionen correctamente
2. Probar el carrito de compras (agregar, modificar, eliminar productos)
3. Probar el formulario de contacto
4. Verificar que los pedidos se procesen correctamente
5. Probar la responsividad en diferentes dispositivos

### Pruebas Automatizadas
Se pueden ejecutar scripts de prueba en el directorio `backend`:
- `php check-production.php` - Verificación de configuración
- `php dev-contact-test.php` - Prueba de contacto en desarrollo

## Solución de Problemas

### Problemas Comunes

#### El formulario de contacto no funciona
1. Verificar que las credenciales SMTP estén correctamente configuradas
2. Asegurarse de que la verificación en dos pasos esté activada en la cuenta de Gmail
3. Confirmar que se esté usando una contraseña de aplicación, no la contraseña normal

#### El carrito no se muestra correctamente
1. Verificar que JavaScript esté habilitado en el navegador
2. Confirmar que el navegador sea compatible con localStorage
3. Revisar la consola del navegador en busca de errores

#### Las imágenes no se cargan
1. Verificar que las URLs de las imágenes sean accesibles
2. Confirmar que haya conexión a internet
3. Revisar la consola del navegador en busca de errores de carga

## Mantenimiento

### Actualización de Dependencias
- Ejecutar `npm update` en el directorio `backend` para actualizar dependencias de Node.js
- Ejecutar `composer update` en el directorio `backend` para actualizar dependencias de PHP

### Monitoreo
- Verificar regularmente los logs del servidor
- Asegurarse de que el servicio esté funcionando correctamente
- Monitorear el uso de recursos del servidor

## Contribución

Para contribuir al proyecto:

1. Crear una rama feature desde `development`
2. Realizar los cambios necesarios
3. Ejecutar pruebas para asegurar que no se introduzcan errores
4. Crear un Pull Request hacia la rama `development`
5. Esperar revisión y aprobación del código

## Licencia

Este proyecto es de código cerrado y pertenece a Arreglos Victoria Florería. Todos los derechos reservados.
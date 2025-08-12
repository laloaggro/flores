# Arreglos Victoria Florería

Sistema de e-commerce para una florería que permite a los clientes navegar por productos, agregar artículos al carrito y realizar pedidos.

## Características

- Catálogo de productos con imágenes
- Sistema de carrito de compras
- Proceso de checkout
- Sistema de autenticación de usuarios
- Panel de administración
- Formulario de contacto

## Tecnologías utilizadas

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome para iconos
- Google Fonts

### Backend
- Node.js
- Express.js
- SQLite3 para base de datos
- Nodemailer para envío de correos
- Bcrypt para hashing de contraseñas

## Instalación local

1. Clonar el repositorio:
```bash
git clone <repositorio-url>
cd flores
```

2. Instalar dependencias del backend:
```bash
cd backend
npm install
```

3. Iniciar el servidor:
```bash
npm start
```

4. Acceder a la aplicación en `http://localhost:5000`

## Despliegue

### Opción 1: Railway (recomendado - todo en un solo lugar)

1. Crear una cuenta en [Railway](https://railway.app)
2. Crear un nuevo proyecto
3. Conectar tu repositorio de GitHub
4. Seleccionar el proyecto y desplegar
5. Railway automáticamente detectará la configuración y desplegará la aplicación

El archivo `railway.json` ya está configurado para:
- Usar Nixpacks como builder
- Ejecutar `npm start` en el directorio backend
- Usar el puerto definido por la variable de entorno `PORT` o 5000 por defecto

### Opción 2: Vercel + Railway (frontend y backend separados)

#### Backend en Railway:
1. Crear una cuenta en [Railway](https://railway.app)
2. Crear un nuevo proyecto
3. Conectar tu repositorio de GitHub
4. Seleccionar el directorio `backend`
5. Configurar las variables de entorno necesarias

#### Frontend en Vercel:
1. Crear una cuenta en [Vercel](https://vercel.com)
2. Crear un nuevo proyecto
3. Conectar tu repositorio de GitHub
4. Seleccionar el directorio `frontend`
5. Configurar las variables de entorno si es necesario

Después de desplegar ambos servicios, actualiza la URL del backend en el archivo `frontend/assets/js/utils.js`:
```javascript
// Cambiar esta línea por la URL real de tu backend desplegado
return 'https://tu-app-backend-production.up.railway.app';
```

## Variables de entorno

Crea un archivo `.env` en el directorio `backend` con las siguientes variables (ver `.env.example`):

```
PORT=5000
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion
EMAIL_FROM=tu_correo@gmail.com
```

## Estructura del proyecto

```
├── backend/
│   ├── routes/
│   ├── data/
│   ├── server.js
│   └── products.db
├── frontend/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── index.html
│   └── ...
├── README.md
└── ...
```

## Desarrollo

Para iniciar el servidor en modo desarrollo:
```bash
cd backend
npm run dev
```

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir qué te gustaría cambiar.

## Licencia

ISC
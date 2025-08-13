# Arreglos Victoria Florería

Sistema de e-commerce para una florería que permite a los clientes navegar por productos, agregar artículos al carrito y realizar pedidos.

## Características

- Catálogo de productos con imágenes
- Sistema de carrito de compras
- Proceso de checkout
- Sistema de autenticación de usuarios
- Panel de administración
- Formulario de contacto
- Testimonios de clientes
- Animaciones y efectos visuales mejorados

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

### Opción 1: Render (recomendado como alternativa gratuita a Railway)

1. Crear una cuenta en [Render](https://render.com)
2. Crear un nuevo Web Service
3. Conectar tu repositorio de GitHub
4. Configurar las siguientes opciones:
   - Nombre: arreglos-victoria-backend
   - Entorno: Node
   - Región: Oregon (o la de tu preferencia)
   - Branch: main
   - Root Directory: backend
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Agregar las variables de entorno necesarias en la sección "Advanced" (ver sección de variables de entorno)
6. Hacer clic en "Create Web Service"

### Opción 2: Railway (antes de que termine la prueba gratuita)

1. Crear una cuenta en [Railway](https://railway.app)
2. Crear un nuevo proyecto
3. Conectar tu repositorio de GitHub
4. Seleccionar el proyecto y desplegar
5. Railway automáticamente detectará la configuración y desplegará la aplicación

El archivo `railway.json` ya está configurado para:
- Usar Nixpacks como builder
- Ejecutar `npm start` en el directorio backend
- Usar el puerto definido por la variable de entorno `PORT` o 5000 por defecto

### Opción 3: Vercel + Render (frontend y backend separados)

#### Backend en Render:
1. Crear una cuenta en [Render](https://render.com)
2. Crear un nuevo Web Service
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
// O si usas Render:
return 'https://arreglos-victoria-backend.onrender.com';
```

## Opciones de Hosting Gratuito

### 1. Vercel (Recomendado para frontend)
- **Ventajas**: 
  - Despliegue automático desde GitHub
  - Dominio gratuito (tusitio.vercel.app)
  - SSL gratuito
  - Muy rápido para sitios estáticos
- **Limitaciones**: 
  - 100GB de ancho de banda mensual
  - Solo para frontend

### 2. Netlify (Excelente para frontend)
- **Ventajas**:
  - Despliegue automático desde Git
  - Dominio gratuito
  - SSL automático
  - Funciones serverless incluidas
- **Limitaciones**:
  - 100GB de ancho de banda mensual
  - Solo para frontend

### 3. Render (Para backend y frontend)
- **Ventajas**:
  - Puede ejecutar tu backend Node.js
  - Integración con GitHub
  - Plan gratuito generoso
  - Fácil de usar
- **Limitaciones**:
  - Las aplicaciones web gratuitas duermen después de 15 minutos de inactividad

### 4. Railway (Para backend y frontend)
- **Ventajas**:
  - Puede ejecutar tu backend Node.js
  - Integración con GitHub
  - $5 en créditos gratuitos mensuales
  - Fácil de usar
- **Limitaciones**:
  - Sin créditos, las aplicaciones duermen después de 1 hora de inactividad
  - La prueba gratuita ha terminado

### 5. Heroku (Para backend)
- **Ventajas**:
  - Plataforma establecida
  - Fácil de usar
- **Limitaciones**:
  - Requiere tarjeta de crédito
  - Las aplicaciones duermen después de 30 minutos de inactividad

### 6. GitHub Pages (Solo para frontend)
- **Ventajas**:
  - Totalmente gratuito
  - Integración directa con GitHub
  - Fácil de configurar
- **Limitaciones**:
  - Solo para sitios estáticos
  - No puedes ejecutar tu backend Node.js aquí

## Recomendación para tu proyecto

Dado que tu proyecto tiene tanto frontend como backend, recomiendo esta combinación:

1. **Frontend**: Vercel o Netlify (muy fáciles de configurar)
2. **Backend**: Render (como alternativa gratuita a Railway)

## Variables de entorno

Crea un archivo `.env` en el directorio `backend` con las siguientes variables (ver `.env.example`):

```
PORT=5000
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion
EMAIL_FROM=tu_correo@gmail.com
```

En Render, configura estas variables en la sección "Advanced" al crear tu Web Service.

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

## Mejoras implementadas

### 1. Mejoras visuales y de experiencia de usuario
- Animaciones CSS para mejorar la experiencia visual
- Efectos de desplazamiento y transiciones suaves
- Diseño de tarjetas de productos mejorado
- Galería de flores con efectos visuales

### 2. Funcionalidades mejoradas
- Sistema de carrito de compras mejorado
- Testimonios de clientes para generar confianza
- Mejor manejo de errores de imágenes
- Notificaciones visuales mejoradas

### 3. Optimizaciones de rendimiento
- Carga diferida de imágenes
- Mejor organización del código
- Uso eficiente de recursos

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
const express = require('express');
const { config } = require('dotenv');
const path = require('path');
const fs = require('fs');

// Crear un stream de escritura para el archivo de logs
const logStream = fs.createWriteStream(path.join(__dirname, 'server.log'), { flags: 'a' });

// Función para registrar mensajes en el archivo de logs
function logMessage(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    logStream.write(logEntry);
    console.log(message); // También mostrar en consola
}

// Cargar variables de entorno
config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configurar middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads')); // Servir archivos subidos

// Configurar CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Manejar solicitudes preflight
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Configurar Google OAuth
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// Crear directorio de subidas si no existe
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware para registrar solicitudes
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${req.method} ${req.url} - IP: ${req.ip}`;
    logMessage(logEntry);
    next();
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));

// Importar manejador de errores
const { globalErrorHandler } = require('./middleware/errorHandler');

// Rutas
const contactRoutes = require('./routes/contact');
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders');
const reviewsRouter = require('./routes/reviews');
const wishlistRouter = require('./routes/wishlist');
const analyticsRouter = require('./routes/analytics');
const cartRouter = require('./routes/cart');

app.use('/api/contact', (req, res, next) => {
    logMessage(`Ruta /api/contact accedida con método ${req.method}`);
    next();
}, contactRoutes);

app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/cart', cartRouter);

// Ruta de prueba para verificar que las rutas de usuarios estén montadas
app.get('/api/users/test', (req, res) => {
    res.status(200).json({ message: 'Rutas de usuarios montadas correctamente' });
});

// Ruta para servir el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Middleware para manejar errores
app.use(globalErrorHandler);

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `No se puede encontrar ${req.originalUrl} en este servidor`
    });
});

// Iniciar el servidor
const server = app.listen(PORT, () => {
    const message = `🚀 Servidor backend corriendo en http://localhost:${PORT}`;
    logMessage(message);
    console.log(message);
});

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
    const message = `❌ Error no capturado: ${err.message}\n${err.stack}`;
    logMessage(message);
    console.error(message);
    
    // Cerrar el servidor y salir
    server.close(() => {
        process.exit(1);
    });
});

process.on('unhandledRejection', (reason, promise) => {
    const message = `❌ Promesa rechazada no manejada: ${reason}`;
    logMessage(message);
    console.error(message);
    
    // Cerrar el servidor y salir
    server.close(() => {
        process.exit(1);
    });
});
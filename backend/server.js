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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

// Rutas
const contactRoutes = require('./routes/contact');
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');

app.use('/api/contact', (req, res, next) => {
    logMessage(`Ruta /api/contact accedida con método ${req.method}`);
    next();
}, contactRoutes);

app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);

// Ruta para servir el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    const message = `🚀 Servidor backend corriendo en http://localhost:${PORT}`;
    logMessage(message);
    console.log(message);
});

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
    const message = `❌ Error no capturado: ${err.message}\n${err.stack}`;
    logMessage(message);
    console.error(message);
});

process.on('unhandledRejection', (reason, promise) => {
    const message = `❌ Promesa rechazada no manejada: ${reason}`;
    logMessage(message);
    console.error(message);
});
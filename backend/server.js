const express = require('express');
const dotenv = require('dotenv');
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
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para parsear el body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Proxy para cargar imágenes de Unsplash y evitar problemas de CORS
app.get('/api/image-proxy', async (req, res) => {
    const { url } = req.query;
    
    if (!url) {
        return res.status(400).json({ error: 'URL es requerida' });
    }
    
    try {
        // Verificar que la URL sea de Unsplash
        const unsplashUrl = new URL(url);
        if (unsplashUrl.hostname !== 'images.unsplash.com') {
            return res.status(400).json({ error: 'Solo se permiten URLs de Unsplash' });
        }
        
        // Hacer la solicitud a Unsplash
        const response = await fetch(url);
        
        if (!response.ok) {
            return res.status(response.status).json({ error: 'Error al cargar la imagen' });
        }
        
        // Obtener el tipo de contenido
        const contentType = response.headers.get('content-type');
        
        // Establecer los headers apropiados
        res.set('Content-Type', contentType);
        res.set('Cache-Control', 'public, max-age=31536000'); // Caché de 1 año
        
        // Enviar la imagen
        const buffer = await response.buffer();
        res.send(buffer);
    } catch (error) {
        console.error('Error al cargar imagen desde Unsplash:', error);
        res.status(500).json({ error: 'Error al cargar la imagen' });
    }
});

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
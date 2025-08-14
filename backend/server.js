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

// Usar el puerto proporcionado por Render o Railway, o 5000 por defecto
const PORT = process.env.PORT || 5000;

const app = express();

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

// Configurar CORS para producción
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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

// Proxy para cargar imágenes externas y evitar problemas de CORS
app.get('/api/image-proxy', async (req, res) => {
    const { url } = req.query;
    
    if (!url) {
        return res.status(400).json({ error: 'URL es requerida' });
    }
    
    try {
        // Verificar que sea una URL válida
        const imageUrl = new URL(url);
        
        // Hacer la solicitud a la imagen
        const response = await fetch(url);
        
        if (!response.ok) {
            // Si falla la carga de la imagen externa, usar una imagen local de respaldo
            console.warn(`Error al cargar imagen desde ${url}: ${response.status}`);
            return res.redirect('/assets/images/default-avatar.svg');
        }
        
        // Obtener el tipo de contenido
        const contentType = response.headers.get('content-type');
        
        // Verificar que sea una imagen
        if (!contentType || !contentType.startsWith('image/')) {
            console.warn(`La URL no apunta a una imagen válida: ${url}`);
            return res.redirect('/assets/images/default-avatar.svg');
        }
        
        // Establecer los headers apropiados
        res.set('Content-Type', contentType);
        res.set('Cache-Control', 'public, max-age=31536000'); // Caché de 1 año
        
        // Enviar la imagen
        const buffer = await response.buffer();
        res.send(buffer);
    } catch (error) {
        console.error('Error al cargar imagen:', error);
        // En caso de error, redirigir a una imagen local de respaldo
        return res.redirect('/assets/images/default-avatar.svg');
    }
});

// Ruta para servir el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Ruta para servir cualquier archivo HTML
app.get('/:page.html', (req, res) => {
    const page = req.params.page;
    const allowedPages = ['index', 'products', 'login', 'profile', 'admin', 'checkout', 'order-confirmation'];
    
    if (allowedPages.includes(page)) {
        res.sendFile(path.join(__dirname, '../frontend', `${page}.html`));
    } else {
        res.status(404).send('Página no encontrada');
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    const message = `🚀 Servidor backend corriendo en http://localhost:${PORT}`;
    logMessage(message);
    console.log(message);
    
    // Mostrar mensaje adicional en producción
    if (process.env.NODE_ENV === 'production') {
        console.log(`Entorno: Producción`);
        console.log(`Puerto: ${PORT}`);
    }
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
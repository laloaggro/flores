const express = require('express');
const { config } = require('dotenv');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');

// Importar el nuevo sistema de logging
const { logInfo, logError, logHttpRequest, logApplicationError } = require('./utils/logger');

// Importar middleware para manejar solicitudes de DevTools
const { handleDevToolsRequests } = require('./middleware/devtoolsHandler');

// Cargar variables de entorno
config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configurar rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 500, // aumentar límite a 500 solicitudes por ventana
  message: {
    error: 'Demasiadas solicitudes desde esta IP, por favor intenta nuevamente más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Aplicar rate limiting a todas las solicitudes
app.use(limiter);

// Configurar Helmet para seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdnjs.cloudflare.com"],
      scriptSrcAttr: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "data:"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "http://localhost:5000", "http://localhost:3006"],
    },
  },
  // Añadir protección contra XSS adicional
  xssFilter: true,
  // Añadir protección contra sniffing de MIME
  noSniff: true,
  // Añadir protección contra framing
  frameguard: { action: 'deny' },
  // Añadir protección HSTS
  hsts: {
    maxAge: 31536000, // 1 año
    includeSubDomains: true,
    preload: true
  }
}));

// Configurar compresión GZIP
app.use(compression());

// Configurar middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads')); // Servir archivos subidos

// Middleware para manejar solicitudes de herramientas de desarrollo
app.use(handleDevToolsRequests);

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
    // Registrar inicio de solicitud
    logHttpRequest(req.method, req.url, req.ip);
    
    // Registrar cuando la solicitud se complete
    const originalSend = res.send;
    res.send = function(body) {
        // No registrar solicitudes de DevTools como errores
        const isDevToolRequest = req.path.includes('.well-known') || 
                                req.path.includes('favicon.ico') ||
                                req.path.includes('robots.txt');
        
        if (!isDevToolRequest) {
            logHttpRequest(req.method, req.url, req.ip, res.statusCode);
        }
        originalSend.call(this, body);
    };
    
    next();
});

// Configurar rutas para servir archivos estáticos
const staticPaths = [
  { route: '/assets', path: '../dev/assets' },
  { route: '/components', path: '../dev/components' },
  { route: '/pages', path: '../dev/pages' },
  { route: '/images', path: '../dev/assets/images' }, // Ruta específica para imágenes
  { route: '/css', path: '../dev/assets/css' },       // Ruta específica para CSS
  { route: '/js', path: '../dev/assets/js' }          // Ruta específica para JS
];

staticPaths.forEach(staticPath => {
  app.use(staticPath.route, express.static(path.join(__dirname, staticPath.path)));
});

// Manejar solicitudes para archivos de imagen específicos
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];

imageExtensions.forEach(ext => {
  app.get(`/assets/images/*${ext}`, (req, res) => {
    const imagePath = req.path.replace('/assets', '../dev/assets');
    const filePath = path.join(__dirname, imagePath);
    
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({
        status: 'fail',
        message: `No se puede encontrar la imagen: ${req.originalUrl}`
      });
    }
  });
});

// Servir el archivo utils.js con la ruta correcta
app.get('/js/utils.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../dev/assets/js/utils.js'));
});

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
const docsRouter = require('./routes/docs');

app.use('/api/contact', (req, res, next) => {
    logInfo(`Ruta /api/contact accedida con método ${req.method}`);
    next();
}, contactRoutes);

app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/docs', docsRouter);

// Ruta de prueba para verificar que las rutas de usuarios estén montadas
app.get('/api/users/test', (req, res) => {
    res.status(200).json({ message: 'Rutas de usuarios montadas correctamente' });
});

// Ruta para servir el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../dev/index.html'));
});

// Ruta para servir login.html
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../dev/pages/login.html'));
});

// Manejar todas las demás rutas no encontradas
app.use('*', (req, res) => {
    // Verificar si es una solicitud de DevTools
    const isDevToolRequest = req.path.includes('.well-known') || 
                            req.path.includes('favicon.ico') ||
                            req.path.includes('robots.txt');
    
    if (isDevToolRequest) {
        // No registrar como error y simplemente devolver 404
        return res.status(404).send('Not Found');
    }
    
    const message = `No se puede encontrar ${req.originalUrl} en este servidor`;
    logApplicationError('Ruta no encontrada', null, { 
        url: req.originalUrl, 
        method: req.method, 
        ip: req.ip 
    });
    
    res.status(404).json({
        status: 'fail',
        message
    });
});

// Middleware para manejar errores
app.use(globalErrorHandler);

// Iniciar el servidor
const server = app.listen(PORT, () => {
    const message = `🚀 Servidor backend corriendo en http://localhost:${PORT}`;
    logInfo(message);
    console.log(message);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        const message = `❌ El puerto ${PORT} está ocupado. Intentando con el puerto ${PORT + 1}...`;
        logError(message, err);
        console.error(message);
        
        // Intentar con el siguiente puerto
        app.listen(PORT + 1, () => {
            const newMessage = `🚀 Servidor backend corriendo en http://localhost:${PORT + 1}`;
            logInfo(newMessage);
            console.log(newMessage);
        });
    } else {
        const message = `❌ Error al iniciar el servidor: ${err.message}`;
        logError(message, err);
        console.error(message);
        process.exit(1);
    }
});

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
    const message = `❌ Error no capturado: ${err.message}`;
    logError(message, err);
    console.error(message, err);
    
    // Cerrar el servidor y salir
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

process.on('unhandledRejection', (reason, promise) => {
    const message = `❌ Promesa rechazada no manejada: ${reason}`;
    logError(message, reason instanceof Error ? reason : new Error(String(reason)));
    console.error(message, reason);
    
    // Cerrar el servidor y salir
    server.close(() => {
        process.exit(1);
    });
});

// Manejar cierre limpio de la aplicación
process.on('SIGTERM', () => {
    logInfo('Recibida señal SIGTERM. Cerrando servidor...');
    server.close(() => {
        logInfo('Servidor cerrado correctamente');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logInfo('Recibida señal SIGINT. Cerrando servidor...');
    server.close(() => {
        logInfo('Servidor cerrado correctamente');
        process.exit(0);
    });
});
const express = require('express');
const { config } = require('dotenv');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');

// Importar el nuevo sistema de logging
const { logInfo, logError, logHttpRequest, logApplicationError } = require('./utils/logger');

// Importar configuración de seguridad
const { corsMiddleware, cspMiddleware } = require('./config/security');

// Cargar variables de entorno
config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configurar rate limiting
const env = process.env.NODE_ENV || 'development';
const securityConfig = require('./config/security').getSecurityConfig(env);

const limiter = rateLimit({
  windowMs: securityConfig.rateLimit.windowMs,
  max: securityConfig.rateLimit.max,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Configurar middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads')); // Servir archivos subidos

// Configurar Content-Security-Policy
app.use(cspMiddleware);

// Configurar CORS usando la nueva configuración
app.use(corsMiddleware);

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
        logHttpRequest(req.method, req.url, req.ip, res.statusCode);
        originalSend.call(this, body);
    };
    
    next();
});

// Ruta para servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Servir el archivo utils.js con la ruta correcta
app.get('/components/assets/js/utils.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/assets/js/utils.js'));
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

// Ruta de prueba para verificar que las rutas de usuarios estén montadas
app.get('/api/users/test', (req, res) => {
    res.status(200).json({ message: 'Rutas de usuarios montadas correctamente' });
});

// Middleware de manejo de errores global
app.use(globalErrorHandler);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en el puerto ${PORT}`);
    logInfo(`Servidor backend iniciado en el puerto ${PORT}`);
});

module.exports = app;
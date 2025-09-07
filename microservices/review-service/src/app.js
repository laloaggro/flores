const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const { router, setDatabase } = require('./routes/reviews');
const { connectToDatabase } = require('./config/database');
const Review = require('./models/Review');
// Utilidad JWT compartida - ruta corregida
const { verifyToken } = require('./../../shared/security/jwt');

// Crear aplicación Express
const app = express();

// Middleware de seguridad
app.use(helmet());

// Middleware CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));

// Middleware de rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta nuevamente más tarde.'
});
app.use(limiter);

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/reviews', router);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Servicio de Reseñas funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
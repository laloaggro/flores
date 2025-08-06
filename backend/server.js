const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

// Crear la aplicación Express
const app = express();

// Configurar CORS con opciones específicas
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como desde Postman)
    if (!origin) return callback(null, true);
    
    // Permitir solicitudes desde localhost (para desarrollo)
    if (origin.startsWith('http://localhost') || origin.startsWith('https://localhost')) {
      return callback(null, true);
    }
    
    // Permitir solicitudes desde el dominio del frontend
    if (origin === 'https://arreglosvictoria.cl') {
      return callback(null, true);
    }
    
    // Rechazar otras solicitudes
    callback(new Error('No permitido por CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Usar middleware CORS
app.use(cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json());

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/contact', require('./routes/contact'));

// Ruta para servir la aplicación frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Puerto del servidor
const PORT = process.env.PORT || 5000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`📄 Documentación de la API: http://localhost:${PORT}/api/docs (próximamente)`);
});
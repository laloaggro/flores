const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);

// Endpoint temporal para verificar variables de entorno
app.get('/api/debug/env', (req, res) => {
  res.json({
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD ? '[CONFIGURADO]' : '[NO CONFIGURADO]',
    hasEnvFile: !!process.env.SMTP_HOST
  });
});

// Servir archivos estáticos
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`📄 Documentación de la API: http://localhost:${PORT}/api/docs (próximamente)`);
});
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const contactRouter = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/contact', contactRouter);

// Ruta principal
app.get('/', (req, res) => {
  res.send('🌸 API de Arreglos Victoria - Activada');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`📄 Documentación de la API: http://localhost:${PORT}/api/docs (próximamente)`);
});
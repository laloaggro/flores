const express = require('express');
const AuthController = require('../controllers/authController');
const db = require('../config/database');

const router = express.Router();

// Crear instancia del controlador
const authController = new AuthController(db);

// Definir rutas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Ruta raíz
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Servicio de Autenticación - Arreglos Victoria',
    version: '1.0.0'
  });
});

module.exports = router;
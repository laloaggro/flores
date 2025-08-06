const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Ruta para crear una nueva orden
router.post('/', orderController.createOrder);

// Ruta para obtener todas las órdenes
router.get('/', orderController.getAllOrders);

module.exports = router;

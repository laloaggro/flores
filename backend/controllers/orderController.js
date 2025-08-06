// Controlador para manejar operaciones de órdenes
const Order = require('../models/Order');

// Crear una nueva orden
const createOrder = (req, res) => {
  try {
    const { customerName, customerEmail, products, totalAmount } = req.body;
    
    // Validar datos requeridos
    if (!customerName || !customerEmail || !products || !totalAmount) {
      return res.status(400).json({ 
        message: 'Faltan datos requeridos para crear la orden' 
      });
    }
    
    // En una aplicación real, aquí se guardaría en la base de datos
    const newOrder = {
      id: Date.now(), // ID temporal
      customerName,
      customerEmail,
      products,
      totalAmount,
      orderDate: new Date().toISOString(),
      status: 'pending'
    };
    
    res.status(201).json({ 
      message: 'Orden creada exitosamente', 
      order: newOrder 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al crear la orden', 
      error: error.message 
    });
  }
};

// Obtener todas las órdenes
const getAllOrders = (req, res) => {
  try {
    // En una aplicación real, aquí se obtendrían de la base de datos
    const orders = [];
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener las órdenes', 
      error: error.message 
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders
};
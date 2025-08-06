// Controlador para manejar operaciones de productos
const Product = require('../models/Product');

// Obtener todos los productos
const getAllProducts = (req, res) => {
  try {
    // Esta es una implementación de ejemplo
    // En una aplicación real, aquí se conectaría a la base de datos
    const products = [
      {
        id: 1,
        name: "Ramo de Rosas",
        price: 25.99,
        description: "Hermoso ramo de rosas rojas frescas",
        image: "ramo-rosas.jpg"
      },
      {
        id: 2,
        name: "Arreglo de Tulipanes",
        price: 30.99,
        description: "Elegante arreglo de tulipanes de varios colores",
        image: "arreglo-tulipanes.jpg"
      }
    ];
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
  }
};

// Obtener un producto por ID
const getProductById = (req, res) => {
  try {
    const productId = req.params.id;
    // En una aplicación real, aquí se buscaría en la base de datos
    const product = {
      id: productId,
      name: "Producto de ejemplo",
      price: 50.00,
      description: "Descripción del producto de ejemplo",
      image: "producto-ejemplo.jpg"
    };
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById
};
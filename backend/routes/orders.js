const express = require('express');
const router = express.Router();

let orders = [];

router.post('/create', (req, res) => {
  const newOrder = { id: Date.now(), ...req.body };
  orders.push(newOrder);
  console.log('Nuevo pedido:', newOrder);
  res.status(201).json(newOrder);
});

router.get('/', (req, res) => {
  res.json(orders);
});

module.exports = router;

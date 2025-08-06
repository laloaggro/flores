const express = require('express');
const router = express.Router();

const products = [
  { id: 1, name: "Rosas Rojas", price: 85, image_url: "https://res.cloudinary.com/dkzmsk7qv/image/upload/v1719500000/rosas-rojas.jpg" },
  { id: 2, name: "Tulipanes", price: 120, image_url: "https://res.cloudinary.com/dkzmsk7qv/image/upload/v1719500000/tulipanes.jpg" },
  { id: 3, name: "Orquídeas", price: 150, image_url: "https://res.cloudinary.com/dkzmsk7qv/image/upload/v1719500000/orquideas.jpg" }
];

router.get('/', (req, res) => {
  res.json(products);
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { sendContactMessage } = require('../controllers/contactController');

// Ruta para enviar mensaje de contacto
router.post('/send-message', sendContactMessage);

module.exports = router;
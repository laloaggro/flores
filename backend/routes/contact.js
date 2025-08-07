const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const path = require('path');

router.post('/', (req, res) => {
  // Obtener los datos del cuerpo de la solicitud
  const { name, email, phone, message } = req.body;
  
  // Validar los datos
  if (!name || !email || !message) {
    return res.status(400).json({ 
      message: 'Faltan campos requeridos',
      status: 'error'
    });
  }
  
  // Validar formato de correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      message: 'Formato de correo electrónico inválido',
      status: 'error'
    });
  }
  
  // Preparar los datos para pasar al script PHP
  const formData = JSON.stringify({ name, email, phone, message });
  
  // Ejecutar el script PHP mejorado
  const phpScriptPath = path.join(__dirname, '../contact-enhanced.php');
  const command = `echo '${formData}' | php ${phpScriptPath}`;
  
  exec(command, (error, stdout, stderr) => {
    // Registrar información de depuración
    console.log('Comando ejecutado:', command);
    console.log('Salida estándar:', stdout);
    console.log('Error estándar:', stderr);
    console.log('Error de ejecución:', error);
    
    if (error) {
      console.error(`Error ejecutando script PHP: ${error}`);
      return res.status(500).json({
        message: 'Error al procesar el formulario. Por favor, inténtalo de nuevo más tarde.',
        status: 'error'
      });
    }
    
    if (stderr) {
      console.error(`Error PHP: ${stderr}`);
      // No retornar inmediatamente, ya que algunos warnings pueden estar en stderr
      // pero la ejecución puede haber sido exitosa
    }
    
    try {
      const result = JSON.parse(stdout);
      res.status(result.status === 'success' ? 200 : 500).json(result);
    } catch (parseError) {
      console.error(`Error parseando respuesta: ${parseError}`);
      console.error('Salida recibida:', stdout);
      res.status(500).json({
        message: 'Error al procesar la respuesta del servidor.',
        status: 'error'
      });
    }
  });
});

module.exports = router;
const path = require('path');
const fs = require('fs');

/**
 * Middleware para manejar solicitudes de herramientas de desarrollo
 * Evita registrar errores innecesarios para solicitudes de DevTools
 */

// Rutas conocidas de herramientas de desarrollo que no deben generar logs de error
const DEVTOOLS_PATHS = [
  '.well-known',
  'robots.txt',
  '__webpack_hmr',
  'webpack-hmr',
  'sockjs-node',
  'react-devtools',
  'vue-devtools'
];

/**
 * Middleware para manejar solicitudes de herramientas de desarrollo
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función next
 */
const handleDevToolsRequests = (req, res, next) => {
  // Manejar solicitud de favicon
  if (req.path.includes('favicon.ico')) {
    // Ruta al favicon en la nueva ubicación centralizada
    const faviconPath = path.join(__dirname, '../../assets/images/favicon.ico');
    
    // Verificar si el archivo existe
    if (fs.existsSync(faviconPath)) {
      // Servir el favicon
      return res.sendFile(faviconPath);
    } else {
      // Si no existe, devolver 404
      return res.status(404).send('Not Found');
    }
  }
  
  // Verificar si la solicitud es para otras rutas de herramientas de desarrollo
  const isDevToolRequest = DEVTOOLS_PATHS.some(path => 
    req.path.includes(path)
  );
  
  if (isDevToolRequest) {
    // Para solicitudes de DevTools, simplemente devolver 404 sin registrar error
    return res.status(404).send('Not Found');
  }
  
  // Para otras solicitudes, continuar con el procesamiento normal
  next();
};

module.exports = { handleDevToolsRequests };
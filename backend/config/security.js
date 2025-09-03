/**
 * security.js - Configuración de seguridad para la aplicación
 * 
 * Este archivo contiene configuraciones de seguridad para diferentes entornos
 * y funciones para aplicarlas a la aplicación Express.
 */

// Configuración de seguridad por entorno
const securityConfig = {
  development: {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
      credentials: true
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 1000 // límite de 1000 solicitudes por ventana
    }
  },
  production: {
    cors: {
      origin: ['https://arreglosvictoria.cl', 'https://www.arreglosvictoria.cl'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
      credentials: true
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100 // límite de 100 solicitudes por ventana para producción
    }
  }
};

/**
 * Obtiene la configuración de seguridad según el entorno
 * @param {string} environment - El entorno actual (development|production)
 * @returns {Object} Configuración de seguridad
 */
function getSecurityConfig(environment) {
  return securityConfig[environment] || securityConfig.development;
}

/**
 * Middleware para configurar CORS
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con el siguiente middleware
 */
function corsMiddleware(req, res, next) {
  const env = process.env.NODE_ENV || 'development';
  const config = getSecurityConfig(env);
  
  res.header('Access-Control-Allow-Origin', Array.isArray(config.cors.origin) ? config.cors.origin.join(', ') : config.cors.origin);
  res.header('Access-Control-Allow-Methods', config.cors.methods.join(', '));
  res.header('Access-Control-Allow-Headers', config.cors.allowedHeaders.join(', '));
  res.header('Access-Control-Allow-Credentials', config.cors.credentials);
  
  // Manejar solicitudes preflight
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
}

/**
 * Middleware para configurar Content-Security-Policy
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con el siguiente middleware
 */
function cspMiddleware(req, res, next) {
  const policy = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com https://accounts.google.com/gsi/",
    "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com https://accounts.google.com/gsi/",
    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://accounts.google.com/gsi/",
    "frame-src 'self' https://accounts.google.com/gsi/"
  ].join('; ');
  
  res.header('Content-Security-Policy', policy);
  next();
}

module.exports = {
  getSecurityConfig,
  corsMiddleware,
  cspMiddleware
};
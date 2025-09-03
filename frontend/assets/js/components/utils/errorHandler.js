/**
 * errorHandler.js - Manejo global de errores
 * 
 * Este módulo proporciona funciones para manejar errores de manera consistente
 * en toda la aplicación.
 */

/**
 * Manejador de errores global
 * @param {Error} error - Error que ocurrió
 * @param {string} context - Contexto donde ocurrió el error
 */
const handleGlobalError = (error, context = 'desconocido') => {
  console.error(`Error en ${context}:`, error);
  
  // Registrar el error (en producción se podría enviar a un servicio de logging)
  if (process.env.NODE_ENV === 'production') {
    // En producción, enviar el error a un servicio de logging
    logErrorToService(error, context);
  }
  
  // Mostrar notificación al usuario
  const { showNotification } = require('./utils.js');
  showNotification(
    'Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo más tarde.', 
    'error'
  );
};

/**
 * Manejar errores de red
 * @param {Error} error - Error de red
 * @param {string} operation - Operación que falló
 */
const handleNetworkError = (error, operation = 'la operación') => {
  console.error(`Error de red en ${operation}:`, error);
  
  const { showNotification } = require('./utils.js');
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    showNotification(
      'No se pudo conectar con el servidor. Por favor, verifique su conexión a internet.',
      'error'
    );
  } else {
    showNotification(
      `Error de red al ${operation}. Por favor, inténtelo de nuevo más tarde.`,
      'error'
    );
  }
};

/**
 * Manejar errores de validación
 * @param {Array|string} errors - Errores de validación
 */
const handleValidationError = (errors) => {
  const { showNotification } = require('./utils.js');
  
  if (Array.isArray(errors)) {
    errors.forEach(error => {
      showNotification(error, 'warning');
    });
  } else if (typeof errors === 'string') {
    showNotification(errors, 'warning');
  } else {
    showNotification('Error de validación en el formulario.', 'warning');
  }
};

/**
 * Registrar error en un servicio externo (solo en producción)
 * @param {Error} error - Error a registrar
 * @param {string} context - Contexto del error
 */
const logErrorToService = (error, context) => {
  // En una implementación real, esto enviaría el error a un servicio como Sentry
  // Por ahora, solo lo registramos en la consola
  console.log('Enviando error a servicio de logging:', { error, context });
};

/**
 * Manejar errores de autenticación
 * @param {Error} error - Error de autenticación
 */
const handleAuthError = (error) => {
  const { showNotification, logout } = require('./utils.js');
  
  if (error.status === 401 || error.message.includes('token')) {
    // Token expirado o inválido
    logout();
    showNotification('Su sesión ha expirado. Por favor, inicie sesión nuevamente.', 'warning');
  } else {
    showNotification('Error de autenticación. Por favor, verifique sus credenciales.', 'error');
  }
};

// Exportar todas las funciones
export {
  handleGlobalError,
  handleNetworkError,
  handleValidationError,
  handleAuthError
};
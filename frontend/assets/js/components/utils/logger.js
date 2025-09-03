/**
 * logger.js - Sistema de logging para el frontend
 * 
 * Este módulo proporciona funciones para registrar mensajes de registro,
 * advertencias y errores en el frontend. En producción, puede enviar
 * registros a un servicio externo.
 */

/**
 * Nivel de registro
 * @enum {string}
 */
const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

/**
 * Configuración del logger
 */
const loggerConfig = {
  // Nivel mínimo de registro (debug, info, warn, error)
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  
  // Si se deben enviar registros a un servicio externo en producción
  sendToExternalService: process.env.NODE_ENV === 'production',
  
  // URL del servicio de logging externo
  externalServiceUrl: '/api/logs'
};

/**
 * Verificar si un nivel de registro debe ser procesado
 * @param {string} level - Nivel de registro a verificar
 * @returns {boolean} - True si el nivel debe ser procesado
 */
const shouldLog = (level) => {
  const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
  const currentLevelIndex = levels.indexOf(loggerConfig.level);
  const messageLevelIndex = levels.indexOf(level);
  
  return messageLevelIndex >= currentLevelIndex;
};

/**
 * Registrar un mensaje de debug
 * @param {string} message - Mensaje a registrar
 * @param {Object} [data] - Datos adicionales
 */
const logDebug = (message, data = null) => {
  if (!shouldLog(LogLevel.DEBUG)) return;
  
  const logEntry = {
    level: LogLevel.DEBUG,
    message,
    data,
    timestamp: new Date().toISOString()
  };
  
  console.debug(`[DEBUG] ${message}`, data || '');
  sendLogToExternalService(logEntry);
};

/**
 * Registrar un mensaje de información
 * @param {string} message - Mensaje a registrar
 * @param {Object} [data] - Datos adicionales
 */
const logInfo = (message, data = null) => {
  if (!shouldLog(LogLevel.INFO)) return;
  
  const logEntry = {
    level: LogLevel.INFO,
    message,
    data,
    timestamp: new Date().toISOString()
  };
  
  console.info(`[INFO] ${message}`, data || '');
  sendLogToExternalService(logEntry);
};

/**
 * Registrar una advertencia
 * @param {string} message - Mensaje a registrar
 * @param {Object} [data] - Datos adicionales
 */
const logWarn = (message, data = null) => {
  if (!shouldLog(LogLevel.WARN)) return;
  
  const logEntry = {
    level: LogLevel.WARN,
    message,
    data,
    timestamp: new Date().toISOString()
  };
  
  console.warn(`[WARN] ${message}`, data || '');
  sendLogToExternalService(logEntry);
};

/**
 * Registrar un error
 * @param {string} message - Mensaje a registrar
 * @param {Object} [data] - Datos adicionales
 */
const logError = (message, data = null) => {
  if (!shouldLog(LogLevel.ERROR)) return;
  
  const logEntry = {
    level: LogLevel.ERROR,
    message,
    data,
    timestamp: new Date().toISOString()
  };
  
  console.error(`[ERROR] ${message}`, data || '');
  sendLogToExternalService(logEntry);
};

/**
 * Enviar registro a un servicio externo
 * @param {Object} logEntry - Entrada de registro
 */
const sendLogToExternalService = async (logEntry) => {
  // Solo enviar en producción si está habilitado
  if (!loggerConfig.sendToExternalService) return;
  
  try {
    // Enviar registro a un servicio externo
    await fetch(loggerConfig.externalServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(logEntry)
    });
  } catch (error) {
    // No hacer nada si falla el envío, para evitar bucles infinitos
    console.warn('No se pudo enviar el registro al servicio externo:', error);
  }
};

/**
 * Registrar una excepción
 * @param {Error} error - Error a registrar
 * @param {string} context - Contexto donde ocurrió el error
 */
const logException = (error, context = '') => {
  const logEntry = {
    level: LogLevel.ERROR,
    message: error.message,
    data: {
      context,
      stack: error.stack,
      name: error.name
    },
    timestamp: new Date().toISOString()
  };
  
  console.error(`[ERROR] ${context}: ${error.message}`, error.stack || '');
  sendLogToExternalService(logEntry);
};

// Exportar todas las funciones
export {
  LogLevel,
  logDebug,
  logInfo,
  logWarn,
  logError,
  logException
};
/**
 * Sistema de logging para la aplicación
 * Proporciona funciones para registrar diferentes tipos de mensajes
 */

const fs = require('fs');
const path = require('path');

// Crear directorio de logs si no existe
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Archivo de log
const logFile = path.join(logsDir, 'app.log');

/**
 * Formatear fecha para los logs
 * @returns {string} Fecha formateada
 */
function formatLogDate() {
    const now = new Date();
    return now.toISOString();
}

/**
 * Escribir mensaje en el archivo de log
 * @param {string} level - Nivel de log (INFO, ERROR, WARN, etc.)
 * @param {string} message - Mensaje a loguear
 * @param {Object} context - Contexto adicional
 */
function writeLog(level, message, context = null) {
    const timestamp = formatLogDate();
    const logEntry = {
        timestamp,
        level,
        message,
        context
    };
    
    // Escribir en archivo
    const logMessage = `${timestamp} [${level}] ${message}${context ? ` Context: ${JSON.stringify(context)}` : ''}\n`;
    fs.appendFileSync(logFile, logMessage);
    
    // También mostrar en consola para desarrollo
    if (process.env.NODE_ENV !== 'production') {
        console.log(`[${level}] ${message}`, context || '');
    }
}

/**
 * Registrar información
 * @param {string} message - Mensaje informativo
 * @param {Object} context - Contexto adicional
 */
function logInfo(message, context = null) {
    writeLog('INFO', message, context);
}

/**
 * Registrar errores
 * @param {string} message - Mensaje de error
 * @param {Error|Object} error - Error o contexto adicional
 */
function logError(message, error = null) {
    const context = error instanceof Error ? { 
        message: error.message, 
        stack: error.stack,
        name: error.name
    } : error;
    
    writeLog('ERROR', message, context);
}

/**
 * Registrar solicitudes HTTP
 * @param {string} method - Método HTTP
 * @param {string} url - URL de la solicitud
 * @param {string} ip - Dirección IP del cliente
 * @param {number} statusCode - Código de estado (opcional)
 */
function logHttpRequest(method, url, ip, statusCode = null) {
    // No registrar solicitudes de herramientas de desarrollo
    const devToolsPaths = ['.well-known', 'favicon.ico', 'robots.txt'];
    if (devToolsPaths.some(path => url.includes(path))) {
        return;
    }
    
    const message = statusCode 
        ? `[${method}] ${url} - IP: ${ip} - Status: ${statusCode}`
        : `[${method}] ${url} - IP: ${ip} - In progress`;
    
    writeLog(statusCode && statusCode >= 400 ? 'ERROR' : 'INFO', message);
}

/**
 * Registrar errores de aplicación
 * @param {string} message - Mensaje de error
 * @param {Error} error - Error
 * @param {Object} context - Contexto adicional
 */
function logApplicationError(message, error = null, context = null) {
    const errorContext = error instanceof Error ? { 
        message: error.message, 
        stack: error.stack,
        name: error.name
    } : error;
    
    const fullContext = { ...context, ...errorContext };
    writeLog('ERROR', `[APPLICATION_ERROR] ${message}`, fullContext);
}

module.exports = {
    logInfo,
    logError,
    logHttpRequest,
    logApplicationError
};
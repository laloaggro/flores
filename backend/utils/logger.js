const fs = require('fs');
const path = require('path');

// Crear directorio de logs si no existe
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Configurar archivos de log
const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });
const errorLogStream = fs.createWriteStream(path.join(logDir, 'error.log'), { flags: 'a' });
const appLogStream = fs.createWriteStream(path.join(logDir, 'application.log'), { flags: 'a' });

// Niveles de log
const LOG_LEVELS = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug'
};

// Función para formatear timestamps
function formatTimestamp() {
    return new Date().toISOString();
}

// Función para escribir logs de acceso
function logAccess(message) {
    const logEntry = `[${formatTimestamp()}] [ACCESS] ${message}\n`;
    accessLogStream.write(logEntry);
    console.log(`[ACCESS] ${message}`);
}

// Función para escribir logs de error
function logError(message, error = null) {
    const errorMessage = error ? `${message}: ${error.message}\n${error.stack}` : message;
    const logEntry = `[${formatTimestamp()}] [ERROR] ${errorMessage}\n`;
    errorLogStream.write(logEntry);
    
    // También escribir en consola para visibilidad inmediata
    console.error(`[ERROR] ${message}`, error);
}

// Función para escribir logs de aplicación
function logInfo(message) {
    const logEntry = `[${formatTimestamp()}] [INFO] ${message}\n`;
    appLogStream.write(logEntry);
    console.log(`[INFO] ${message}`);
}

// Función para escribir logs de debug
function logDebug(message) {
    // En producción, podríamos desactivar los logs de debug
    if (process.env.NODE_ENV !== 'production') {
        const logEntry = `[${formatTimestamp()}] [DEBUG] ${message}\n`;
        appLogStream.write(logEntry);
        console.debug(`[DEBUG] ${message}`);
    }
}

// Función para loggear solicitudes HTTP
function logHttpRequest(method, url, ip, statusCode = null) {
    const statusInfo = statusCode ? `Status: ${statusCode}` : 'In progress';
    logAccess(`${method} ${url} - IP: ${ip} - ${statusInfo}`);
}

// Función para loggear errores de la aplicación
function logApplicationError(message, error = null, context = {}) {
    const contextInfo = Object.keys(context).length > 0 ? `Context: ${JSON.stringify(context)}` : '';
    const errorMessage = `[APPLICATION_ERROR] ${message} ${contextInfo}`;
    logError(errorMessage, error);
}

// Función para cerrar los streams de log
function closeLogStreams() {
    accessLogStream.end();
    errorLogStream.end();
    appLogStream.end();
}

module.exports = {
    LOG_LEVELS,
    logAccess,
    logError,
    logInfo,
    logDebug,
    logHttpRequest,
    logApplicationError,
    closeLogStreams
};
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// Crear un stream de escritura para el archivo de logs
const logStream = fs.createWriteStream(path.join(__dirname, 'server.log'), { flags: 'a' });

// Función para registrar mensajes en el archivo de logs
function logMessage(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    logStream.write(logEntry);
    console.log(message); // También mostrar en consola
}

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para parsear el body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para registrar solicitudes
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${req.method} ${req.url} - IP: ${req.ip}`;
    logMessage(logEntry);
    next();
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));

// Función para ejecutar scripts PHP
function executePhpScript(scriptPath, req, res) {
    // Preparar los datos de la solicitud para pasar a PHP
    const requestData = {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body,
        query: req.query,
        session: req.session
    };
    
    // Convertir a JSON
    const jsonData = JSON.stringify(requestData);
    
    // Ejecutar el script PHP
    const php = spawn('php', [scriptPath]);
    
    let phpOutput = '';
    let phpError = '';
    
    // Enviar datos a PHP
    php.stdin.write(jsonData);
    php.stdin.end();
    
    // Capturar la salida de PHP
    php.stdout.on('data', (data) => {
        phpOutput += data.toString();
    });
    
    // Capturar errores de PHP
    php.stderr.on('data', (data) => {
        phpError += data.toString();
    });
    
    // Manejar el cierre del proceso PHP
    php.on('close', (code) => {
        if (code !== 0) {
            logMessage(`Error en script PHP (${code}): ${phpError}`);
            res.status(500).json({ error: 'Error en el servidor' });
            return;
        }
        
        try {
            // Intentar parsear la respuesta de PHP como JSON
            const response = JSON.parse(phpOutput);
            res.json(response);
        } catch (e) {
            // Si no es JSON, enviar como texto plano
            res.send(phpOutput);
        }
    });
}

// Ruta para manejar las solicitudes de la API de usuarios con PHP
app.all('/api/users/*', (req, res) => {
    // Crear un proceso PHP para manejar la solicitud
    const phpPath = process.env.PHP_PATH || 'php';
    const scriptPath = path.join(__dirname, 'php', path.basename(req.path) + '.php');
    
    // Verificar si el archivo PHP existe
    if (!fs.existsSync(scriptPath)) {
        // Si no existe el archivo PHP específico, usar un enrutador genérico
        const genericScriptPath = path.join(__dirname, 'php', 'router.php');
        if (fs.existsSync(genericScriptPath)) {
            executePhpScript(genericScriptPath, req, res);
        } else {
            res.status(404).json({ error: 'Endpoint no encontrado' });
        }
        return;
    }
    
    executePhpScript(scriptPath, req, res);
});

// Rutas
const contactRoutes = require('./routes/contact');
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');

app.use('/api/contact', (req, res, next) => {
    logMessage(`Ruta /api/contact accedida con método ${req.method}`);
    next();
}, contactRoutes);

app.use('/api/products', productsRouter);

// Ruta para servir el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    const message = `🚀 Servidor backend corriendo en http://localhost:${PORT}`;
    logMessage(message);
    console.log(message);
});

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
    const message = `❌ Error no capturado: ${err.message}\n${err.stack}`;
    logMessage(message);
    console.error(message);
});

process.on('unhandledRejection', (reason, promise) => {
    const message = `❌ Promesa rechazada no manejada: ${reason}`;
    logMessage(message);
    console.error(message);
});
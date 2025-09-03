const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

// Directorios base
const projectRoot = path.join(__dirname, '..');
const devDir = path.join(projectRoot, 'dev');

console.log('Iniciando entorno de desarrollo...\n');

// Verificar que exista el directorio de desarrollo
if (!fs.existsSync(devDir)) {
    console.error('Error: El directorio de desarrollo no existe');
    console.log('Por favor, ejecute primero el script de configuración:');
    console.log('node scripts/setup-dev-prod-structure.js');
    process.exit(1);
}

// Crear servidor de desarrollo simple
function startDevServer() {
    const PORT = 3004; // Cambiar a puerto 3004
    console.log(`Iniciando servidor de desarrollo en http://localhost:${PORT}`);
    console.log('Presione Ctrl+C para detener el servidor\n');
    
    const server = http.createServer((req, res) => {
        console.log(`Solicitud: ${req.method} ${req.url}`);
        
        const parsedUrl = url.parse(req.url);
        let pathname = parsedUrl.pathname;
        
        // Si es la raíz, servir index.html desde el directorio pages
        if (pathname === '/') {
            pathname = '/pages/index.html';
        }
        
        // Construir la ruta del archivo
        const filePath = path.join(devDir, pathname);
        console.log(`Ruta del archivo: ${filePath}`);
        
        // Servir el archivo
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(`Error al leer el archivo: ${err.message}`);
                // Si el archivo no existe, intentar servir index.html
                const indexPath = path.join(devDir, 'pages', 'index.html');
                if (fs.existsSync(indexPath)) {
                    fs.readFile(indexPath, (err, data) => {
                        if (err) {
                            res.writeHead(500);
                            res.end('Error interno del servidor');
                            return;
                        }
                        
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(data);
                    });
                } else {
                    res.writeHead(404);
                    res.end('Página no encontrada');
                }
                return;
            }
            
            // Determinar el tipo MIME correcto
            const contentType = mime.lookup(filePath) || 'application/octet-stream';
            console.log(`Tipo MIME: ${contentType}`);
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });
    
    server.listen(PORT, () => {
        console.log(`Entorno de desarrollo iniciado.`);
        console.log(`Acceda a http://localhost:${PORT} para ver su sitio web en desarrollo.`);
    });
    
    // Manejar errores del servidor
    server.on('error', (error) => {
        console.error('Error en el servidor:', error);
        process.exit(1);
    });
}

// Iniciar el servidor de desarrollo
startDevServer();
const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const mime = require('mime-types');

// Directorios base
const projectRoot = path.join(__dirname, '..');
const prodDir = path.join(projectRoot, 'prod');

console.log('Iniciando entorno de producción...\n');

// Verificar que exista el directorio de producción
if (!fs.existsSync(prodDir)) {
    console.error('Error: El directorio de producción no existe');
    process.exit(1);
}

// Crear servidor de producción simple
function startProdServer() {
    const PORT = 3003; // Puerto para producción
    console.log(`Iniciando servidor de producción en http://localhost:${PORT}`);
    console.log('Presione Ctrl+C para detener el servidor\n');
    
    const server = http.createServer((req, res) => {
        // Parsear la URL
        const parsedUrl = url.parse(req.url);
        let pathname = parsedUrl.pathname;
        
        // Si es la raíz, servir index.html
        if (pathname === '/') {
            pathname = '/pages/index.html';
        }
        
        // Construir la ruta del archivo
        const filePath = path.join(prodDir, pathname);
        
        // Verificar que el archivo exista y no sea un directorio
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err || fs.lstatSync(filePath).isDirectory()) {
                // Si el archivo no existe, intentar servir index.html
                const indexPath = path.join(prodDir, 'pages', 'index.html');
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
            } else {
                // Servir el archivo solicitado
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Error interno del servidor');
                        return;
                    }
                    
                    const contentType = mime.lookup(filePath) || 'application/octet-stream';
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(data);
                });
            }
        });
    });
    
    server.listen(PORT, () => {
        console.log(`Entorno de producción iniciado.`);
        console.log(`Acceda a http://localhost:${PORT} para ver su sitio web en producción.`);
    });
}

// Iniciar el servidor de producción
startProdServer();
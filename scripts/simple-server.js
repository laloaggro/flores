const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const PORT = 3003;
const devDir = path.join(__dirname, '..', 'dev');

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
            res.writeHead(404);
            res.end('Archivo no encontrado');
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
    console.log(`Servidor simple iniciado en http://localhost:${PORT}`);
});
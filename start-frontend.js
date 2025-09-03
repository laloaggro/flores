const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const mime = require('mime-types');

const PORT = 3006;
const devDir = path.join(__dirname, 'dev');

// Tipos MIME personalizados para CSS
const customMimeTypes = {
  '.css': 'text/css'
};

console.log('Iniciando servidor frontend...');
console.log('============================\n');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    // Si es la raíz, servir index.html
    if (pathname === "/") {
        pathname = "/index.html";
    }
    
    // Construir la ruta del archivo
    let filePath = path.join(devDir, pathname);
    
    // Verificar si el archivo existe
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // Si el archivo no existe, verificar si existe en el directorio pages
            const pagesPath = path.join(devDir, "pages", pathname);
            fs.access(pagesPath, fs.constants.F_OK, (err) => {
                if (err) {
                    // Si el archivo no existe en ninguna parte, intentar servir index.html
                    const indexPath = path.join(devDir, "index.html");
                    fs.access(indexPath, fs.constants.F_OK, (err) => {
                        if (err) {
                            res.writeHead(404);
                            res.end("Página no encontrada");
                            return;
                        }
                        
                        serveFile(res, indexPath, pathname);
                    });
                } else {
                    serveFile(res, pagesPath, pathname);
                }
            });
        } else {
            serveFile(res, filePath, pathname);
        }
    });
});

// Función para servir archivos
function serveFile(res, filePath, pathname) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end("Error interno del servidor");
            return;
        }
        
        // Determinar el tipo MIME correcto
        let contentType = mime.lookup(filePath);
        
        // Usar tipos MIME personalizados si están definidos
        const extname = path.extname(filePath);
        if (customMimeTypes[extname]) {
            contentType = customMimeTypes[extname];
        }
        
        // Si no se puede determinar el tipo MIME, usar octet-stream
        if (!contentType) {
            contentType = 'application/octet-stream';
        }
        
        // Agregar encabezados de caché para archivos estáticos
        const cacheHeaders = {
            'Cache-Control': 'public, max-age=3600'
        };
        
        // Para HTML, no cachear
        if (contentType.includes('text/html')) {
            cacheHeaders['Cache-Control'] = 'no-cache, no-store, must-revalidate';
            cacheHeaders['Pragma'] = 'no-cache';
            cacheHeaders['Expires'] = '0';
        }
        
        res.writeHead(200, { 
            'Content-Type': contentType,
            ...cacheHeaders
        });
        res.end(data);
    });
}

server.listen(PORT, () => {
    console.log('Servidor frontend iniciado en http://localhost:' + PORT);
    console.log('Presione Ctrl+C para detener el servidor\n');
});

// Manejar señales de cierre
process.on('SIGINT', () => {
    console.log('\nDeteniendo servidor...');
    server.close(() => {
        console.log('Servidor detenido');
        process.exit(0);
    });
});
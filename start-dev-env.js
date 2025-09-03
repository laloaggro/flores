const { spawn } = require('child_process');
const path = require('path');

// Directorios
const projectRoot = path.join(__dirname);
const devDir = path.join(projectRoot, 'dev');
const backendDir = path.join(projectRoot, 'backend');

console.log('Iniciando entorno de desarrollo completo (Frontend + Backend)...');
console.log('====================================================================\n');

// Función para iniciar el servidor frontend
function startFrontendServer() {
    console.log('Iniciando servidor frontend...');
    
    const frontend = spawn('node', ['-e', `
        const http = require("http");
        const fs = require("fs");
        const path = require("path");
        const url = require("url");
        const mime = require("mime-types");
        
        const PORT = 3006; // Cambiar puerto a 3006
        const devDir = "${devDir.replace(/\\/g, '\\\\')}";
        
        const server = http.createServer((req, res) => {
            const parsedUrl = url.parse(req.url);
            let pathname = parsedUrl.pathname;
            
            // Si es la raíz, servir index.html
            if (pathname === "/") {
                pathname = "/index.html";
            }
            
            // Construir la ruta del archivo
            let filePath = path.join(devDir, pathname);
            
            // Servir el archivo
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    // Si el archivo no existe, verificar si existe en el directorio pages
                    const pagesPath = path.join(devDir, "pages", pathname);
                    if (fs.existsSync(pagesPath)) {
                        fs.readFile(pagesPath, (err, data) => {
                            if (err) {
                                res.writeHead(500);
                                res.end("Error interno del servidor");
                                return;
                            }
                            
                            // Determinar el tipo MIME correcto
                            const contentType = mime.lookup(pagesPath) || "application/octet-stream";
                            res.writeHead(200, { "Content-Type": contentType });
                            res.end(data);
                        });
                    } else {
                        // Si el archivo no existe en ninguna parte, intentar servir index.html
                        const indexPath = path.join(devDir, "index.html");
                        if (fs.existsSync(indexPath)) {
                            fs.readFile(indexPath, (err, data) => {
                                if (err) {
                                    res.writeHead(500);
                                    res.end("Error interno del servidor");
                                    return;
                                }
                                
                                res.writeHead(200, { "Content-Type": "text/html" });
                                res.end(data);
                            });
                        } else {
                            res.writeHead(404);
                            res.end("Página no encontrada");
                        }
                    }
                    return;
                }
                
                // Determinar el tipo MIME correcto
                const contentType = mime.lookup(filePath) || "application/octet-stream";
                
                res.writeHead(200, { "Content-Type": contentType });
                res.end(data);
            });
        });
        
        server.listen(PORT, () => {
            console.log("Servidor frontend iniciado en http://localhost:" + PORT);
        });
    `], {
        cwd: projectRoot
    });
    
    frontend.stdout.on('data', (data) => {
        console.log(`[Frontend] ${data}`);
    });
    
    frontend.stderr.on('data', (data) => {
        console.error(`[Frontend Error] ${data}`);
    });
    
    frontend.on('close', (code) => {
        console.log(`[Frontend] Proceso terminado con código ${code}`);
    });
    
    return frontend;
}

// Función para iniciar el servidor backend
function startBackendServer() {
    console.log('Iniciando servidor backend...');
    
    // Verificar si el directorio backend existe
    if (!require('fs').existsSync(backendDir)) {
        console.log('[Backend] No se encontró el directorio backend, omitiendo...');
        return null;
    }
    
    const backend = spawn('node', ['backend/server.js'], {
        cwd: projectRoot
    });
    
    backend.stdout.on('data', (data) => {
        console.log(`[Backend] ${data}`);
    });
    
    backend.stderr.on('data', (data) => {
        console.error(`[Backend Error] ${data}`);
    });
    
    backend.on('close', (code) => {
        console.log(`[Backend] Proceso terminado con código ${code}`);
    });
    
    return backend;
}

// Iniciar ambos servidores
const frontendProcess = startFrontendServer();
const backendProcess = startBackendServer();

console.log('\n====================================================================');
console.log('Entorno de desarrollo iniciado');
console.log('Frontend: http://localhost:3006');
if (backendProcess) {
    console.log('Backend: http://localhost:5000 (puerto por defecto)');
}
console.log('Presione Ctrl+C para detener ambos servidores');
console.log('====================================================================\n');

// Manejar la señal de interrupción (Ctrl+C)
process.on('SIGINT', () => {
    console.log('\nDeteniendo servidores...');
    
    if (frontendProcess) {
        frontendProcess.kill();
    }
    
    if (backendProcess) {
        backendProcess.kill();
    }
    
    process.exit(0);
});
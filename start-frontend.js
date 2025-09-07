const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Directorios
const projectRoot = path.join(__dirname);
const devDir = path.join(projectRoot, 'dev');

console.log('Iniciando servidor frontend...');
console.log('============================\n');

// Verificar si el puerto 3006 está en uso
const isPortInUse = (port) => {
  return new Promise((resolve) => {
    const net = require('net');
    const tester = net.createServer()
      .once('error', () => resolve(true))
      .once('listening', () => {
        tester.once('close', () => resolve(false)).close();
      })
      .listen(port);
  });
};

const startServer = async () => {
  const portInUse = await isPortInUse(3006);
  
  if (portInUse) {
    console.log('[Frontend Error] El puerto 3006 está en uso. Intentando liberarlo...');
    // En lugar de fallar, intentamos usar otro puerto
    // Pero para mantener consistencia, mejor detener el proceso
    process.exit(1);
  }

  const frontend = spawn('node', ['-e', `
    const http = require("http");
    const fs = require("fs");
    const path = require("path");
    const url = require("url");
    const mime = require("mime-types");
    
    const PORT = 3006; // Puerto para el frontend
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
                    res.writeHead(404);
                    res.end("Archivo no encontrado");
                }
            } else {
                // Determinar el tipo MIME correcto
                const contentType = mime.lookup(filePath) || "application/octet-stream";
                res.writeHead(200, { "Content-Type": contentType });
                res.end(data);
            }
        });
    });
    
    server.listen(PORT, () => {
        console.log("Servidor frontend iniciado en http://localhost:" + PORT);
        console.log("Presione Ctrl+C para detener el servidor\\n");
    }).on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.error("[Frontend Error] El puerto " + PORT + " está en uso");
            process.exit(1);
        } else {
            console.error("[Frontend Error]", err);
            process.exit(1);
        }
    });
  `], {
    stdio: 'inherit'
  });

  frontend.on('close', (code) => {
    console.log(`[Frontend] Proceso terminado con código ${code}`);
    process.exit(code);
  });
};

startServer();
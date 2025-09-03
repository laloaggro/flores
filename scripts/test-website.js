const http = require('http');
const fs = require('fs');
const path = require('path');

// Directorio base del frontend
const frontendDir = path.join(__dirname, '..', 'frontend');

// Tipos MIME para diferentes extensiones
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon'
};

// Crear servidor HTTP
const server = http.createServer((req, res) => {
  console.log(`Solicitud: ${req.method} ${req.url}`);
  
  // Parsear la URL
  let filePath;
  
  // Manejar rutas absolutas (que comienzan con /)
  if (req.url.startsWith('/')) {
    filePath = path.join(frontendDir, req.url);
  } else {
    // Rutas relativas
    filePath = path.join(frontendDir, req.url === '/' ? 'index.html' : req.url);
  }
  
  // Si la ruta termina en '/', servir index.html
  if (filePath.endsWith('/')) {
    filePath = path.join(filePath, 'index.html');
  }
  
  // Si el archivo no tiene extensión y no existe, intentar con .html
  if (!path.extname(filePath)) {
    if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
      filePath += '.html';
    } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '/index.html')) {
      filePath = path.join(filePath, 'index.html');
    }
  }
  
  // Obtener la extensión del archivo
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  // Verificar si el archivo existe, si no, intentar encontrarlo en la raíz
  if (!fs.existsSync(filePath)) {
    // Para rutas que comienzan con /pages/, intentar buscar en la raíz
    if (req.url.startsWith('/pages/')) {
      const rootPath = path.join(frontendDir, req.url.replace('/pages/', '/'));
      if (fs.existsSync(rootPath)) {
        filePath = rootPath;
      }
    }
  }
  
  // Leer el archivo
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // Archivo no encontrado
        console.log(`Archivo no encontrado: ${filePath}`);
        res.writeHead(404);
        res.end('404 - Página no encontrada');
      } else {
        // Error del servidor
        console.log(`Error del servidor: ${error.code}`);
        res.writeHead(500);
        res.end('500 - Error interno del servidor');
      }
    } else {
      // Éxito
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Iniciar el servidor
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Servidor de prueba iniciado en http://localhost:${PORT}`);
  console.log(`📁 Sirviendo archivos desde: ${frontendDir}`);
  console.log(`\nPara detener el servidor, presiona Ctrl+C`);
  console.log(`\nAccede al sitio web en:`);
  console.log(`  - Página principal: http://localhost:${PORT}/`);
  console.log(`  - Página de productos: http://localhost:${PORT}/pages/products.html`);
  console.log(`  - Página de contacto: http://localhost:${PORT}/pages/contact.html`);
  console.log(`  - Página de carrito: http://localhost:${PORT}/pages/cart.html`);
});

// Manejar cierre limpio
process.on('SIGINT', () => {
  console.log('\n\nDeteniendo servidor...');
  server.close(() => {
    console.log('Servidor detenido');
    process.exit(0);
  });
});
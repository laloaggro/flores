const http = require('http');
const fs = require('fs');
const path = require('path');

// Directorios
const devDir = path.join(__dirname, '..', 'dev');

// Verificar existencia de archivos
const cssFiles = [
  '/assets/css/styles.css',
  '/assets/css/index.css'
];

console.log('Verificando archivos CSS...\n');

cssFiles.forEach(file => {
  const filePath = path.join(devDir, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✓ ${file} - Existe (${stats.size} bytes)`);
  } else {
    console.log(`✗ ${file} - No existe`);
  }
});

// Verificar index.html
const indexPath = path.join(devDir, 'pages', 'index.html');
if (fs.existsSync(indexPath)) {
  const htmlContent = fs.readFileSync(indexPath, 'utf8');
  console.log('\nVerificando referencias CSS en index.html...\n');
  
  const cssLinks = htmlContent.match(/<link[^>]*href="[^"]*\.css[^"]*"[^>]*>/g);
  if (cssLinks) {
    cssLinks.forEach(link => {
      console.log(`✓ Encontrado: ${link}`);
    });
  } else {
    console.log('✗ No se encontraron referencias a CSS');
  }
  
  // Verificar si hay errores en las rutas
  const hrefs = htmlContent.match(/href="([^"]*)"/g);
  if (hrefs) {
    hrefs.forEach(href => {
      const url = href.match(/href="([^"]*)"/)[1];
      if (url.startsWith('/')) {
        const filePath = path.join(devDir, url);
        if (fs.existsSync(filePath)) {
          console.log(`✓ Ruta válida: ${url}`);
        } else {
          console.log(`✗ Ruta inválida: ${url}`);
        }
      }
    });
  }
} else {
  console.log('✗ No se encontró index.html');
}

console.log('\nVerificando servidor...\n');

// Verificar que el servidor responda correctamente
const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/assets/css/styles.css',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Código de estado: ${res.statusCode}`);
  console.log(`Content-Type: ${res.headers['content-type']}`);
  
  if (res.statusCode === 200 && res.headers['content-type'].includes('text/css')) {
    console.log('✓ El servidor responde correctamente a las solicitudes CSS');
  } else {
    console.log('✗ El servidor no responde correctamente a las solicitudes CSS');
  }
});

req.on('error', (e) => {
  console.log(`✗ Error al conectar con el servidor: ${e.message}`);
});

req.end();
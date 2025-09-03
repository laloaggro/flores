const http = require('http');

console.log('Verificando el frontend...\n');

// Verificaciones a realizar
const checks = [
  { path: '/', name: 'Página principal' },
  { path: '/assets/css/styles.css', name: 'CSS principal' },
  { path: '/assets/css/index.css', name: 'CSS de index' },
  { path: '/assets/js/main.js', name: 'JavaScript principal' },
  { path: '/assets/images/logo.png', name: 'Logo' },
  { path: '/assets/images/hero-image.jpg', name: 'Imagen hero' },
  { path: '/pages/products.html', name: 'Página de productos' },
  { path: '/pages/contact.html', name: 'Página de contacto' }
];

let completed = 0;

function performCheck(check) {
  const options = {
    hostname: 'localhost',
    port: 3005,
    path: check.path,
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    if (res.statusCode === 200) {
      console.log(`✓ ${check.name} - Código 200 OK`);
    } else {
      console.log(`✗ ${check.name} - Código ${res.statusCode}`);
    }
    
    completed++;
    if (completed === checks.length) {
      console.log('\nVerificación completa. Si todos los elementos tienen marca ✓, el frontend funciona correctamente.');
      console.log('Accede a http://localhost:3005 para ver el sitio web.');
    }
  });

  req.on('error', (e) => {
    console.log(`✗ ${check.name} - Error: ${e.message}`);
    completed++;
    if (completed === checks.length) {
      console.log('\nVerificación completa. Si todos los elementos tienen marca ✓, el frontend funciona correctamente.');
      console.log('Accede a http://localhost:3005 para ver el sitio web.');
    }
  });

  req.end();
}

// Ejecutar todas las verificaciones
checks.forEach((check, index) => {
  setTimeout(() => performCheck(check), index * 100);
});
const http = require('http');

console.log('Verificando el entorno de desarrollo...\n');

// Verificaciones a realizar
const checks = [
  { url: 'http://localhost:3005/', name: 'Frontend - Página principal' },
  { url: 'http://localhost:3005/assets/css/styles.css', name: 'Frontend - CSS principal' },
  { url: 'http://localhost:3005/assets/js/main.js', name: 'Frontend - JavaScript principal' },
  { url: 'http://localhost:50001/api/products', name: 'Backend - API de productos' },
  { url: 'http://localhost:50001/api/users/profile', name: 'Backend - API de usuarios' }
];

let completed = 0;

function performCheck(check) {
  const url = new URL(check.url);
  
  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
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
      console.log('\n¡Entorno de desarrollo verificado!');
      console.log('Frontend: http://localhost:3005');
      console.log('Backend: http://localhost:50001');
    }
  });

  req.on('error', (e) => {
    console.log(`✗ ${check.name} - Error: ${e.message}`);
    completed++;
    if (completed === checks.length) {
      console.log('\n¡Entorno de desarrollo verificado!');
      console.log('Frontend: http://localhost:3005');
      console.log('Backend: http://localhost:50001');
    }
  });

  req.end();
}

// Ejecutar todas las verificaciones
checks.forEach((check, index) => {
  setTimeout(() => performCheck(check), index * 200);
});
const http = require('http');
const fs = require('fs');
const path = require('path');

// URLs para probar
const urls = [
  'http://localhost:3006/',
  'http://localhost:3006/products.html',
  'http://localhost:3006/contact.html',
  'http://localhost:3006/about.html',
  'http://localhost:3006/cart.html',
  'http://localhost:3006/login.html',
  'http://localhost:3006/register.html',
  'http://localhost:3006/pages/products.html',
  'http://localhost:3006/pages/contact.html',
  'http://localhost:3006/pages/about.html',
  'http://localhost:3006/pages/cart.html',
  'http://localhost:3006/pages/login.html',
  'http://localhost:3006/pages/register.html',
  'http://localhost:3006/assets/css/styles.css',
  'http://localhost:3006/assets/js/main.js'
];

console.log('Verificando todas las rutas del sitio...\n');

let completed = 0;

function checkUrl(url) {
  const parsedUrl = new URL(url);
  
  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.pathname,
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`${url} - Código de estado: ${res.statusCode}`);
    completed++;
    if (completed === urls.length) {
      console.log('\nVerificación completa.');
    }
  });

  req.on('error', (e) => {
    console.log(`${url} - Error: ${e.message}`);
    completed++;
    if (completed === urls.length) {
      console.log('\nVerificación completa.');
    }
  });

  req.end();
}

// Ejecutar todas las verificaciones
urls.forEach((url, index) => {
  setTimeout(() => checkUrl(url), index * 100);
});
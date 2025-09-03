const http = require('http');

// URLs para probar
const urls = [
  'http://localhost:3006/',
  'http://localhost:3006/products.html',
  'http://localhost:3006/pages/products.html',
  'http://localhost:3006/assets/css/styles.css',
  'http://localhost:5001/api/products'
];

console.log('Probando acceso a las páginas...\n');

urls.forEach(url => {
  const parsedUrl = new URL(url);
  
  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.pathname,
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`${url} - Código de estado: ${res.statusCode}`);
  });

  req.on('error', (e) => {
    console.log(`${url} - Error: ${e.message}`);
  });

  req.end();
});
const http = require('http');

// URLs para probar
const urls = [
  'http://localhost:3006/',
  'http://localhost:3006/assets/css/styles.css',
  'http://localhost:3006/assets/css/index.css',
  'http://localhost:3006/assets/images/logo.avif',
  'http://localhost:3006/assets/js/main.js'
];

console.log('Verificando tipos MIME de los recursos...\n');

urls.forEach((url, index) => {
  setTimeout(() => {
    const parsedUrl = new URL(url);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      console.log(`${url} - Código de estado: ${res.statusCode} - Tipo MIME: ${res.headers['content-type']}`);
    });

    req.on('error', (e) => {
      console.log(`${url} - Error: ${e.message}`);
    });

    req.end();
  }, index * 500);
});
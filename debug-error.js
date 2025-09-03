const http = require('http');

// Simular la solicitud que causa el error
const options = {
  hostname: 'localhost',
  port: 3006,
  path: '/pages/index.html',
  method: 'GET'
};

console.log('Simulando solicitud a /pages/index.html...');

const req = http.request(options, (res) => {
  console.log(`Código de estado: ${res.statusCode}`);
  console.log(`Encabezados: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Cuerpo de la respuesta: ${data.substring(0, 200)}...`);
  });
});

req.on('error', (e) => {
  console.log(`Error en la solicitud: ${e.message}`);
});

req.end();
const http = require('http');

console.log('Probando acceso a la página de productos...');

// Probar acceso directo
const options1 = {
  hostname: 'localhost',
  port: 3006,
  path: '/products.html',
  method: 'GET'
};

const req1 = http.request(options1, (res) => {
  console.log(`Acceso directo a /products.html: ${res.statusCode}`);
  
  // Probar acceso a través del directorio pages
  const options2 = {
    hostname: 'localhost',
    port: 3006,
    path: '/pages/products.html',
    method: 'GET'
  };

  const req2 = http.request(options2, (res) => {
    console.log(`Acceso a /pages/products.html: ${res.statusCode}`);
    
    // Probar acceso a los archivos CSS
    const options3 = {
      hostname: 'localhost',
      port: 3006,
      path: '/assets/css/styles.css',
      method: 'GET'
    };

    const req3 = http.request(options3, (res) => {
      console.log(`Acceso a /assets/css/styles.css: ${res.statusCode}`);
      
      // Probar acceso al otro archivo CSS
      const options4 = {
        hostname: 'localhost',
        port: 3006,
        path: '/assets/css/index.css',
        method: 'GET'
      };

      const req4 = http.request(options4, (res) => {
        console.log(`Acceso a /assets/css/index.css: ${res.statusCode}`);
      });

      req4.on('error', (e) => {
        console.log(`Error al acceder a index.css: ${e.message}`);
      });

      req4.end();
    });

    req3.on('error', (e) => {
      console.log(`Error al acceder a styles.css: ${e.message}`);
    });

    req3.end();
  });

  req2.on('error', (e) => {
    console.log(`Error al acceder a /pages/products.html: ${e.message}`);
  });

  req2.end();
});

req1.on('error', (e) => {
  console.log(`Error al acceder a /products.html: ${e.message}`);
});

req1.end();
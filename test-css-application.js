const http = require('http');
const fs = require('fs');

// Función para guardar la respuesta en un archivo
function saveResponseToFile(content) {
    fs.writeFileSync('/home/laloaggro/Proyectos/flores-1/test-css-response.html', content);
    console.log('Respuesta guardada en test-css-response.html');
}

// Hacer una solicitud a la página principal
const options = {
    hostname: 'localhost',
    port: 3006,
    path: '/',
    method: 'GET'
};

const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('Código de estado:', res.statusCode);
        
        // Guardar la respuesta completa en un archivo
        saveResponseToFile(data);
        
        // Verificar si hay enlaces a CSS
        const cssRegex = /<link[^>]*href=["'][^"']*css[^"']*["'][^>]*>/gi;
        const cssLinks = data.match(cssRegex);
        console.log('\nEnlaces a archivos CSS encontrados:');
        if (cssLinks) {
            cssLinks.forEach((link, index) => {
                console.log(`${index + 1}. ${link}`);
            });
        } else {
            console.log('No se encontraron enlaces a archivos CSS');
        }
        
        // Verificar si hay enlaces a JavaScript
        const jsRegex = /<script[^>]*src=["'][^"']*js[^"']*["'][^>]*>/gi;
        const jsLinks = data.match(jsRegex);
        console.log('\nEnlaces a archivos JavaScript encontrados:');
        if (jsLinks) {
            jsLinks.forEach((link, index) => {
                console.log(`${index + 1}. ${link}`);
            });
        } else {
            console.log('No se encontraron enlaces a archivos JavaScript');
        }
        
        // Verificar si hay componentes web
        const componentRegex = /<\/?[a-z][a-z0-9]*-component[^>]*>/gi;
        const components = data.match(componentRegex);
        console.log('\nComponentes web encontrados:');
        if (components) {
            components.forEach((component, index) => {
                console.log(`${index + 1}. ${component}`);
            });
        } else {
            console.log('No se encontraron componentes web');
        }
    });
});

req.on('error', (e) => {
    console.log('Error en la solicitud:', e.message);
});

req.end();
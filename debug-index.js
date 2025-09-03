const http = require('http');
const fs = require('fs');

// Función para guardar la respuesta en un archivo
function saveResponseToFile(content) {
    fs.writeFileSync('/home/laloaggro/Proyectos/flores-1/debug-index-response.html', content);
    console.log('Respuesta guardada en debug-index-response.html');
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
        console.log('Encabezados:');
        console.log(res.headers);
        console.log('\nPrimeras 1000 líneas del contenido:');
        console.log(data.substring(0, 1000));
        
        // Guardar la respuesta completa en un archivo
        saveResponseToFile(data);
        
        // Verificar si hay enlaces a CSS
        const cssRegex = /<link[^>]*href=["'][^"']*css[^"']*["'][^>]*>/gi;
        const cssLinks = data.match(cssRegex);
        console.log('\nEnlaces a archivos CSS encontrados:');
        if (cssLinks) {
            cssLinks.forEach(link => console.log(link));
        } else {
            console.log('No se encontraron enlaces a archivos CSS');
        }
        
        // Verificar si hay enlaces a imágenes
        const imgRegex = /<img[^>]*src=["'][^"']+["'][^>]*>/gi;
        const imgLinks = data.match(imgRegex);
        console.log('\nEtiquetas de imagen encontradas:');
        if (imgLinks) {
            imgLinks.forEach(img => console.log(img));
        } else {
            console.log('No se encontraron etiquetas de imagen');
        }
    });
});

req.on('error', (e) => {
    console.log('Error en la solicitud:', e.message);
});

req.end();
const fs = require('fs');
const path = require('path');

// Directorio base
const baseDir = '/home/laloaggro/Proyectos/flores-1/dev';

// Función para corregir rutas en un archivo
function fixCssPaths(filePath) {
    // Leer el contenido del archivo
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Patrón para encontrar rutas relativas a CSS
    const relativeCssPattern = /\.\.\/assets\/css\//g;
    
    // Reemplazar rutas relativas con rutas absolutas
    const fixedContent = content.replace(relativeCssPattern, '/assets/css/');
    
    // Escribir el contenido corregido de vuelta al archivo
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    
    console.log(`Rutas corregidas en: ${filePath}`);
}

// Función para procesar todos los archivos HTML
function processHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // Recursivamente procesar subdirectorios
            processHtmlFiles(filePath);
        } else if (file.endsWith('.html')) {
            // Procesar archivos HTML
            fixCssPaths(filePath);
        }
    });
}

console.log('Corrigiendo rutas de archivos CSS en todos los archivos HTML...');
processHtmlFiles(baseDir);
console.log('¡Corrección completada!');
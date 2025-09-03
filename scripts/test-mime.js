const mime = require('mime-types');
const path = require('path');

// Probar diferentes extensiones
const testPaths = [
  '/home/laloaggro/Proyectos/flores-1/dev/assets/css/styles.css',
  '/home/laloaggro/Proyectos/flores-1/dev/assets/js/main.js',
  '/home/laloaggro/Proyectos/flores-1/dev/pages/index.html'
];

console.log('Pruebas de tipos MIME:');
testPaths.forEach(filePath => {
  const contentType = mime.lookup(filePath) || 'application/octet-stream';
  console.log(`${path.basename(filePath)}: ${contentType}`);
});
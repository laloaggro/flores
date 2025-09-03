const fs = require('fs');
const path = require('path');

// Directorio de páginas
const pagesDir = path.join(__dirname, '..', 'frontend', 'pages');

// Obtener todas las páginas HTML
const pages = fs.readdirSync(pagesDir).filter(file => file.endsWith('.html'));

console.log('Corrigiendo rutas en todas las páginas HTML...\n');

pages.forEach(page => {
  const pagePath = path.join(pagesDir, page);
  let content = fs.readFileSync(pagePath, 'utf8');
  
  // Contador de correcciones
  let fixedCount = 0;
  
  // Corregir rutas de CSS
  const cssPattern = /<link[^>]*href="assets\/css\/([^"]*)"/g;
  if (cssPattern.test(content)) {
    cssPattern.lastIndex = 0;
    content = content.replace(cssPattern, (match, cssFile) => {
      fixedCount++;
      return match.replace('href="assets/css/', 'href="../assets/css/');
    });
  }
  
  // Corregir rutas de JS
  const jsPattern = /<script[^>]*src="assets\/js\/([^"]*)"/g;
  if (jsPattern.test(content)) {
    jsPattern.lastIndex = 0;
    content = content.replace(jsPattern, (match, jsFile) => {
      fixedCount++;
      return match.replace('src="assets/js/', 'src="../assets/js/');
    });
  }
  
  // Corregir rutas de imágenes
  const imgPattern = /<link[^>]*href="assets\/images\/([^"]*)"/g;
  if (imgPattern.test(content)) {
    imgPattern.lastIndex = 0;
    content = content.replace(imgPattern, (match, imgFile) => {
      fixedCount++;
      return match.replace('href="assets/images/', 'href="../assets/images/');
    });
  }
  
  // Corregir rutas de imágenes en meta tags
  const metaImgPattern = /content="\.?\/?assets\/images\/([^"]*)"/g;
  if (metaImgPattern.test(content)) {
    metaImgPattern.lastIndex = 0;
    content = content.replace(metaImgPattern, (match, imgFile) => {
      fixedCount++;
      return match.replace('content="./assets/images/', 'content="../assets/images/')
                  .replace('content="assets/images/', 'content="../assets/images/');
    });
  }
  
  // Corregir rutas de componentes
  const componentPattern = /src="components\//g;
  if (componentPattern.test(content)) {
    componentPattern.lastIndex = 0;
    content = content.replace(componentPattern, 'src="../components/');
    fixedCount++;
  }
  
  // Guardar el archivo si se realizaron correcciones
  if (fixedCount > 0) {
    fs.writeFileSync(pagePath, content, 'utf8');
    console.log(`✓ Corregido: ${page} (${fixedCount} rutas)`);
  } else {
    console.log(`- Sin cambios: ${page}`);
  }
});

console.log('\nCorrección de rutas completada.');
console.log('Ahora puedes reiniciar el servidor para ver los cambios.');
const fs = require('fs');
const path = require('path');

// Directorio de páginas
const pagesDir = path.join(__dirname, '..', 'frontend', 'pages');

// Obtener todas las páginas HTML
const pages = fs.readdirSync(pagesDir).filter(file => file.endsWith('.html'));

console.log('Corrigiendo rutas en páginas HTML...\n');

pages.forEach(page => {
  const pagePath = path.join(pagesDir, page);
  let content = fs.readFileSync(pagePath, 'utf8');
  
  // Contar cuántas rutas se corrigieron
  let fixedCount = 0;
  
  // Patrón para encontrar rutas que comienzan con /pages/assets/ o /pages/components/
  const pattern = /\/pages\/(assets|components)/g;
  
  if (pattern.test(content)) {
    // Reiniciar el lastIndex del patrón
    pattern.lastIndex = 0;
    
    // Reemplazar todas las ocurrencias
    content = content.replace(pattern, '/$1');
    fixedCount++;
    
    // Guardar el archivo corregido
    fs.writeFileSync(pagePath, content, 'utf8');
    console.log(`✓ Corregido: ${page}`);
  } else {
    console.log(`- Sin cambios: ${page}`);
  }
});

console.log('\nCorrección de rutas completada.');
console.log('Ahora puedes reiniciar el servidor para ver los cambios.');
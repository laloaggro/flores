const fs = require('fs');
const path = require('path');

console.log('🔧 Corrigiendo importaciones duplicadas en archivos HTML...\n');

// Directorio de páginas
const pagesDir = path.join(__dirname, '..', 'dev', 'pages');

// Obtener todos los archivos HTML
const htmlFiles = fs.readdirSync(pagesDir)
  .filter(file => file.endsWith('.html'))
  .map(file => path.join(pagesDir, file));

let fixedCount = 0;

htmlFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Buscar patrones de importación duplicados
    const importRegex = /import\s+(\w+)\s+from\s+['"][^'"]+['"];/g;
    let match;
    const imports = new Map();
    
    // Encontrar todas las importaciones
    while ((match = importRegex.exec(content)) !== null) {
      const [fullMatch, componentName] = match;
      if (imports.has(componentName)) {
        // Marcar para eliminar esta importación duplicada
        const escapedImport = fullMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedImport + '\\s*', 'g');
        content = content.replace(regex, '');
        console.log(`  ✅ Eliminada importación duplicada de ${componentName} en ${path.basename(filePath)}`);
        fixedCount++;
      } else {
        imports.set(componentName, true);
      }
    }
    
    // Guardar el archivo corregido
    fs.writeFileSync(filePath, content, 'utf8');
  } catch (error) {
    console.error(`  ❌ Error al procesar ${path.basename(filePath)}:`, error.message);
  }
});

console.log(`\n✅ Proceso completado. ${fixedCount} importaciones duplicadas eliminadas.`);
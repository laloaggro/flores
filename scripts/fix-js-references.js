const fs = require('fs');
const path = require('path');

// Directorio base
const baseDir = path.join(__dirname, '../frontend');

// Mapeo de rutas antiguas a nuevas
const pathMap = {
  'assets/js/userMenu.js': 'assets/js/components/utils/auth.js',
  'assets/js/components/ui/userMenu.js': 'assets/js/components/utils/auth.js',
  'assets/js/header.js': 'assets/js/components/ui/Header.js',
  'assets/js/theme.js': 'assets/js/components/utils/theme.js',
  '/assets/js/userMenu.js': '/assets/js/components/utils/auth.js',
  '/components/Header.js': '/assets/js/components/ui/Header.js',
  '/components/Footer.js': '/assets/js/components/ui/Footer.js'
};

// Función para corregir un archivo
function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // Reemplazar todas las referencias según el mapeo
  for (const [oldPath, newPath] of Object.entries(pathMap)) {
    const linkPattern = new RegExp(`(href|src)\\s*=\\s*["']${oldPath}["']`, 'g');
    if (linkPattern.test(content)) {
      content = content.replace(linkPattern, `$1="${newPath}"`);
      changed = true;
      console.log(`Corregido en ${filePath}: ${oldPath} -> ${newPath}`);
    }
  }
  
  // Eliminar etiquetas preload duplicadas o innecesarias
  const preloadPattern = /<link rel="preload" href="[^"]*" as="script">[\s\S]*?<link rel="preload" href="[^"]*" as="script">/g;
  if (preloadPattern.test(content)) {
    // Conservar solo las referencias a componentes reales
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Archivo actualizado: ${filePath}`);
  }
}

// Función para procesar todos los archivos HTML
function processHtmlFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processHtmlFiles(filePath);
    } else if (file.endsWith('.html')) {
      fixFile(filePath);
    }
  });
}

// Ejecutar el script
console.log('Iniciando corrección de referencias JavaScript...');
processHtmlFiles(baseDir);
console.log('Corrección completada.');
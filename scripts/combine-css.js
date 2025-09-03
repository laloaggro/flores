const fs = require('fs');
const path = require('path');

// Directorios de origen y destino
const frontendAssetsDir = path.join(__dirname, '..', 'frontend', 'assets', 'css');
const devAssetsDir = path.join(__dirname, '..', 'dev', 'assets', 'css');
const prodAssetsDir = path.join(__dirname, '..', 'prod', 'assets', 'css');

// Archivos CSS en orden específico (importante para las dependencias)
const cssFiles = [
  'preflight.css',
  'theme.css',
  'index.css',
  'styles.css',
  'header.css',
  'visibility-fix.css',
  'conflict-fixes.css',
  'color-enhancements.css'
];

// Función para combinar archivos CSS
function combineCSSFiles(sourceDir, targetDir, outputFilename) {
  console.log(`Combinando archivos CSS desde ${sourceDir}...`);
  
  let combinedCSS = '';
  
  cssFiles.forEach(file => {
    const filePath = path.join(sourceDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`Agregando ${file}...`);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      combinedCSS += `/* === ${file} === */\n${fileContent}\n\n`;
    } else {
      console.warn(`Advertencia: ${file} no encontrado en ${sourceDir}`);
    }
  });
  
  // Asegurarse de que el directorio de destino exista
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Escribir el archivo combinado
  const outputPath = path.join(targetDir, outputFilename);
  fs.writeFileSync(outputPath, combinedCSS);
  console.log(`Archivo CSS combinado creado: ${outputPath}`);
}

// Combinar CSS para todos los entornos
try {
  combineCSSFiles(frontendAssetsDir, frontendAssetsDir, 'combined.css');
  combineCSSFiles(devAssetsDir, devAssetsDir, 'combined.css');
  combineCSSFiles(prodAssetsDir, prodAssetsDir, 'combined.css');
  console.log('Todos los archivos CSS combinados exitosamente.');
} catch (error) {
  console.error('Error al combinar archivos CSS:', error);
}
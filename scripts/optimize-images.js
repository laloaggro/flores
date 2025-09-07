const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Optimizando imágenes del proyecto...\n');

// Directorios de imágenes
const imageDirs = [
  'frontend/assets/images',
  'frontend/assets/images/products',
  'frontend/assets/images/categories',
  'frontend/assets/images/flowers',
  'frontend/assets/images/backgrounds'
];

// Verificar si sharp está instalado, si no, instalarlo
try {
  require('sharp');
} catch (error) {
  console.log('📦 Instalando sharp para optimización de imágenes...');
  execSync('npm install sharp', { cwd: __dirname, stdio: 'inherit' });
}

const sharp = require('sharp');

// Función para convertir imágenes a WebP
async function convertToWebP(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  const name = path.basename(imagePath, ext);
  const dir = path.dirname(imagePath);
  const webpPath = path.join(dir, `${name}.webp`);
  
  // Solo convertir imágenes JPG, JPEG y PNG
  if (['.jpg', '.jpeg', '.png'].includes(ext)) {
    try {
      await sharp(imagePath)
        .webp({ quality: 80 })
        .toFile(webpPath);
      console.log(`  ✅ ${path.basename(imagePath)} -> ${name}.webp`);
      return true;
    } catch (error) {
      console.log(`  ❌ Error al convertir ${path.basename(imagePath)}: ${error.message}`);
      return false;
    }
  }
  return false;
}

// Función para optimizar una imagen
async function optimizeImage(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  
  // Solo optimizar imágenes JPG, JPEG, PNG y WebP
  if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    try {
      const buffer = await sharp(imagePath)
        .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85, progressive: true })
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toBuffer();
      
      fs.writeFileSync(imagePath, buffer);
      console.log(`  ✅ Optimizada ${path.basename(imagePath)}`);
      return true;
    } catch (error) {
      console.log(`  ❌ Error al optimizar ${path.basename(imagePath)}: ${error.message}`);
      return false;
    }
  }
  return false;
}

// Procesar directorios de imágenes
async function processImageDirectories() {
  let convertedCount = 0;
  let optimizedCount = 0;
  
  for (const imageDir of imageDirs) {
    const fullPath = path.join(__dirname, '..', imageDir);
    
    if (fs.existsSync(fullPath)) {
      console.log(`📁 Procesando directorio: ${imageDir}`);
      
      const files = fs.readdirSync(fullPath)
        .filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
        });
      
      for (const file of files) {
        const filePath = path.join(fullPath, file);
        
        // Convertir a WebP
        if (await convertToWebP(filePath)) {
          convertedCount++;
        }
        
        // Optimizar imagen original
        if (await optimizeImage(filePath)) {
          optimizedCount++;
        }
      }
      
      console.log(`  📊 ${files.length} archivos procesados en ${imageDir}\n`);
    } else {
      console.log(`  ⚠️  Directorio no encontrado: ${imageDir}`);
    }
  }
  
  console.log(`\n✅ Proceso completado:`);
  console.log(`  - ${convertedCount} imágenes convertidas a WebP`);
  console.log(`  - ${optimizedCount} imágenes optimizadas`);
  console.log(`\n💡 Recomendación: Actualiza las referencias en HTML/CSS para usar las versiones WebP`);
}

// Ejecutar optimización
processImageDirectories().catch(error => {
  console.error('❌ Error durante la optimización:', error.message);
  process.exit(1);
});
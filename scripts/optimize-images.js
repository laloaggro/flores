/**
 * optimize-images.js - Script para optimizar imágenes y prepararlas para CDN
 * 
 * Este script optimiza imágenes y las prepara para ser servidas desde un CDN.
 * Incluye funciones para redimensionar, comprimir y convertir formatos de imagen.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directorios de origen y destino
const sourceDir = path.join(__dirname, '..', 'frontend', 'assets', 'images');
const optimizedDir = path.join(__dirname, '..', 'frontend', 'assets', 'images', 'optimized');
const devDir = path.join(__dirname, '..', 'dev', 'assets', 'images', 'optimized');
const prodDir = path.join(__dirname, '..', 'prod', 'assets', 'images', 'optimized');

// Formatos de imagen soportados
const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'];

// Calidades para diferentes tamaños
const qualitySettings = {
  thumbnail: 75,
  small: 80,
  medium: 85,
  large: 90,
  original: 95
};

/**
 * Crear directorios si no existen
 */
function createDirectories() {
  [optimizedDir, devDir, prodDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Directorio creado: ${dir}`);
    }
  });
}

/**
 * Obtener todas las imágenes del directorio de origen
 * @returns {Array} Lista de rutas de imágenes
 */
function getImages() {
  const images = [];
  
  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (stat.isFile()) {
        const ext = path.extname(file).toLowerCase();
        if (supportedFormats.includes(ext)) {
          images.push(filePath);
        }
      }
    });
  }
  
  walkDir(sourceDir);
  return images;
}

/**
 * Optimizar una imagen
 * @param {string} imagePath - Ruta de la imagen
 * @param {string} size - Tamaño de la imagen (thumbnail, small, medium, large, original)
 */
function optimizeImage(imagePath, size) {
  try {
    const fileName = path.basename(imagePath);
    const fileNameWithoutExt = path.parse(fileName).name;
    const ext = path.extname(fileName).toLowerCase();
    
    // Definir dimensiones según el tamaño
    let dimensions = '';
    switch (size) {
      case 'thumbnail':
        dimensions = '150x150';
        break;
      case 'small':
        dimensions = '300x300';
        break;
      case 'medium':
        dimensions = '600x600';
        break;
      case 'large':
        dimensions = '1200x1200';
        break;
      default:
        dimensions = '';
    }
    
    // Definir calidad según el tamaño
    const quality = qualitySettings[size];
    
    // Crear nombre de archivo optimizado
    const optimizedFileName = `${fileNameWithoutExt}-${size}${ext}`;
    const outputPath = path.join(optimizedDir, optimizedFileName);
    
    // Comando de optimización (requiere ImageMagick)
    let command = `convert "${imagePath}"`;
    
    // Añadir redimensionamiento si es necesario
    if (dimensions) {
      command += ` -resize ${dimensions}^ -gravity center -extent ${dimensions}`;
    }
    
    // Añadir compresión
    if (ext === '.jpg' || ext === '.jpeg') {
      command += ` -quality ${quality} -interlace Plane`;
    } else if (ext === '.png') {
      command += ` -quality ${quality} -strip`;
    } else if (ext === '.webp') {
      command += ` -quality ${quality}`;
    }
    
    command += ` "${outputPath}"`;
    
    // Ejecutar comando
    execSync(command);
    console.log(`Imagen optimizada: ${optimizedFileName}`);
    
    // Copiar a directorios dev y prod
    fs.copyFileSync(outputPath, path.join(devDir, optimizedFileName));
    fs.copyFileSync(outputPath, path.join(prodDir, optimizedFileName));
    
  } catch (error) {
    console.error(`Error al optimizar imagen ${imagePath}:`, error.message);
  }
}

/**
 * Convertir imagen a WebP
 * @param {string} imagePath - Ruta de la imagen
 */
function convertToWebP(imagePath) {
  try {
    const fileName = path.basename(imagePath);
    const fileNameWithoutExt = path.parse(fileName).name;
    const webpFileName = `${fileNameWithoutExt}.webp`;
    const outputPath = path.join(optimizedDir, webpFileName);
    
    // Comando de conversión (requiere ImageMagick)
    const command = `convert "${imagePath}" -quality 85 "${outputPath}"`;
    
    // Ejecutar comando
    execSync(command);
    console.log(`Imagen convertida a WebP: ${webpFileName}`);
    
    // Copiar a directorios dev y prod
    fs.copyFileSync(outputPath, path.join(devDir, webpFileName));
    fs.copyFileSync(outputPath, path.join(prodDir, webpFileName));
    
  } catch (error) {
    console.error(`Error al convertir imagen a WebP ${imagePath}:`, error.message);
  }
}

/**
 * Generar conjunto de imágenes responsivas
 * @param {string} imagePath - Ruta de la imagen
 */
function generateResponsiveImages(imagePath) {
  // Optimizar para diferentes tamaños
  ['thumbnail', 'small', 'medium', 'large'].forEach(size => {
    optimizeImage(imagePath, size);
  });
  
  // Convertir a WebP
  convertToWebP(imagePath);
}

/**
 * Optimizar todas las imágenes
 */
function optimizeAllImages() {
  console.log('Iniciando optimización de imágenes...');
  
  // Crear directorios
  createDirectories();
  
  // Obtener imágenes
  const images = getImages();
  console.log(`Encontradas ${images.length} imágenes para optimizar`);
  
  // Optimizar cada imagen
  images.forEach(imagePath => {
    console.log(`Optimizando: ${imagePath}`);
    generateResponsiveImages(imagePath);
  });
  
  console.log('Optimización de imágenes completada');
}

// Ejecutar optimización si se llama directamente
if (require.main === module) {
  optimizeAllImages();
}

// Exportar funciones
module.exports = {
  optimizeAllImages,
  optimizeImage,
  convertToWebP,
  generateResponsiveImages
};
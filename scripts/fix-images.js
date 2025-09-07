const fs = require('fs');
const path = require('path');

console.log('🔧 Script para corregir imágenes del proyecto\n');

// Directorio de imágenes
const imagesDir = path.join(__dirname, '..', 'frontend', 'assets', 'images');

// Contenido SVG para hero-image.jpg
const heroImageContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1950" height="800" viewBox="0 0 1950 800">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e8f5e9;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#c8e6c9;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1950" height="800" fill="url(#bgGradient)"/>
  <circle cx="975" cy="300" r="150" fill="#4caf50" opacity="0.7"/>
  <circle cx="800" cy="350" r="100" fill="#81c784" opacity="0.5"/>
  <circle cx="1150" cy="350" r="100" fill="#81c784" opacity="0.5"/>
  <text x="975" y="600" font-family="Arial, sans-serif" font-size="48" fill="#2e7d32" text-anchor="middle" font-weight="bold">
    Arreglos Victoria - Flores Naturales
  </text>
  <text x="975" y="660" font-family="Arial, sans-serif" font-size="32" fill="#388e3c" text-anchor="middle">
    Más de 20 años de experiencia en Recoleta
  </text>
</svg>`;

// Contenido SVG para about-florist.jpg
const aboutImageContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#fff8f2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ffefd9;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bgGradient)"/>
  <circle cx="400" cy="200" r="80" fill="#ff9800" opacity="0.8"/>
  <rect x="320" y="280" width="160" height="180" rx="10" fill="#ffbb7c" opacity="0.7"/>
  <rect x="300" y="460" width="200" height="40" rx="20" fill="#f57c00" opacity="0.6"/>
  <text x="400" y="540" font-family="Arial, sans-serif" font-size="24" fill="#b65200" text-anchor="middle" font-weight="bold">
    Nuestra Florería en Recoleta
  </text>
</svg>`;

// Función para escribir archivo
function writeFile(filePath, content) {
    try {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ ${path.basename(filePath)} actualizado correctamente`);
        return true;
    } catch (error) {
        console.error(`❌ Error al actualizar ${path.basename(filePath)}:`, error.message);
        return false;
    }
}

// Función para verificar si un archivo contiene "Imagen no disponible"
function fileNeedsUpdate(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return content.includes('Imagen no disponible') || content.includes('Hero Image');
    } catch (error) {
        console.error(`❌ Error al leer ${filePath}:`, error.message);
        return false;
    }
}

// Corregir imágenes
console.log('🔍 Verificando imágenes...\n');

const heroImagePath = path.join(imagesDir, 'hero-image.jpg');
const aboutImagePath = path.join(imagesDir, 'about-florist.jpg');

let fixedCount = 0;

if (fileNeedsUpdate(heroImagePath)) {
    if (writeFile(heroImagePath, heroImageContent)) {
        fixedCount++;
    }
} else {
    console.log(`✅ ${path.basename(heroImagePath)} ya está correcto`);
}

if (fileNeedsUpdate(aboutImagePath)) {
    if (writeFile(aboutImagePath, aboutImageContent)) {
        fixedCount++;
    }
} else {
    console.log(`✅ ${path.basename(aboutImagePath)} ya está correcto`);
}

console.log(`\n✅ Script finalizado. ${fixedCount} imagen(es) corregida(s).`);
console.log('\n💡 Recomendación: Reinicia los servidores para ver los cambios.');
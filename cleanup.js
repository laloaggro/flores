#!/usr/bin/env node

/**
 * Script para limpiar archivos innecesarios del proyecto
 * 
 * Este script identifica y sugiere la eliminación de archivos que no son
 * parte esencial del proyecto de la florería.
 */

const fs = require('fs');
const path = require('path');

// Directorio base del proyecto
const projectRoot = __dirname;

// Archivos y directorios esenciales que deben mantenerse
const essentialFiles = [
  // Archivos HTML principales
  'frontend/index.html',
  'frontend/about.html',
  'frontend/contact.html',
  'frontend/products.html',
  'frontend/product-detail.html',
  'frontend/cart.html',
  'frontend/checkout.html',
  'frontend/login.html',
  'frontend/register.html',
  'frontend/forgot-password.html',
  'frontend/profile.html',
  'frontend/orders.html',
  'frontend/wishlist.html',
  'frontend/admin.html',
  'frontend/admin-orders.html',
  'frontend/faq.html',
  'frontend/privacy.html',
  'frontend/terms.html',
  'frontend/shipping.html',
  'frontend/sitemap.html',
  'frontend/testimonials.html',
  
  // Hojas de estilo esenciales
  'frontend/assets/css/styles.css',
  'frontend/assets/css/index.css',
  'frontend/assets/css/consistent-theme.css',
  'frontend/assets/css/theme.css',
  'frontend/assets/css/header.css',
  'frontend/assets/css/admin.css',
  'frontend/assets/css/profile.css',
  
  // Scripts JS esenciales
  'frontend/assets/js/utils.js',
  'frontend/assets/js/theme.js',
  'frontend/assets/js/cart.js',
  'frontend/assets/js/contact.js',
  'frontend/assets/js/userMenu.js',
  'frontend/assets/js/lazyLoad.js',
  'frontend/assets/js/auth.js',
  'frontend/assets/js/admin.js',
  'frontend/assets/js/admin-orders.js',
  'frontend/assets/js/profile.js',
  'frontend/assets/js/orders.js',
  'frontend/assets/js/wishlist.js',
  'frontend/assets/js/checkout.js',
  'frontend/assets/js/forgot-password.js',
  'frontend/assets/js/homeProducts.js',
  
  // Componentes esenciales
  'frontend/components/header/Header.js',
  'frontend/components/header/Footer.js',
  'frontend/components/product/Products.js',
  'frontend/components/product/ProductCard.js',
  'frontend/components/product/styles.css',
  'frontend/components/cart/CartItem.js',
  'frontend/components/Testimonials.js',
  
  // Imágenes importantes
  'frontend/assets/images/placeholder.svg',
  'frontend/assets/images/logo.png',
  'frontend/assets/images/logo.svg',
  'frontend/assets/images/about-florist.jpg',
  'frontend/assets/images/hero-bg.jpg',
  'frontend/assets/images/hero-image.jpg',
  
  // Backend
  'backend/server.js',
  
  // Documentación
  'README.md',
  'FRONTEND_THEME.md',
  'TODO.md'
];

// Directorios que deben mantenerse
const essentialDirs = [
  'frontend/assets/images/products',
  'frontend/assets/images/categories',
  'frontend/assets/images/flowers',
  'frontend/assets/images/backgrounds',
  'frontend/pages',
  'frontend/__tests__',
  'frontend/documentacion',
  'backend/routes',
  'backend/controllers',
  'backend/models',
  'backend/middleware',
  'backend/database',
  'backend/utils',
  'backend/tests'
];

// Función para verificar si un archivo es esencial
function isEssentialFile(filePath) {
  return essentialFiles.includes(filePath);
}

// Función para verificar si un directorio es esencial
function isEssentialDir(dirPath) {
  return essentialDirs.some(essentialDir => 
    dirPath === essentialDir || dirPath.startsWith(essentialDir + '/')
  );
}

// Función para obtener todos los archivos en un directorio (recursivamente)
function getAllFiles(dirPath, arrayOfFiles = []) {
  try {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const relativePath = path.relative(projectRoot, filePath);
      
      if (fs.statSync(filePath).isDirectory()) {
        // Excluir node_modules y .git
        if (file !== 'node_modules' && file !== '.git') {
          arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
        }
      } else {
        arrayOfFiles.push({
          path: filePath,
          relativePath: relativePath,
          isEssential: isEssentialFile(relativePath)
        });
      }
    });
  } catch (error) {
    console.error(`Error al leer el directorio ${dirPath}:`, error.message);
  }
  
  return arrayOfFiles;
}

// Función para obtener todos los directorios
function getAllDirs(dirPath, arrayOfDirs = []) {
  try {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const relativePath = path.relative(projectRoot, filePath);
      
      if (fs.statSync(filePath).isDirectory()) {
        // Excluir node_modules y .git
        if (file !== 'node_modules' && file !== '.git') {
          arrayOfDirs.push({
            path: filePath,
            relativePath: relativePath,
            isEssential: isEssentialDir(relativePath)
          });
          arrayOfDirs = getAllDirs(filePath, arrayOfDirs);
        }
      }
    });
  } catch (error) {
    console.error(`Error al leer el directorio ${dirPath}:`, error.message);
  }
  
  return arrayOfDirs;
}

// Función principal
function main() {
  console.log('🔍 Analizando el proyecto para identificar archivos innecesarios...\n');
  
  // Obtener todos los archivos
  const allFiles = getAllFiles(projectRoot);
  const allDirs = getAllDirs(projectRoot);
  
  // Separar archivos esenciales y no esenciales
  const essentialFilesList = allFiles.filter(file => file.isEssential);
  const nonEssentialFiles = allFiles.filter(file => !file.isEssential);
  
  // Separar directorios esenciales y no esenciales
  const essentialDirsList = allDirs.filter(dir => dir.isEssential);
  const nonEssentialDirs = allDirs.filter(dir => !dir.isEssential);
  
  console.log(`📁 Total de archivos encontrados: ${allFiles.length}`);
  console.log(`✅ Archivos esenciales: ${essentialFilesList.length}`);
  console.log(`⚠️  Archivos posiblemente innecesarios: ${nonEssentialFiles.length}\n`);
  
  console.log(`📂 Total de directorios encontrados: ${allDirs.length}`);
  console.log(`✅ Directorios esenciales: ${essentialDirsList.length}`);
  console.log(`⚠️  Directorios posiblemente innecesarios: ${nonEssentialDirs.length}\n`);
  
  // Mostrar archivos no esenciales en el directorio js
  const jsDir = path.join(projectRoot, 'frontend', 'assets', 'js');
  const jsFiles = nonEssentialFiles.filter(file => 
    file.path.startsWith(jsDir) && 
    (file.path.endsWith('.js') || file.path.endsWith('.js.map'))
  );
  
  if (jsFiles.length > 0) {
    console.log('🗑️  Archivos JavaScript posiblemente innecesarios:');
    jsFiles.slice(0, 20).forEach(file => {
      console.log(`   ${file.relativePath}`);
    });
    
    if (jsFiles.length > 20) {
      console.log(`   ... y ${jsFiles.length - 20} archivos más`);
    }
    console.log('');
  }
  
  // Mostrar recomendaciones
  console.log('💡 Recomendaciones:');
  console.log('   1. Revise los archivos listados antes de eliminarlos');
  console.log('   2. Haga una copia de seguridad del proyecto antes de limpiar');
  console.log('   3. Verifique que los archivos no estén referenciados en algún lugar');
  console.log('   4. Considere usar un sistema de construcción como Webpack o Vite');
  console.log('   5. Elimine solo los archivos que esté seguro de que no se utilizan\n');
  
  // Generar script de limpieza
  const cleanupScriptPath = path.join(projectRoot, 'cleanup.sh');
  const nonEssentialFilesPaths = nonEssentialFiles
    .map(file => file.relativePath)
    .filter(filePath => 
      filePath.startsWith('frontend/assets/js/') && 
      (filePath.endsWith('.js') || filePath.endsWith('.js.map'))
    );
  
  if (nonEssentialFilesPaths.length > 0) {
    const cleanupScript = `#!/bin/bash
# Script de limpieza generado automáticamente
# Elimina archivos JavaScript innecesarios

echo "🧹 Limpiando archivos JavaScript innecesarios..."

${nonEssentialFilesPaths.map(filePath => `rm -f "${filePath}"`).join('\n')}

echo "✅ Limpieza completada. Se eliminaron ${nonEssentialFilesPaths.length} archivos."
`;
    
    fs.writeFileSync(cleanupScriptPath, cleanupScript);
    fs.chmodSync(cleanupScriptPath, 0o755);
    
    console.log(`✨ Script de limpieza generado: ${cleanupScriptPath}`);
    console.log('   Para ejecutarlo, use: ./cleanup.sh\n');
  }
}

// Ejecutar el script
if (require.main === module) {
  main();
}

module.exports = {
  isEssentialFile,
  isEssentialDir
};
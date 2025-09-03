#!/usr/bin/env node

// scripts/build-components.js
// Script para construir y copiar componentes web personalizados

const fs = require('fs');
const path = require('path');

// Configuración
const config = {
  srcDir: path.resolve(__dirname, '../frontend/components'),
  distDir: path.resolve(__dirname, '../dist/components'),
  components: [
    'Header.js',
    'Footer.js',
    'Testimonials.js',
    'product/Products.js',
    'product/ProductCard.js',
    'cart/CartItem.js'
  ]
};

// Función para crear directorios recursivamente
function createDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Función para copiar archivos
function copyFile(src, dest) {
  const dir = path.dirname(dest);
  createDir(dir);
  fs.copyFileSync(src, dest);
  console.log(`Copiado: ${src} -> ${dest}`);
}

// Función para minificar JavaScript (básico)
function minifyJS(content) {
  // Eliminar comentarios de una línea
  content = content.replace(/\/\/.*$/gm, '');
  // Eliminar comentarios de múltiples líneas
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  // Reducir espacios en blanco
  content = content.replace(/\s+/g, ' ');
  // Eliminar espacios alrededor de operadores
  content = content.replace(/\s*([{}();,:])\s*/g, '$1');
  return content.trim();
}

// Función principal
async function buildComponents() {
  try {
    console.log('Construyendo componentes web...');
    
    // Crear directorio de destino
    createDir(config.distDir);
    
    // Copiar cada componente
    for (const component of config.components) {
      const srcPath = path.join(config.srcDir, component);
      const destPath = path.join(config.distDir, component);
      
      if (fs.existsSync(srcPath)) {
        // Leer contenido del archivo
        let content = fs.readFileSync(srcPath, 'utf8');
        
        // Minificar si es necesario
        if (process.env.NODE_ENV === 'production') {
          content = minifyJS(content);
        }
        
        // Crear directorio y escribir archivo
        const destDir = path.dirname(destPath);
        createDir(destDir);
        fs.writeFileSync(destPath, content, 'utf8');
        console.log(`Procesado: ${component}`);
      } else {
        console.warn(`Advertencia: Componente no encontrado - ${srcPath}`);
      }
    }
    
    console.log('Construcción de componentes completada.');
  } catch (error) {
    console.error('Error al construir componentes:', error);
    process.exit(1);
  }
}

// Ejecutar construcción
buildComponents();
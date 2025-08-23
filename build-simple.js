#!/usr/bin/env node

/**
 * Build Script Simplificado - Combina y minifica archivos CSS y JS
 */

const fs = require('fs');
const path = require('path');

// Directorios
const FRONTEND_DIR = './frontend';
const ASSETS_DIR = path.join(FRONTEND_DIR, 'assets');
const DIST_DIR = path.join(FRONTEND_DIR, 'dist');
const CSS_DIR = path.join(ASSETS_DIR, 'css');
const JS_DIR = path.join(ASSETS_DIR, 'js');
const COMPONENTS_DIR = path.join(FRONTEND_DIR, 'components');
const DIST_CSS = path.join(DIST_DIR, 'css');
const DIST_JS = path.join(DIST_DIR, 'js');

// Crear directorios de destino si no existen
if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
}
if (!fs.existsSync(DIST_CSS)) {
    fs.mkdirSync(DIST_CSS, { recursive: true });
}
if (!fs.existsSync(DIST_JS)) {
    fs.mkdirSync(DIST_JS, { recursive: true });
}

/**
 * Función para minificar CSS simple (elimina espacios y comentarios)
 */
function minifyCSS(css) {
    return css
        .replace(/\/\*(?:(?!\*\/)[\s\S])*\*\//g, '') // Eliminar comentarios
        .replace(/\s+/g, ' ') // Eliminar espacios múltiples
        .replace(/\s*([{}:;,])\s*/g, '$1') // Eliminar espacios alrededor de caracteres
        .trim();
}

/**
 * Función para minificar JS simple (elimina comentarios y espacios)
 */
function minifyJS(js) {
    return js
        .replace(/\/\*(?:(?!\*\/)[\s\S])*\*\//g, '') // Eliminar comentarios de bloque
        .replace(/\/\/.*$/gm, '') // Eliminar comentarios de línea
        .replace(/\s+/g, ' ') // Eliminar espacios múltiples
        .replace(/\s*([{}();,:])\s*/g, '$1') // Eliminar espacios alrededor de caracteres
        .trim();
}

/**
 * Combina y minifica archivos CSS
 */
function buildCSS() {
    console.log('Building CSS...');
    
    // Archivos CSS a combinar
    const cssFiles = [
        'tailwind.css',
        'base.css',
        'components.css',
        'utilities.css',
        'styles.css'
    ];
    
    let combinedCSS = '';
    
    // Leer y combinar archivos CSS
    cssFiles.forEach(file => {
        const filePath = path.join(CSS_DIR, file);
        if (fs.existsSync(filePath)) {
            console.log(`Adding ${file}`);
            combinedCSS += fs.readFileSync(filePath, 'utf8') + '\n';
        }
    });
    
    // Minificar CSS
    const minifiedCSS = minifyCSS(combinedCSS);
    
    // Guardar CSS minificado
    const outputFile = path.join(DIST_CSS, 'styles.min.css');
    fs.writeFileSync(outputFile, minifiedCSS);
    console.log(`CSS built: ${outputFile}`);
}

/**
 * Combina y minifica archivos JS
 */
function buildJS() {
    console.log('Building JS...');
    
    // Archivos JS a combinar
    const jsFiles = [
        'utils.js',
        'auth.js',
        'cartUtils.js',
        'productManager.js',
        'homeProducts.js',
        'products.js',
        'cart.js',
        'checkout.js',
        'profile.js',
        'admin.js',
        'contact.js',
        'login.js',
        'home.js',
        'app.js'
    ];
    
    let combinedJS = '';
    
    // Leer y combinar archivos JS
    jsFiles.forEach(file => {
        const filePath = path.join(JS_DIR, file);
        if (fs.existsSync(filePath)) {
            console.log(`Adding ${file}`);
            combinedJS += fs.readFileSync(filePath, 'utf8') + '\n';
        }
    });
    
    // Minificar JS
    const minifiedJS = minifyJS(combinedJS);
    
    // Guardar JS minificado
    const outputFile = path.join(DIST_JS, 'app.min.js');
    fs.writeFileSync(outputFile, minifiedJS);
    console.log(`JS built: ${outputFile}`);
}

/**
 * Copiar componentes necesarios
 */
function copyComponents() {
    console.log('Copying components...');
    
    const components = [
        'Cart.js',
        'ProductCard.js',
        'Products.js',
        'ProductFilters.js',
        'Pagination.js'
    ];
    
    components.forEach(component => {
        const srcPath = path.join(COMponents_DIR, component);
        const destPath = path.join(DIST_JS, component);
        
        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied ${component}`);
        }
    });
}

/**
 * Copiar imágenes y otros assets
 */
function copyAssets() {
    console.log('Copying assets...');
    
    // Crear directorio de imágenes si no existe
    const distImages = path.join(DIST_DIR, 'images');
    if (!fs.existsSync(distImages)) {
        fs.mkdirSync(distImages, { recursive: true });
    }
    
    // Copiar imágenes
    const imageFiles = [
        'placeholder.svg'
    ];
    
    imageFiles.forEach(image => {
        const srcPath = path.join(ASSETS_DIR, 'images', image);
        const destPath = path.join(distImages, image);
        
        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied ${image}`);
        }
    });
}

// Ejecutar build
function runBuild() {
    console.log('Starting build process...');
    
    try {
        buildCSS();
        buildJS();
        copyComponents();
        copyAssets();
        
        console.log('Build completed successfully!');
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    runBuild();
}

module.exports = { buildCSS, buildJS, copyComponents, copyAssets };
#!/usr/bin/env node

/**
 * Build Script - Minifica y combina archivos CSS y JS para producción
 */

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');

// Directorios
const SRC_DIR = './frontend/assets';
const DIST_DIR = './frontend/dist';
const CSS_SRC = path.join(SRC_DIR, 'css');
const JS_SRC = path.join(SRC_DIR, 'js');
const COMPONENTS_SRC = './frontend/components';
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
 * Minifica y combina archivos CSS
 */
async function buildCSS() {
    console.log('Building CSS...');
    
    // Archivos CSS a combinar (en orden específico)
    const cssFiles = [
        path.join(CSS_SRC, 'tailwind.css'),
        path.join(CSS_SRC, 'base.css'),
        path.join(CSS_SRC, 'components.css'),
        path.join(CSS_SRC, 'utilities.css'),
        path.join(CSS_SRC, 'styles.css')
    ];
    
    let combinedCSS = '';
    
    // Leer y combinar archivos CSS
    for (const file of cssFiles) {
        if (fs.existsSync(file)) {
            console.log(`Adding ${file}`);
            combinedCSS += fs.readFileSync(file, 'utf8') + '\n';
        }
    }
    
    // Minificar CSS
    const minifiedCSS = new CleanCSS({}).minify(combinedCSS);
    
    // Guardar CSS minificado
    const outputFile = path.join(DIST_CSS, 'styles.min.css');
    fs.writeFileSync(outputFile, minifiedCSS.styles);
    console.log(`CSS built: ${outputFile}`);
}

/**
 * Minifica y combina archivos JS
 */
async function buildJS() {
    console.log('Building JS...');
    
    // Archivos JS a combinar (en orden específico)
    const jsFiles = [
        path.join(JS_SRC, 'utils.js'),
        path.join(JS_SRC, 'auth.js'),
        path.join(JS_SRC, 'cartUtils.js'),
        path.join(JS_SRC, 'productManager.js'),
        path.join(JS_SRC, 'homeProducts.js'),
        path.join(JS_SRC, 'products.js'),
        path.join(JS_SRC, 'cart.js'),
        path.join(JS_SRC, 'checkout.js'),
        path.join(JS_SRC, 'profile.js'),
        path.join(JS_SRC, 'admin.js'),
        path.join(JS_SRC, 'contact.js'),
        path.join(JS_SRC, 'login.js'),
        path.join(JS_SRC, 'home.js'),
        path.join(JS_SRC, 'app.js')
    ];
    
    let combinedJS = '';
    
    // Leer y combinar archivos JS
    for (const file of jsFiles) {
        if (fs.existsSync(file)) {
            console.log(`Adding ${file}`);
            combinedJS += fs.readFileSync(file, 'utf8') + '\n';
        }
    }
    
    // Minificar JS
    try {
        const minifiedJS = await minify(combinedJS, {
            compress: {
                drop_console: true,
                drop_debugger: true
            },
            mangle: true
        });
        
        // Guardar JS minificado
        const outputFile = path.join(DIST_JS, 'app.min.js');
        fs.writeFileSync(outputFile, minifiedJS.code);
        console.log(`JS built: ${outputFile}`);
    } catch (error) {
        console.error('Error minifying JS:', error);
    }
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
    
    for (const component of components) {
        const srcPath = path.join(COMponents_SRC, component);
        const destPath = path.join(DIST_JS, component);
        
        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied ${component}`);
        }
    }
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
    
    for (const image of imageFiles) {
        const srcPath = path.join(SRC_DIR, 'images', image);
        const destPath = path.join(distImages, image);
        
        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied ${image}`);
        }
    }
}

// Ejecutar build
async function runBuild() {
    console.log('Starting build process...');
    
    try {
        await buildCSS();
        await buildJS();
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
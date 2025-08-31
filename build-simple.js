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
        .replace(/\/\/.*$/gm, '') // Eliminar comentarios de línea
        .replace(/\s*([{}:;,])\s*/g, '$1') // Eliminar espacios alrededor de caracteres
        .replace(/\s*>\s*/g, '>') // Eliminar espacios alrededor de >
        .replace(/\s*\+\s*/g, '+') // Eliminar espacios alrededor de +
        .replace(/\s*~\s*/g, '~') // Eliminar espacios alrededor de ~
        .replace(/;\}/g, '}') // Eliminar punto y coma antes de llaves de cierre
        .replace(/([a-zA-Z0-9_\-])\s+(?=[a-zA-Z0-9_\-])/g, '$1 ') // Conservar un espacio entre propiedades y valores
        .replace(/\s+/g, ' ') // Reducir espacios múltiples a uno solo
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
        .replace(/\s*=>\s*/g, '=>') // Eliminar espacios alrededor de =>
        .replace(/\s*=\s*/g, '=') // Eliminar espacios alrededor de =
        .trim();
}

/**
 * Combina y minifica archivos CSS
 */
function buildCSS() {
    console.log('Building CSS...');
    
    // Archivos CSS a combinar en orden específico
    const cssFiles = [
        'preflight.css',
        'theme.css',
        'styles.css',
        'header.css',
        'visibility-fix.css',
        'conflict-fixes.css',
        'admin.css',
        'index.css'
    ];
    
    let combinedCSS = '';
    
    cssFiles.forEach(file => {
        const filePath = path.join(CSS_DIR, file);
        if (fs.existsSync(filePath)) {
            console.log(`Adding ${file}...`);
            const cssContent = fs.readFileSync(filePath, 'utf8');
            combinedCSS += `/* ${file} */\n${cssContent}\n\n`;
        } else {
            console.warn(`Warning: ${file} not found`);
        }
    });
    
    // Minificar CSS combinado
    const minifiedCSS = minifyCSS(combinedCSS);
    
    // Guardar CSS combinado y minificado
    fs.writeFileSync(path.join(DIST_CSS, 'styles.min.css'), minifiedCSS);
    console.log('CSS build completed');
}

/**
 * Combina y minifica archivos JS
 */
function buildJS() {
    console.log('Building JS...');
    
    // Archivos JS principales a combinar
    const jsFiles = [
        'utils.js',
        'userMenu.js',
        'cart.js',
        'cartUtils.js',
        'products.js',
        'header.js',
        'theme.js',
        'admin.js',
        'admin-orders.js',
        'auth.js',
        'profile.js',
        'contact.js',
        'productManager.js'
    ];
    
    let combinedJS = '';
    
    jsFiles.forEach(file => {
        const filePath = path.join(JS_DIR, file);
        if (fs.existsSync(filePath)) {
            console.log(`Adding ${file}...`);
            const jsContent = fs.readFileSync(filePath, 'utf8');
            combinedJS += `// ${file}\n${jsContent}\n\n`;
        } else {
            console.warn(`Warning: ${file} not found`);
        }
    });
    
    // Minificar JS combinado
    const minifiedJS = minifyJS(combinedJS);
    
    // Guardar JS combinado y minificado
    fs.writeFileSync(path.join(DIST_JS, 'scripts.min.js'), minifiedJS);
    console.log('JS build completed');
}

/**
 * Copiar componentes web
 */
function copyComponents() {
    console.log('Copying components...');
    
    const components = [
        'Header.js',
        'Footer.js',
        'ProductCard.js',
        'Cart.js'
    ];
    
    components.forEach(component => {
        const srcPath = path.join(COMPONENTS_DIR, component);
        const destPath = path.join(DIST_DIR, 'components', component);
        
        // Crear directorio si no existe
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        
        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied ${component}`);
        } else {
            console.warn(`Warning: ${component} not found`);
        }
    });
}

/**
 * Copiar assets (imágenes, fuentes, etc.)
 */
function copyAssets() {
    console.log('Copying assets...');
    
    const assetDirs = ['images'];
    
    assetDirs.forEach(dir => {
        const srcDir = path.join(ASSETS_DIR, dir);
        const destDir = path.join(DIST_DIR, 'assets', dir);
        
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        
        if (fs.existsSync(srcDir)) {
            const files = fs.readdirSync(srcDir);
            files.forEach(file => {
                const srcPath = path.join(srcDir, file);
                const destPath = path.join(destDir, file);
                fs.copyFileSync(srcPath, destPath);
                console.log(`Copied ${file}`);
            });
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
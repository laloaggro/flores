const fs = require('fs');
const path = require('path');

// Directorios base
const projectRoot = path.join(__dirname, '..');
const frontendDir = path.join(projectRoot, 'frontend');
const assetsDir = path.join(frontendDir, 'assets');
const componentsDir = path.join(frontendDir, 'components');

console.log('Verificando integridad del proyecto...\n');

// Verificar existencia de directorios principales
const mainDirs = [
    projectRoot,
    path.join(projectRoot, 'backend'),
    frontendDir,
    path.join(projectRoot, 'dist'),
    path.join(projectRoot, 'docs'),
    path.join(projectRoot, 'scripts'),
    path.join(projectRoot, 'tests')
];

console.log('1. Verificando directorios principales...\n');
let allDirsExist = true;
mainDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`✓ ${dir} existe`);
    } else {
        console.log(`✗ ${dir} no existe`);
        allDirsExist = false;
    }
});

// Verificar estructura de frontend
console.log('\n2. Verificando estructura de frontend...\n');

const frontendDirs = [
    path.join(frontendDir, 'assets'),
    path.join(frontendDir, 'components'),
    path.join(frontendDir, 'layouts'),
    path.join(frontendDir, 'pages'),
    path.join(frontendDir, 'partials')
];

frontendDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`✓ ${dir} existe`);
    } else {
        console.log(`✗ ${dir} no existe`);
    }
});

// Verificar estructura de assets
console.log('\n3. Verificando estructura de assets...\n');

const assetsDirs = [
    path.join(assetsDir, 'css'),
    path.join(assetsDir, 'images'),
    path.join(assetsDir, 'js')
];

assetsDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`✓ ${dir} existe`);
    } else {
        console.log(`✗ ${dir} no existe`);
    }
});

// Verificar subdirectorios de css
const cssDirs = [
    'base',
    'components',
    'layouts',
    'pages',
    'themes',
    'vendors'
];

console.log('\n4. Verificando subdirectorios de CSS...\n');
cssDirs.forEach(dir => {
    const fullPath = path.join(assetsDir, 'css', dir);
    if (fs.existsSync(fullPath)) {
        console.log(`✓ ${fullPath} existe`);
    } else {
        console.log(`✗ ${fullPath} no existe`);
    }
});

// Verificar subdirectorios de images
const imagesDirs = [
    'products',
    'icons',
    'banners'
];

console.log('\n5. Verificando subdirectorios de imágenes...\n');
imagesDirs.forEach(dir => {
    const fullPath = path.join(assetsDir, 'images', dir);
    if (fs.existsSync(fullPath)) {
        console.log(`✓ ${fullPath} existe`);
    } else {
        console.log(`✗ ${fullPath} no existe`);
    }
});

// Verificar subdirectorios de js
const jsDirs = [
    'core',
    'modules',
    'vendors'
];

console.log('\n6. Verificando subdirectorios de JavaScript...\n');
jsDirs.forEach(dir => {
    const fullPath = path.join(assetsDir, 'js', dir);
    if (fs.existsSync(fullPath)) {
        console.log(`✓ ${fullPath} existe`);
    } else {
        console.log(`✗ ${fullPath} no existe`);
    }
});

// Verificar archivos importantes
console.log('\n7. Verificando archivos importantes...\n');

const importantFiles = [
    path.join(assetsDir, 'js', 'main.js'),
    path.join(frontendDir, 'index.html'),
    path.join(projectRoot, 'package.json'),
    path.join(projectRoot, 'vite.config.js'),
    path.join(projectRoot, 'README.md')
];

importantFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✓ ${file} existe`);
    } else {
        console.log(`✗ ${file} no existe`);
    }
});

// Verificar componentes
console.log('\n8. Verificando componentes...\n');

const componentDirs = [
    path.join(componentsDir, 'cart'),
    path.join(componentsDir, 'header'),
    path.join(componentsDir, 'product')
];

componentDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`✓ ${dir} existe`);
    } else {
        console.log(`✗ ${dir} no existe`);
    }
});

// Verificar estructura de componentes JS
console.log('\n9. Verificando estructura de componentes JS...\n');

const jsComponentDirs = [
    path.join(assetsDir, 'js', 'components', 'cart'),
    path.join(assetsDir, 'js', 'components', 'pages'),
    path.join(assetsDir, 'js', 'components', 'product'),
    path.join(assetsDir, 'js', 'components', 'ui'),
    path.join(assetsDir, 'js', 'components', 'utils')
];

jsComponentDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`✓ ${dir} existe`);
    } else {
        console.log(`✗ ${dir} no existe`);
    }
});

console.log('\nVerificación completada.');
console.log('\nSiguientes pasos recomendados:');
console.log('1. Ejecutar npm run build para verificar que el empaquetado funciona');
console.log('2. Probar la aplicación en modo desarrollo con npm run dev');
console.log('3. Verificar que todas las páginas carguen correctamente');
console.log('4. Probar funcionalidades clave como carrito y checkout');
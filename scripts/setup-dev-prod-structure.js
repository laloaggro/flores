const fs = require('fs');
const path = require('path');

// Directorios base
const projectRoot = path.join(__dirname, '..');
const frontendDir = path.join(projectRoot, 'frontend');
const devDir = path.join(projectRoot, 'dev');
const prodDir = path.join(projectRoot, 'prod');

console.log('Creando estructura de desarrollo y producción...\n');

// Función para crear directorios si no existen
function createDirIfNotExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Directorio creado: ${dirPath}`);
    }
}

// Función para copiar archivos
function copyFile(source, destination) {
    if (fs.existsSync(source)) {
        // Crear directorio de destino si no existe
        const destDir = path.dirname(destination);
        createDirIfNotExists(destDir);
        
        // Copiar archivo
        fs.copyFileSync(source, destination);
        console.log(`Copiado: ${source} -> ${destination}`);
    }
}

// Función para copiar directorios recursivamente
function copyDir(source, destination) {
    if (!fs.existsSync(source)) return;
    
    createDirIfNotExists(destination);
    
    const items = fs.readdirSync(source);
    items.forEach(item => {
        const sourcePath = path.join(source, item);
        const destPath = path.join(destination, item);
        
        if (fs.lstatSync(sourcePath).isDirectory()) {
            copyDir(sourcePath, destPath);
        } else {
            copyFile(sourcePath, destPath);
        }
    });
    
    console.log(`Directorio copiado: ${source} -> ${destination}`);
}

// Crear estructura de directorios
console.log('1. Creando directorios principales...\n');
createDirIfNotExists(devDir);
createDirIfNotExists(prodDir);

// Crear estructura para desarrollo
console.log('2. Creando estructura de desarrollo...\n');
createDirIfNotExists(path.join(devDir, 'assets'));
createDirIfNotExists(path.join(devDir, 'components'));
createDirIfNotExists(path.join(devDir, 'pages'));

// Crear estructura para producción
console.log('3. Creando estructura de producción...\n');
createDirIfNotExists(path.join(prodDir, 'assets'));
createDirIfNotExists(path.join(prodDir, 'components'));
createDirIfNotExists(path.join(prodDir, 'pages'));

// Copiar solo los componentes esenciales para desarrollo
console.log('4. Copiando componentes esenciales para desarrollo...\n');

// Copiar componentes web esenciales
const essentialComponents = [
    'header',
    'product',
    'cart'
];

essentialComponents.forEach(component => {
    const sourcePath = path.join(frontendDir, 'components', component);
    const destPath = path.join(devDir, 'components', component);
    copyDir(sourcePath, destPath);
});

// Copiar componentes JavaScript esenciales
const jsComponentDirs = [
    'components/ui',
    'components/product',
    'components/cart',
    'components/utils'
];

jsComponentDirs.forEach(dir => {
    const sourcePath = path.join(frontendDir, 'assets', 'js', dir);
    const destPath = path.join(devDir, 'assets', 'js', dir);
    copyDir(sourcePath, destPath);
});

// Copiar páginas HTML esenciales
console.log('5. Copiando páginas HTML esenciales...\n');
const essentialPages = [
    'index.html',
    'products.html',
    'product-detail.html',
    'cart.html',
    'checkout.html',
    'login.html',
    'register.html'
];

essentialPages.forEach(page => {
    const sourcePath = path.join(frontendDir, page);
    const destPath = path.join(devDir, 'pages', page);
    copyFile(sourcePath, destPath);
});

// Copiar assets esenciales
console.log('6. Copiando assets esenciales...\n');

// Copiar CSS esenciales
const cssDirs = [
    'base',
    'components',
    'layouts',
    'pages'
];

cssDirs.forEach(dir => {
    const sourcePath = path.join(frontendDir, 'assets', 'css', dir);
    const destPath = path.join(devDir, 'assets', 'css', dir);
    copyDir(sourcePath, destPath);
});

// Copiar imágenes esenciales
const imageDirs = [
    'products',
    'icons'
];

imageDirs.forEach(dir => {
    const sourcePath = path.join(frontendDir, 'assets', 'images', dir);
    const destPath = path.join(devDir, 'assets', 'images', dir);
    copyDir(sourcePath, destPath);
});

// Copiar archivos JavaScript esenciales
console.log('7. Copiando archivos JavaScript esenciales...\n');
copyFile(
    path.join(frontendDir, 'assets', 'js', 'main.js'),
    path.join(devDir, 'assets', 'js', 'main.js')
);

// Crear archivo de configuración para desarrollo
console.log('8. Creando archivo de configuración para desarrollo...\n');
const devConfig = {
    environment: 'development',
    version: '1.0.0',
    components: essentialComponents,
    lastUpdate: new Date().toISOString()
};

fs.writeFileSync(
    path.join(devDir, 'dev-config.json'),
    JSON.stringify(devConfig, null, 2)
);
console.log('Archivo de configuración de desarrollo creado');

// Crear archivo de configuración para producción
console.log('9. Creando archivo de configuración para producción...\n');
const prodConfig = {
    environment: 'production',
    version: '1.0.0',
    components: [],
    lastUpdate: new Date().toISOString()
};

fs.writeFileSync(
    path.join(prodDir, 'prod-config.json'),
    JSON.stringify(prodConfig, null, 2)
);
console.log('Archivo de configuración de producción creado');

console.log('\nEstructura de desarrollo y producción creada exitosamente.');
console.log('\nNueva estructura del proyecto:');
console.log(`
flores-1/
├── backend/                 # Código del servidor
├── frontend/                # Código del cliente original
├── dev/                     # Entorno de desarrollo
│   ├── assets/              # Recursos para desarrollo
│   ├── components/          # Componentes para desarrollo
│   ├── pages/               # Páginas HTML para desarrollo
│   └── dev-config.json      # Configuración de desarrollo
├── prod/                    # Entorno de producción
│   ├── assets/              # Recursos para producción
│   ├── components/          # Componentes para producción
│   ├── pages/               # Páginas HTML para producción
│   └── prod-config.json     # Configuración de producción
├── dist/                    # Archivos compilados para producción
├── docs/                    # Documentación del proyecto
└── scripts/                 # Scripts de utilidad
`);

console.log('\nSiguientes pasos recomendados:');
console.log('1. Trabajar en los componentes en el directorio dev/');
console.log('2. Cuando los cambios estén listos, usar el script de promoción para pasar a producción');
console.log('3. Probar los cambios en el entorno de desarrollo');
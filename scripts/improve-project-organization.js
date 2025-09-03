const fs = require('fs');
const path = require('path');

// Directorios base
const projectRoot = path.join(__dirname, '..');
const frontendDir = path.join(projectRoot, 'frontend');
const devDir = path.join(projectRoot, 'dev');
const prodDir = path.join(projectRoot, 'prod');
const docsDir = path.join(projectRoot, 'docs');

console.log('Mejorando la organización del proyecto...\n');

// Función para crear directorios si no existen
function createDirIfNotExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Directorio creado: ${dirPath}`);
        return true;
    }
    return false;
}

// Función para mover archivos
function moveFile(source, destination) {
    if (fs.existsSync(source)) {
        // Crear directorio de destino si no existe
        const destDir = path.dirname(destination);
        createDirIfNotExists(destDir);
        
        // Mover archivo
        fs.renameSync(source, destination);
        console.log(`Movido: ${source} -> ${destination}`);
        return true;
    }
    return false;
}

// Función para copiar archivos
function copyFile(source, destination) {
    if (fs.existsSync(source)) {
        // Crear directorio de destino si no existe
        const destDir = path.dirname(destination);
        createDirIfNotExists(destDir);
        
        // Copiar archivo
        const fileContent = fs.readFileSync(source);
        fs.writeFileSync(destination, fileContent);
        console.log(`Copiado: ${source} -> ${destination}`);
        return true;
    }
    return false;
}

// Función para eliminar directorios vacíos
function removeEmptyDirs(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    
    const items = fs.readdirSync(dirPath);
    items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        if (fs.lstatSync(itemPath).isDirectory()) {
            removeEmptyDirs(itemPath);
            // Verificar si el directorio está vacío y eliminarlo
            if (fs.readdirSync(itemPath).length === 0) {
                fs.rmdirSync(itemPath);
                console.log(`Directorio eliminado: ${itemPath}`);
            }
        }
    });
}

// 1. Organizar archivos de configuración
console.log('1. Organizando archivos de configuración...\n');

const configDir = path.join(projectRoot, 'config');
createDirIfNotExists(configDir);

const configFiles = [
    '.env',
    '.env.example',
    '.editorconfig',
    '.eslintrc.js',
    '.eslintrc.json',
    '.prettierrc',
    '.stylelintrc.json',
    'babel.config.js',
    'jest.config.js',
    'cypress.config.js',
    'vite.config.js',
    'webpack.config.js',
    'web-components.config.js'
];

configFiles.forEach(file => {
    const sourcePath = path.join(projectRoot, file);
    const destPath = path.join(configDir, file);
    moveFile(sourcePath, destPath);
});

// 2. Organizar scripts de utilidad
console.log('\n2. Organizando scripts de utilidad...\n');

const utilsDir = path.join(projectRoot, 'utils');
createDirIfNotExists(utilsDir);

// Mover scripts útiles al directorio utils
const utilityScripts = [
    'cleanup.js',
    'deploy.sh',
    'generate_images.js',
    'install-composer.sh',
    'start-dev.sh'
];

utilityScripts.forEach(file => {
    const sourcePath = path.join(projectRoot, file);
    const destPath = path.join(utilsDir, file);
    moveFile(sourcePath, destPath);
});

// 3. Organizar assets en frontend
console.log('\n3. Organizando assets en frontend...\n');

const frontendAssetsDir = path.join(frontendDir, 'assets');
if (fs.existsSync(frontendAssetsDir)) {
    // Verificar si hay subdirectorios vacíos y eliminarlos
    const assetSubdirs = fs.readdirSync(frontendAssetsDir);
    assetSubdirs.forEach(subdir => {
        const subdirPath = path.join(frontendAssetsDir, subdir);
        if (fs.lstatSync(subdirPath).isDirectory()) {
            // Si el subdirectorio está vacío, eliminarlo
            if (fs.readdirSync(subdirPath).length === 0) {
                fs.rmdirSync(subdirPath);
                console.log(`Directorio de assets eliminado (vacío): ${subdirPath}`);
            }
        }
    });
}

// 4. Organizar componentes en frontend
console.log('\n4. Organizando componentes en frontend...\n');

const frontendComponentsDir = path.join(frontendDir, 'components');
if (fs.existsSync(frontendComponentsDir)) {
    // Verificar componentes y organizarlos por tipo
    const components = fs.readdirSync(frontendComponentsDir);
    components.forEach(component => {
        const componentPath = path.join(frontendComponentsDir, component);
        if (fs.lstatSync(componentPath).isDirectory()) {
            // Verificar si el directorio está vacío
            if (fs.readdirSync(componentPath).length === 0) {
                fs.rmdirSync(componentPath);
                console.log(`Componente eliminado (vacío): ${componentPath}`);
            }
        }
    });
}

// 5. Organizar páginas en frontend
console.log('\n5. Organizando páginas en frontend...\n');

const frontendPagesDir = path.join(frontendDir, 'pages');
createDirIfNotExists(frontendPagesDir);

// Mover archivos HTML al directorio pages
const htmlFiles = fs.readdirSync(frontendDir).filter(file => file.endsWith('.html'));
htmlFiles.forEach(file => {
    // Excluir index.html de este movimiento
    if (file !== 'index.html') {
        const sourcePath = path.join(frontendDir, file);
        const destPath = path.join(frontendPagesDir, file);
        moveFile(sourcePath, destPath);
    }
});

// 6. Organizar directorio de pruebas
console.log('\n6. Organizando directorio de pruebas...\n');

const testsDir = path.join(projectRoot, 'tests');
createDirIfNotExists(testsDir);

// Mover contenido de frontend/tests a tests
const frontendTestsDir = path.join(frontendDir, 'tests');
if (fs.existsSync(frontendTestsDir)) {
    const testItems = fs.readdirSync(frontendTestsDir);
    testItems.forEach(item => {
        const sourcePath = path.join(frontendTestsDir, item);
        const destPath = path.join(testsDir, item);
        moveFile(sourcePath, destPath);
    });
    
    // Eliminar directorio frontend/tests si está vacío
    if (fs.readdirSync(frontendTestsDir).length === 0) {
        fs.rmdirSync(frontendTestsDir);
        console.log(`Directorio eliminado: ${frontendTestsDir}`);
    }
}

// 7. Organizar directorio temporal
console.log('\n7. Organizando directorio temporal...\n');

const tempDir = path.join(projectRoot, 'temp');
if (fs.existsSync(path.join(projectRoot, 'temp_images'))) {
    moveFile(path.join(projectRoot, 'temp_images'), path.join(tempDir, 'images'));
}

// 8. Organizar documentación adicional
console.log('\n8. Organizando documentación adicional...\n');

// Mover documentos sueltos al directorio docs
const docFiles = fs.readdirSync(projectRoot).filter(file => 
    file.endsWith('.md') || file.endsWith('.txt') || file.endsWith('.mmd')
);

docFiles.forEach(file => {
    // Excluir README.md ya que es el principal
    if (file !== 'README.md') {
        const sourcePath = path.join(projectRoot, file);
        const destPath = path.join(docsDir, file);
        moveFile(sourcePath, destPath);
    }
});

// 9. Crear estructura mejorada para dev y prod
console.log('\n9. Creando estructura mejorada para dev y prod...\n');

// Asegurarse de que dev y prod tengan la estructura correcta
const envDirs = [devDir, prodDir];
envDirs.forEach(envDir => {
    if (fs.existsSync(envDir)) {
        const requiredSubdirs = ['assets', 'components', 'pages'];
        requiredSubdirs.forEach(subdir => {
            createDirIfNotExists(path.join(envDir, subdir));
        });
    }
});

// 10. Actualizar configuración del proyecto
console.log('\n10. Actualizando configuración del proyecto...\n');

// Crear un archivo de configuración del proyecto mejorado
const projectConfig = {
    version: '2.0.0',
    lastOrganized: new Date().toISOString(),
    structure: {
        config: 'config/',
        docs: 'docs/',
        src: {
            dev: 'dev/',
            prod: 'prod/',
            frontend: 'frontend/'
        },
        tests: 'tests/',
        utils: 'utils/',
        temp: 'temp/',
        scripts: 'scripts/'
    },
    environments: ['development', 'production'],
    packageManager: 'npm'
};

fs.writeFileSync(
    path.join(projectRoot, 'PROJECT_CONFIG.json'),
    JSON.stringify(projectConfig, null, 2)
);
console.log('Archivo de configuración PROJECT_CONFIG.json creado');

console.log('\nMejora de organización completada.');
console.log('\nNueva estructura del proyecto:');
console.log(`
flores-1/
├── config/                  # Archivos de configuración
├── dev/                     # Entorno de desarrollo
│   ├── assets/              # Recursos para desarrollo
│   ├── components/          # Componentes para desarrollo
│   └── pages/               # Páginas HTML para desarrollo
├── dist/                    # Archivos compilados para producción
├── docs/                    # Documentación del proyecto
├── frontend/                # Código del cliente original
│   ├── assets/              # Recursos del frontend
│   ├── components/          # Componentes del frontend
│   ├── pages/               # Páginas del frontend
│   └── index.html           # Página principal
├── prod/                    # Entorno de producción
│   ├── assets/              # Recursos para producción
│   ├── components/          # Componentes para producción
│   └── pages/               # Páginas HTML para producción
├── scripts/                 # Scripts de automatización
├── temp/                    # Archivos temporales
├── tests/                   # Pruebas del proyecto
├── utils/                   # Utilidades y herramientas
├── backend/                 # Código del servidor
├── node_modules/            # Dependencias de Node.js
├── PROJECT_CONFIG.json      # Configuración del proyecto
└── README.md                # Documentación principal
`);

console.log('\nBeneficios de esta organización:');
console.log('- Separación clara de configuraciones');
console.log('- Agrupación lógica de utilidades');
console.log('- Estructura consistente para entornos de desarrollo y producción');
console.log('- Mejor organización de pruebas y documentación');
console.log('- Directorio temporal centralizado');

console.log('\nSiguientes pasos recomendados:');
console.log('1. Verificar que todos los archivos se hayan movido correctamente');
console.log('2. Actualizar rutas en archivos de configuración si es necesario');
console.log('3. Probar que el entorno de desarrollo sigue funcionando');
console.log('4. Verificar que los scripts de automatización funcionen con la nueva estructura');
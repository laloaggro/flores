const fs = require('fs');
const path = require('path');

// Directorios base
const projectRoot = path.join(__dirname, '..');
const docsDir = path.join(projectRoot, 'docs');

console.log('Moviendo archivos de documentación...\n');

// Función para mover archivos
function moveFile(source, destination) {
    if (fs.existsSync(source)) {
        // Crear directorio de destino si no existe
        const destDir = path.dirname(destination);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        
        // Mover archivo
        fs.renameSync(source, destination);
        console.log(`Movido: ${source} -> ${destination}`);
        return true;
    }
    return false;
}

// Crear directorios necesarios
const developmentDir = path.join(docsDir, 'development');
const testingDir = path.join(docsDir, 'testing');
const utilitiesDir = path.join(docsDir, 'utilities');
const projectInfoDir = path.join(docsDir, 'project-info');

[developmentDir, testingDir, utilitiesDir, projectInfoDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Directorio creado: ${dir}`);
    }
});

// Mover archivos de desarrollo
const developmentFiles = [
    {
        source: path.join(projectRoot, 'solucion_problema.txt'),
        destination: path.join(developmentDir, 'TROUBLESHOOTING.txt')
    },
    {
        source: path.join(projectRoot, 'render_admin_head.txt'),
        destination: path.join(developmentDir, 'RENDER_ADMIN_HEAD.txt')
    },
    {
        source: path.join(projectRoot, 'render_index_head.txt'),
        destination: path.join(developmentDir, 'RENDER_INDEX_HEAD.txt')
    },
    {
        source: path.join(projectRoot, 'render_profile_head.txt'),
        destination: path.join(developmentDir, 'RENDER_PROFILE_HEAD.txt')
    }
];

developmentFiles.forEach(file => {
    moveFile(file.source, file.destination);
});

// Mover archivos de prueba
const testingFiles = [
    {
        source: path.join(projectRoot, 'cart-test.json'),
        destination: path.join(testingDir, 'cart-test.json')
    },
    {
        source: path.join(projectRoot, 'orders-test.json'),
        destination: path.join(testingDir, 'orders-test.json')
    },
    {
        source: path.join(projectRoot, 'users-test.json'),
        destination: path.join(testingDir, 'users-test.json')
    },
    {
        source: path.join(projectRoot, 'test-auth.js'),
        destination: path.join(testingDir, 'test-auth.js')
    },
    {
        source: path.join(projectRoot, 'test-cart.js'),
        destination: path.join(testingDir, 'test-cart.js')
    },
    {
        source: path.join(projectRoot, 'test-checkout.js'),
        destination: path.join(testingDir, 'test-checkout.js')
    }
];

testingFiles.forEach(file => {
    moveFile(file.source, file.destination);
});

console.log('\nMovimiento de archivos completado.');
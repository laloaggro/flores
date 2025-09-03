const fs = require('fs');
const path = require('path');

// Directorios base
const projectRoot = path.join(__dirname, '..');
const docsDir = path.join(projectRoot, 'docs');

console.log('Organizando documentos restantes...\n');

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

// Función para copiar archivos
function copyFile(source, destination) {
    if (fs.existsSync(source)) {
        // Crear directorio de destino si no existe
        const destDir = path.dirname(destination);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        
        // Copiar archivo
        const fileContent = fs.readFileSync(source);
        fs.writeFileSync(destination, fileContent);
        console.log(`Copiado: ${source} -> ${destination}`);
        return true;
    }
    return false;
}

// 1. Organizar archivos de documentación
console.log('1. Organizando archivos de documentación...\n');

// Archivos de texto con información técnica
const technicalDocs = [
    {
        source: path.join(projectRoot, 'solucion_problema.txt'),
        destination: path.join(docsDir, 'development', 'TROUBLESHOOTING.txt')
    },
    {
        source: path.join(projectRoot, 'render_admin_head.txt'),
        destination: path.join(docsDir, 'development', 'RENDER_ADMIN_HEAD.txt')
    },
    {
        source: path.join(projectRoot, 'render_index_head.txt'),
        destination: path.join(docsDir, 'development', 'RENDER_INDEX_HEAD.txt')
    },
    {
        source: path.join(projectRoot, 'render_profile_head.txt'),
        destination: path.join(docsDir, 'development', 'RENDER_PROFILE_HEAD.txt')
    }
];

technicalDocs.forEach(doc => {
    moveFile(doc.source, doc.destination);
});

// 2. Organizar archivos de prueba
console.log('\n2. Organizando archivos de prueba...\n');

// Crear directorio para archivos de prueba
const testDir = path.join(docsDir, 'testing');
if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
    console.log(`Directorio creado: ${testDir}`);
}

// Mover archivos de prueba JSON
const testJsonFiles = [
    {
        source: path.join(projectRoot, 'cart-test.json'),
        destination: path.join(testDir, 'cart-test.json')
    },
    {
        source: path.join(projectRoot, 'orders-test.json'),
        destination: path.join(testDir, 'orders-test.json')
    },
    {
        source: path.join(projectRoot, 'users-test.json'),
        destination: path.join(testDir, 'users-test.json')
    }
];

testJsonFiles.forEach(file => {
    moveFile(file.source, file.destination);
});

// Mover archivos de prueba JavaScript
const testJsFiles = [
    {
        source: path.join(projectRoot, 'test-auth.js'),
        destination: path.join(testDir, 'test-auth.js')
    },
    {
        source: path.join(projectRoot, 'test-cart.js'),
        destination: path.join(testDir, 'test-cart.js')
    },
    {
        source: path.join(projectRoot, 'test-checkout.js'),
        destination: path.join(testDir, 'test-checkout.js')
    }
];

testJsFiles.forEach(file => {
    moveFile(file.source, file.destination);
});

// 3. Organizar otros archivos útiles
console.log('\n3. Organizando otros archivos útiles...\n');

// Crear directorio para utilidades
const utilsDir = path.join(docsDir, 'utilities');
if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir, { recursive: true });
    console.log(`Directorio creado: ${utilsDir}`);
}

// Scripts de utilidad que podrían ser útiles mantener
const utilityScripts = [
    {
        source: path.join(projectRoot, 'cleanup.js'),
        destination: path.join(utilsDir, 'cleanup.js')
    },
    {
        source: path.join(projectRoot, 'generate_images.js'),
        destination: path.join(utilsDir, 'generate_images.js')
    }
];

utilityScripts.forEach(file => {
    copyFile(file.source, file.destination); // Copiamos, no movemos, para no eliminar el original
});

// 4. Verificar y organizar otros archivos si es necesario
console.log('\n4. Verificando otros archivos...\n');

// Archivos que pueden ser útiles mantener en la raíz pero hacer copias en documentación
const rootFilesToCopy = [
    path.join(projectRoot, 'README.md'),
    path.join(projectRoot, 'package.json'),
    path.join(projectRoot, 'PROJECT_STATUS.json')
];

rootFilesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
        const fileName = path.basename(file);
        copyFile(file, path.join(docsDir, 'project-info', fileName));
    }
});

console.log('\nOrganización de documentos completada.');
console.log('\nResumen de acciones:');
console.log('- Archivos de documentación técnica movidos a docs/development/');
console.log('- Archivos de prueba movidos a docs/testing/');
console.log('- Scripts de utilidad copiados a docs/utilities/');
console.log('- Archivos importantes copiados a docs/project-info/');

console.log('\nNueva estructura de documentación:');
console.log(`
docs/
├── architecture/           # Documentación de arquitectura
├── deployment/             # Documentación de despliegue
├── development/            # Documentación de desarrollo
│   ├── TROUBLESHOOTING.txt # Soluciones a problemas comunes
│   ├── RENDER_*.txt        # Archivos de encabezado para renderizado
│   └── ...                 # Otros documentos de desarrollo
├── project-info/           # Información del proyecto
│   ├── README.md           # Copia del README principal
│   ├── package.json        # Copia del package.json
│   └── PROJECT_STATUS.json # Estado del proyecto
├── testing/                # Archivos de prueba
│   ├── *.json              # Datos de prueba en formato JSON
│   └── test-*.js           # Scripts de prueba
├── utilities/              # Scripts y utilidades
│   ├── cleanup.js          # Script de limpieza
│   └── generate_images.js  # Script de generación de imágenes
└── ...                     # Otros documentos existentes
`);

console.log('\nSiguientes pasos recomendados:');
console.log('1. Revisar que todos los archivos se hayan movido correctamente');
console.log('2. Verificar que no haya rutas rotas en la documentación');
console.log('3. Eliminar archivos duplicados innecesarios');
console.log('4. Actualizar referencias en la documentación si es necesario');
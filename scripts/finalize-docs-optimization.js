const fs = require('fs');
const path = require('path');

// Directorios base
const projectRoot = path.join(__dirname, '..');
const docsDir = path.join(projectRoot, 'docs');
const documentosDir = path.join(docsDir, 'documentos');

console.log('Finalizando optimización de documentación...\n');

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

// Función para eliminar archivos
function removeFile(filePath) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Archivo eliminado: ${filePath}`);
        return true;
    }
    return false;
}

// Función para eliminar directorios recursivamente
function removeDir(dirPath) {
    if (fs.existsSync(dirPath)) {
        const items = fs.readdirSync(dirPath);
        items.forEach(item => {
            const itemPath = path.join(dirPath, item);
            if (fs.lstatSync(itemPath).isDirectory()) {
                removeDir(itemPath);
            } else {
                fs.unlinkSync(itemPath);
            }
        });
        fs.rmdirSync(dirPath);
        console.log(`Directorio eliminado: ${dirPath}`);
        return true;
    }
    return false;
}

// 1. Mover documentos importantes al directorio docs principal
console.log('1. Moviendo documentos importantes...\n');

const importantDocs = [
    'ADMIN_CHEATSHEET.md',
    'ADVANCED_SITE_FUNCTIONALITY.md',
    'AUTH_FLOW.md',
    'CART_MANAGEMENT.md',
    'COMPONENTS_CATALOG.md',
    'ORDER_MANAGEMENT_DIFFERENCES.md',
    'README.md' // Este es el README del directorio documentos
];

importantDocs.forEach(doc => {
    const sourcePath = path.join(documentosDir, doc);
    const destPath = path.join(docsDir, doc);
    moveFile(sourcePath, destPath);
});

// 2. Eliminar documentos menos importantes
console.log('\n2. Eliminando documentos menos importantes...\n');

const unnecessaryDocs = [
    'CHANGELOG.md',
    'CONFIGURATION_UPDATES.md',
    'DATABASE.md',
    'FORM_ISSUES_ANALYSIS.md',
    'IMPROVEMENTS_BRANCH_README.md',
    'LOGIN_TEST.md',
    'PRODUCTION.md',
    'TODO.md'
];

unnecessaryDocs.forEach(doc => {
    const filePath = path.join(documentosDir, doc);
    removeFile(filePath);
});

// 3. Eliminar el directorio documentos si está vacío
console.log('\n3. Eliminando directorio documentos si está vacío...\n');

if (fs.existsSync(documentosDir)) {
    const remainingFiles = fs.readdirSync(documentosDir);
    if (remainingFiles.length === 0) {
        fs.rmdirSync(documentosDir);
        console.log(`Directorio eliminado: ${documentosDir}`);
    } else {
        console.log(`El directorio ${documentosDir} aún contiene ${remainingFiles.length} archivos:`);
        remainingFiles.forEach(file => console.log(`  - ${file}`));
    }
}

// 4. Crear archivo de control de documentación
console.log('\n4. Creando archivo de control de documentación...\n');

const docsStatus = {
    lastOptimized: new Date().toISOString(),
    totalDocs: fs.readdirSync(docsDir).filter(file => file.endsWith('.md')).length,
    consolidated: true,
    masterGuideCreated: true,
    indexCreated: true
};

fs.writeFileSync(
    path.join(docsDir, 'DOCS_STATUS.json'),
    JSON.stringify(docsStatus, null, 2)
);
console.log('Archivo de control de documentación creado: DOCS_STATUS.json');

console.log('\nFinalización de optimización de documentación completada.');
console.log('\nCambios realizados:');
console.log('- Documentos importantes movidos al directorio docs principal');
console.log('- Documentos menos importantes eliminados');
console.log('- Directorio documentos eliminado (si estaba vacío)');
console.log('- Archivo de control de documentación creado');

console.log('\nNueva estructura del directorio docs:');
console.log(`
docs/
├── INDEX.md                 # Índice de documentación
├── PROJECT_MASTER_GUIDE.md  # Documento maestro consolidado
├── DOCS_STATUS.json         # Estado de la documentación
├── *.md                     # Documentos técnicos importantes
├── *.txt                    # Archivos de texto técnicos
├── *.mmd                    # Diagramas Mermaid
└── (posibles subdirectorios) # Directorios con documentación especializada
`);

console.log('\nBeneficios obtenidos:');
console.log('- Reducción significativa de archivos innecesarios');
console.log('- Documentación más enfocada y relevante');
console.log('- Estructura más clara y manejable');
console.log('- Menos archivos dispersos');
console.log('- Mejor organización de la información técnica');

console.log('\nDocumentos importantes conservados:');
console.log('- ADMIN_CHEATSHEET.md');
console.log('- ADMIN_GUIDE.md');
console.log('- ADVANCED_SITE_FUNCTIONALITY.md');
console.log('- API_DOCUMENTATION.md');
console.log('- AUTH_FLOW.md');
console.log('- CART_MANAGEMENT.md');
console.log('- COMPONENTS_CATALOG.md');
console.log('- DEPLOYMENT.md');
console.log('- DEVELOPMENT_GUIDE.md');
console.log('- DOCUMENTATION.md');
console.log('- FRONTEND_ARCHITECTURE.md');
console.log('- FRONTEND_THEME.md');
console.log('- GETTING_STARTED.md');
console.log('- INDEX.md');
console.log('- MIGRATION_GUIDE.md');
console.log('- ORDER_MANAGEMENT_DIFFERENCES.md');
console.log('- ORDERS_ADMIN_ACCESS.md');
console.log('- PROJECT_MASTER_GUIDE.md');
console.log('- RENDER_*.txt');
console.log('- STYLE_GUIDE.md');
console.log('- TESTING.md');
console.log('- TROUBLESHOOTING.txt');

console.log('\nSiguientes pasos recomendados:');
console.log('1. Revisar que todos los documentos importantes estén accesibles');
console.log('2. Verificar que el PROJECT_MASTER_GUIDE.md contenga toda la información relevante');
console.log('3. Actualizar enlaces en la documentación si es necesario');
console.log('4. Eliminar cualquier otro archivo innecesario que se identifique');
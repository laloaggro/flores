const fs = require('fs');
const path = require('path');

// Directorios base
const projectRoot = path.join(__dirname, '..');
const docsDir = path.join(projectRoot, 'docs');

console.log('Optimizando la estructura del proyecto...\n');

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

// 1. Consolidar documentación redundante
console.log('1. Consolidando documentación redundante...\n');

// Identificar documentos que pueden ser consolidados
const redundantDocs = [
    'PROJECT_ORGANIZATION.md',
    'PROJECT_ORGANIZATION_SUMMARY.md',
    'PROJECT_REORGANIZATION.md',
    'PROJECT_SUMMARY.md',
    'DEV_PROD_WORKFLOW.md',
    'DOCUMENTS_ORGANIZATION_SUMMARY.md',
    'IMPROVED_PROJECT_ORGANIZATION.md'
];

// Crear un documento maestro que consolide toda la información importante
const masterDocPath = path.join(docsDir, 'PROJECT_MASTER_GUIDE.md');
let masterContent = '# Guía Maestra del Proyecto Arreglos Victoria Florería\n\n';
masterContent += 'Este documento consolida toda la información importante del proyecto.\n\n';

// Agregar información de los documentos redundantes
redundantDocs.forEach(doc => {
    const docPath = path.join(docsDir, doc);
    if (fs.existsSync(docPath)) {
        const content = fs.readFileSync(docPath, 'utf8');
        masterContent += `\n\n<!-- Contenido de ${doc} -->\n${content}\n`;
    }
});

// Escribir el documento maestro
fs.writeFileSync(masterDocPath, masterContent);
console.log(`Documento maestro creado: ${masterDocPath}`);

// 2. Eliminar documentos redundantes
console.log('\n2. Eliminando documentos redundantes...\n');

redundantDocs.forEach(doc => {
    const docPath = path.join(docsDir, doc);
    removeFile(docPath);
});

// 3. Limpiar directorios vacíos
console.log('\n3. Limpiando directorios vacíos...\n');

const emptyDirs = [
    path.join(docsDir, 'architecture'),
    path.join(docsDir, 'deployment'),
    path.join(docsDir, 'legacy')
];

emptyDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        try {
            fs.rmdirSync(dir);
            console.log(`Directorio eliminado: ${dir}`);
        } catch (err) {
            console.log(`No se pudo eliminar el directorio: ${dir}`);
        }
    }
});

// 4. Consolidar documentación en docs/documentos
console.log('\n4. Consolidando documentación en docs/documentos...\n');

const documentosDir = path.join(docsDir, 'documentos');
if (fs.existsSync(documentosDir)) {
    const documentos = fs.readdirSync(documentosDir);
    
    // Mover documentos importantes al directorio docs principal
    const importantDocs = [
        'ADMIN_GUIDE.md',
        'DEVELOPMENT_GUIDE.md',
        'API_DOCUMENTATION.md',
        'FRONTEND_THEME.md',
        'STYLE_GUIDE.md',
        'TESTING.md',
        'DEPLOYMENT.md'
    ];
    
    importantDocs.forEach(doc => {
        const sourcePath = path.join(documentosDir, doc);
        const destPath = path.join(docsDir, doc);
        moveFile(sourcePath, destPath);
    });
    
    // Eliminar el directorio documentos si está vacío
    if (fs.readdirSync(documentosDir).length === 0) {
        fs.rmdirSync(documentosDir);
        console.log(`Directorio eliminado: ${documentosDir}`);
    }
}

// 5. Optimizar directorio de desarrollo
console.log('\n5. Optimizando directorio de desarrollo...\n');

const developmentDir = path.join(docsDir, 'development');
if (fs.existsSync(developmentDir)) {
    // Mover archivos importantes al directorio docs principal
    const devFiles = fs.readdirSync(developmentDir);
    devFiles.forEach(file => {
        const sourcePath = path.join(developmentDir, file);
        const destPath = path.join(docsDir, file);
        moveFile(sourcePath, destPath);
    });
    
    // Eliminar el directorio development si está vacío
    if (fs.readdirSync(developmentDir).length === 0) {
        fs.rmdirSync(developmentDir);
        console.log(`Directorio eliminado: ${developmentDir}`);
    }
}

// 6. Consolidar archivos de utilidades
console.log('\n6. Consolidando archivos de utilidades...\n');

const utilitiesDir = path.join(docsDir, 'utilities');
if (fs.existsSync(utilitiesDir)) {
    // Mover archivos al directorio utils principal
    const utilityFiles = fs.readdirSync(utilitiesDir);
    utilityFiles.forEach(file => {
        const sourcePath = path.join(utilitiesDir, file);
        const destPath = path.join(projectRoot, 'utils', file);
        moveFile(sourcePath, destPath);
    });
    
    // Eliminar el directorio utilities si está vacío
    if (fs.readdirSync(utilitiesDir).length === 0) {
        fs.rmdirSync(utilitiesDir);
        console.log(`Directorio eliminado: ${utilitiesDir}`);
    }
}

// 7. Limpiar archivos de prueba duplicados
console.log('\n7. Limpiando archivos de prueba duplicados...\n');

const testingDir = path.join(docsDir, 'testing');
if (fs.existsSync(testingDir)) {
    // Mover archivos al directorio tests principal
    const testFiles = fs.readdirSync(testingDir);
    testFiles.forEach(file => {
        const sourcePath = path.join(testingDir, file);
        const destPath = path.join(projectRoot, 'tests', file);
        moveFile(sourcePath, destPath);
    });
    
    // Eliminar el directorio testing si está vacío
    if (fs.readdirSync(testingDir).length === 0) {
        fs.rmdirSync(testingDir);
        console.log(`Directorio eliminado: ${testingDir}`);
    }
}

// 8. Consolidar información del proyecto
console.log('\n8. Consolidando información del proyecto...\n');

const projectInfoDir = path.join(docsDir, 'project-info');
if (fs.existsSync(projectInfoDir)) {
    // Eliminar archivos duplicados
    const projectInfoFiles = fs.readdirSync(projectInfoDir);
    projectInfoFiles.forEach(file => {
        const filePath = path.join(projectInfoDir, file);
        removeFile(filePath);
    });
    
    // Eliminar el directorio project-info si está vacío
    if (fs.readdirSync(projectInfoDir).length === 0) {
        fs.rmdirSync(projectInfoDir);
        console.log(`Directorio eliminado: ${projectInfoDir}`);
    }
}

// 9. Limpiar archivos innecesarios en la raíz
console.log('\n9. Limpiando archivos innecesarios en la raíz...\n');

// Eliminar archivos de configuración duplicados si existen
const unnecessaryFiles = [
    'PROJECT_STATUS.json' // Ya tenemos PROJECT_CONFIG.json
];

unnecessaryFiles.forEach(file => {
    const filePath = path.join(projectRoot, file);
    removeFile(filePath);
});

// 10. Crear índice de documentación
console.log('\n10. Creando índice de documentación...\n');

let docIndex = '# Índice de Documentación\n\n';
docIndex += 'Este documento proporciona un índice de toda la documentación disponible en el proyecto.\n\n';

// Listar todos los archivos .md en docs
const mdFiles = fs.readdirSync(docsDir).filter(file => file.endsWith('.md'));
docIndex += '## Documentos Principales\n\n';
mdFiles.forEach(file => {
    docIndex += `- [${file}](${file})\n`;
});

// Listar archivos en subdirectorios
const subDirs = fs.readdirSync(docsDir).filter(item => {
    const itemPath = path.join(docsDir, item);
    return fs.lstatSync(itemPath).isDirectory();
});

subDirs.forEach(dir => {
    const dirPath = path.join(docsDir, dir);
    const dirFiles = fs.readdirSync(dirPath);
    if (dirFiles.length > 0) {
        docIndex += `\n## ${dir}/\n\n`;
        dirFiles.forEach(file => {
            docIndex += `- [${file}](${dir}/${file})\n`;
        });
    }
});

docIndex += '\n---\n*Última actualización: ' + new Date().toISOString() + '*\n';

fs.writeFileSync(path.join(docsDir, 'INDEX.md'), docIndex);
console.log('Índice de documentación creado: INDEX.md');

console.log('\nOptimización de la estructura del proyecto completada.');
console.log('\nCambios realizados:');
console.log('- Documentación redundante consolidada en PROJECT_MASTER_GUIDE.md');
console.log('- Archivos de documentación redundantes eliminados');
console.log('- Directorios vacíos eliminados');
console.log('- Documentación importante reorganizada');
console.log('- Archivos de utilidades movidos al directorio utils');
console.log('- Archivos de prueba movidos al directorio tests');
console.log('- Índice de documentación creado');

console.log('\nNueva estructura del directorio docs:');
console.log(`
docs/
├── INDEX.md                 # Índice de documentación
├── PROJECT_MASTER_GUIDE.md  # Documento maestro consolidado
├── *.md                     # Documentos técnicos importantes
├── *.txt                    # Archivos de texto técnicos
├── *.mmd                    # Diagramas Mermaid
├── *.json                   # Archivos de configuración de documentación
└── (subdirectorios)         # Directorios con documentación especializada
`);

console.log('\nBeneficios obtenidos:');
console.log('- Reducción de archivos redundantes');
console.log('- Estructura de documentación más clara');
console.log('- Facilidad para encontrar documentación importante');
console.log('- Menos archivos innecesarios');
console.log('- Mejor organización de la información');

console.log('\nSiguientes pasos recomendados:');
console.log('1. Revisar el documento PROJECT_MASTER_GUIDE.md para asegurar que contiene toda la información necesaria');
console.log('2. Verificar que el INDEX.md incluye todos los documentos importantes');
console.log('3. Eliminar manualmente cualquier archivo innecesario que haya quedado');
console.log('4. Actualizar referencias en la documentación si es necesario');
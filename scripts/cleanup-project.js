const fs = require('fs');
const path = require('path');

// Directorios base
const projectRoot = path.join(__dirname, '..');
const frontendDir = path.join(projectRoot, 'frontend');

console.log('Iniciando limpieza y organización del proyecto...\n');

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

// Función para verificar si un directorio está vacío
function isDirEmpty(dirPath) {
    if (!fs.existsSync(dirPath)) return true;
    return fs.readdirSync(dirPath).length === 0;
}

// 1. Limpiar archivos de registro y logs innecesarios
console.log('1. Limpiando archivos de registro y logs...\n');

const logFiles = [
    path.join(projectRoot, 'build.log'),
    path.join(projectRoot, 'verify.log')
];

logFiles.forEach(file => removeFile(file));

// 2. Eliminar directorios de backup innecesarios si ya no se necesitan
console.log('2. Limpiando directorios de backup...\n');

// Solo eliminamos los backups si ya no son necesarios
// Por ahora, los mantenemos como referencia pero los marcaremos para revisión futura
const backupDirs = [
    path.join(frontendDir, 'backups'),
    path.join(frontendDir, 'components', 'backup')
];

backupDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`Directorio de backup encontrado (revisar manualmente): ${dir}`);
    }
});

// 3. Eliminar archivos de configuración duplicados
console.log('3. Limpiando archivos de configuración duplicados...\n');

// Ya eliminamos estos en pasos anteriores, verificamos que no queden restos
const oldConfigFiles = [
    path.join(projectRoot, 'vite.config.simple.js'),
    path.join(projectRoot, 'build.js'),
    path.join(projectRoot, 'build-simple.js')
];

oldConfigFiles.forEach(file => removeFile(file));

// 4. Limpiar directorios de documentación duplicados
console.log('4. Limpiando documentación duplicada...\n');

// Mover cualquier documentación restante al directorio docs
const docFiles = [
    path.join(projectRoot, 'PROJECT_ORGANIZATION.md'),
    path.join(projectRoot, 'PROJECT_SUMMARY.md'),
    path.join(frontendDir, 'documentacion')
];

docFiles.forEach(item => {
    if (fs.existsSync(item)) {
        console.log(`Documento para revisar y posiblemente mover: ${item}`);
    }
});

// 5. Eliminar directorios de prueba que ya no se necesiten
console.log('5. Limpiando directorios de prueba...\n');

const testDirs = [
    path.join(projectRoot, 'test-build')
];

testDirs.forEach(dir => removeDir(dir));

// 6. Limpiar archivos temporales
console.log('6. Limpiando archivos temporales...\n');

// Buscar y eliminar archivos temporales
function findAndRemoveTempFiles(dir) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    items.forEach(item => {
        const itemPath = path.join(dir, item);
        if (fs.lstatSync(itemPath).isDirectory()) {
            findAndRemoveTempFiles(itemPath);
        } else {
            // Eliminar archivos temporales comunes
            if (item.endsWith('.tmp') || item.endsWith('.temp') || item.startsWith('temp')) {
                removeFile(itemPath);
            }
        }
    });
}

findAndRemoveTempFiles(projectRoot);

// 7. Verificar y limpiar directorios vacíos
console.log('7. Verificando directorios vacíos...\n');

function removeEmptyDirs(dir) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    items.forEach(item => {
        const itemPath = path.join(dir, item);
        if (fs.lstatSync(itemPath).isDirectory()) {
            removeEmptyDirs(itemPath);
            // Después de limpiar subdirectorios, verificar si este directorio está vacío
            if (isDirEmpty(itemPath)) {
                fs.rmdirSync(itemPath);
                console.log(`Directorio vacío eliminado: ${itemPath}`);
            }
        }
    });
}

// No eliminamos directorios vacíos automáticamente para ser conservadores
// Solo los reportamos
function reportEmptyDirs(dir) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    items.forEach(item => {
        const itemPath = path.join(dir, item);
        if (fs.lstatSync(itemPath).isDirectory()) {
            reportEmptyDirs(itemPath);
            if (isDirEmpty(itemPath)) {
                console.log(`Directorio vacío encontrado: ${itemPath}`);
            }
        }
    });
}

reportEmptyDirs(projectRoot);

// 8. Mostrar resumen de lo que se ha limpiado
console.log('\nLimpieza y organización completadas.');
console.log('\nResumen de acciones:');
console.log('- Archivos de registro eliminados');
console.log('- Archivos de configuración duplicados eliminados');
console.log('- Directorios de prueba innecesarios eliminados');
console.log('- Archivos temporales eliminados');

console.log('\nElementos que requieren revisión manual:');
console.log('- Directorios de backup (verificar si aún se necesitan)');
console.log('- Documentación dispersa (verificar si debe moverse a docs/)');

console.log('\nSiguientes pasos recomendados:');
console.log('1. Revisar manualmente los directorios de backup');
console.log('2. Mover documentación restante al directorio docs/');
console.log('3. Verificar que todos los componentes necesarios estén en dev/ y prod/');
console.log('4. Probar que el flujo de trabajo dev->prod funciona correctamente');
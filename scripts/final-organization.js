const fs = require('fs');
const path = require('path');

// Directorios base
const projectRoot = path.join(__dirname, '..');
const docsDir = path.join(projectRoot, 'docs');
const frontendDir = path.join(projectRoot, 'frontend');

console.log('Iniciando organización final del proyecto...\n');

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

// Función para copiar directorios recursivamente
function copyDir(source, destination) {
    if (!fs.existsSync(source)) return false;
    
    // Crear directorio de destino si no existe
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }
    
    const items = fs.readdirSync(source);
    let copiedCount = 0;
    
    items.forEach(item => {
        const sourcePath = path.join(source, item);
        const destPath = path.join(destination, item);
        
        if (fs.lstatSync(sourcePath).isDirectory()) {
            if (copyDir(sourcePath, destPath)) {
                copiedCount++;
            }
        } else {
            // Copiar archivo
            const fileContent = fs.readFileSync(sourcePath);
            fs.writeFileSync(destPath, fileContent);
            console.log(`Copiado: ${sourcePath} -> ${destPath}`);
            copiedCount++;
        }
    });
    
    return copiedCount > 0;
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

// 1. Mover documentación al directorio docs
console.log('1. Moviendo documentación al directorio docs...\n');

// Crear subdirectorios en docs
const docsSubDirs = [
    path.join(docsDir, 'architecture'),
    path.join(docsDir, 'development'),
    path.join(docsDir, 'deployment')
];

docsSubDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Directorio creado: ${dir}`);
    }
});

// Mover archivos de documentación
const docFilesToMove = [
    {
        source: path.join(projectRoot, 'PROJECT_ORGANIZATION.md'),
        destination: path.join(docsDir, 'PROJECT_ORGANIZATION.md')
    },
    {
        source: path.join(projectRoot, 'PROJECT_SUMMARY.md'),
        destination: path.join(docsDir, 'PROJECT_SUMMARY.md')
    },
    {
        source: path.join(projectRoot, 'FRONTEND_THEME.md'),
        destination: path.join(docsDir, 'development', 'FRONTEND_THEME.md')
    }
];

docFilesToMove.forEach(file => {
    moveFile(file.source, file.destination);
});

// Copiar contenido de documentacion al directorio docs
const docDirToCopy = path.join(frontendDir, 'documentacion');
if (fs.existsSync(docDirToCopy)) {
    copyDir(docDirToCopy, path.join(docsDir, 'legacy'));
    console.log('Contenido de documentacion copiado a docs/legacy');
}

// 2. Limpiar directorios de backup innecesarios
console.log('\n2. Limpiando directorios de backup...\n');

// Eliminar directorio de backups en frontend
const backupDirs = [
    path.join(frontendDir, 'backups'),
    path.join(frontendDir, 'components', 'backup')
];

backupDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        removeDir(dir);
    }
});

// 3. Eliminar directorios vacíos que no se necesitan
console.log('\n3. Eliminando directorios vacíos innecesarios...\n');

const emptyDirsToRemove = [
    path.join(projectRoot, 'backups'),
    path.join(frontendDir, 'dist'), // Este se regenera con el build
    path.join(frontendDir, 'layouts'),
    path.join(frontendDir, 'partials'),
    path.join(frontendDir, 'tests'),
    path.join(frontendDir, 'documentacion'),
    path.join(frontendDir, 'assets', 'js', 'core'),
    path.join(frontendDir, 'assets', 'js', 'error-monitoring'),
    path.join(frontendDir, 'assets', 'js', 'modules'),
    path.join(frontendDir, 'assets', 'js', 'vendors'),
    path.join(frontendDir, 'assets', 'css', 'base'),
    path.join(frontendDir, 'assets', 'css', 'components'),
    path.join(frontendDir, 'assets', 'css', 'layouts'),
    path.join(frontendDir, 'assets', 'css', 'pages'),
    path.join(frontendDir, 'assets', 'css', 'themes'),
    path.join(frontendDir, 'assets', 'css', 'vendors'),
    path.join(frontendDir, 'assets', 'images', 'banners'),
    path.join(frontendDir, 'assets', 'images', 'icons')
];

emptyDirsToRemove.forEach(dir => {
    if (fs.existsSync(dir)) {
        try {
            fs.rmdirSync(dir);
            console.log(`Directorio vacío eliminado: ${dir}`);
        } catch (err) {
            // El directorio no está vacío o hay otros problemas, lo dejamos
            console.log(`Directorio no eliminado (puede tener contenido): ${dir}`);
        }
    }
});

// 4. Crear archivo de control para indicar que el proyecto está organizado
console.log('\n4. Creando archivo de control...\n');

const projectStatus = {
    organized: true,
    date: new Date().toISOString(),
    version: '1.0.0',
    structure: 'dev-prod-separation'
};

fs.writeFileSync(
    path.join(projectRoot, 'PROJECT_STATUS.json'),
    JSON.stringify(projectStatus, null, 2)
);
console.log('Archivo de control PROJECT_STATUS.json creado');

console.log('\nOrganización final completada.');
console.log('\nResumen de acciones:');
console.log('- Documentación movida al directorio docs/');
console.log('- Directorios de backup eliminados');
console.log('- Directorios vacíos innecesarios eliminados');
console.log('- Archivo de control PROJECT_STATUS.json creado');

console.log('\nNueva estructura organizada:');
console.log(`
flores-1/
├── backend/                 # Código del servidor
├── dev/                     # Entorno de desarrollo
│   ├── assets/              # Recursos para desarrollo
│   ├── components/          # Componentes para desarrollo
│   └── pages/               # Páginas HTML para desarrollo
├── prod/                    # Entorno de producción
│   ├── assets/              # Recursos para producción
│   ├── components/          # Componentes para producción
│   └── pages/               # Páginas HTML para producción
├── dist/                    # Archivos compilados para producción
├── docs/                    # Documentación del proyecto
│   ├── architecture/        # Documentación de arquitectura
│   ├── development/         # Documentación de desarrollo
│   ├── deployment/          # Documentación de despliegue
│   └── legacy/              # Documentación heredada
├── scripts/                 # Scripts de utilidad
└── PROJECT_STATUS.json      # Estado del proyecto
`);

console.log('\nSiguientes pasos recomendados:');
console.log('1. Verificar que todos los archivos importantes estén en docs/');
console.log('2. Probar el flujo de trabajo dev->prod');
console.log('3. Ejecutar npm run build para verificar el empaquetado');
console.log('4. Eliminar manualmente cualquier archivo innecesario que haya quedado');
const fs = require('fs');
const path = require('path');

// Función para crear directorios si no existen
function createDirIfNotExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Directorio creado: ${dirPath}`);
    }
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
    }
}

// Función para eliminar directorios vacíos
function removeEmptyDirs(dirPath) {
    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        if (files.length === 0) {
            fs.rmdirSync(dirPath);
            console.log(`Directorio eliminado: ${dirPath}`);
        }
    }
}

// Función para eliminar archivos
function removeFile(filePath) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Archivo eliminado: ${filePath}`);
    }
}

// Directorios base
const projectRoot = path.join(__dirname, '..');
const frontendDir = path.join(projectRoot, 'frontend');
const assetsDir = path.join(frontendDir, 'assets');
const componentsDir = path.join(frontendDir, 'components');
const jsDir = path.join(assetsDir, 'js');
const cssDir = path.join(assetsDir, 'css');
const imagesDir = path.join(assetsDir, 'images');

console.log('Iniciando reorganización del proyecto...\n');

// 1. Crear estructura de directorios clara
console.log('1. Creando estructura de directorios...\n');

// Directorios principales
createDirIfNotExists(path.join(projectRoot, 'dist'));
createDirIfNotExists(path.join(projectRoot, 'docs'));
createDirIfNotExists(path.join(projectRoot, 'scripts'));
createDirIfNotExists(path.join(projectRoot, 'tests'));

// Directorios de frontend
createDirIfNotExists(path.join(frontendDir, 'pages'));
createDirIfNotExists(path.join(frontendDir, 'layouts'));
createDirIfNotExists(path.join(frontendDir, 'partials'));

// Subdirectorios de assets
createDirIfNotExists(path.join(jsDir, 'core'));
createDirIfNotExists(path.join(jsDir, 'modules'));
createDirIfNotExists(path.join(jsDir, 'vendors'));
createDirIfNotExists(path.join(cssDir, 'base'));
createDirIfNotExists(path.join(cssDir, 'components'));
createDirIfNotExists(path.join(cssDir, 'layouts'));
createDirIfNotExists(path.join(cssDir, 'pages'));
createDirIfNotExists(path.join(cssDir, 'themes'));
createDirIfNotExists(path.join(cssDir, 'vendors'));
createDirIfNotExists(path.join(imagesDir, 'products'));
createDirIfNotExists(path.join(imagesDir, 'icons'));
createDirIfNotExists(path.join(imagesDir, 'banners'));

// 2. Mover componentes duplicados/obsoletos a backup
console.log('2. Organizando componentes...\n');

// Mover componentes de frontend/components a frontend/components/backup si ya existen versiones más recientes
const oldComponents = [
    'Testimonials.js'
];

oldComponents.forEach(component => {
    const oldPath = path.join(componentsDir, component);
    const backupPath = path.join(componentsDir, 'backup', component);
    if (fs.existsSync(oldPath)) {
        moveFile(oldPath, backupPath);
    }
});

// 3. Organizar archivos JavaScript
console.log('3. Organizando archivos JavaScript...\n');

// Mover archivos JS principales a estructura organizada
const jsComponents = [
    // Ya están organizados en la estructura actual
];

// 4. Limpiar archivos innecesarios o duplicados
console.log('4. Limpiando archivos innecesarios...\n');

// Eliminar archivos de configuración duplicados si existen en la raíz
const configFilesToRemove = [
    path.join(projectRoot, 'vite.config.simple.js'),
    path.join(projectRoot, 'build.js'),
    path.join(projectRoot, 'build-simple.js')
];

configFilesToRemove.forEach(file => {
    removeFile(file);
});

// 5. Organizar páginas HTML
console.log('5. Organizando páginas HTML...\n');

// Las páginas HTML ya están en la raíz de frontend, lo cual es correcto

// 6. Crear documentación centralizada
console.log('6. Creando documentación centralizada...\n');

// Si existe documentación dispersa, moverla a docs/
const docsToMove = [
    path.join(frontendDir, 'documentacion'),
    path.join(frontendDir, 'docs')
];

docsToMove.forEach(docDir => {
    if (fs.existsSync(docDir) && docDir !== path.join(projectRoot, 'docs')) {
        // Mover contenido a docs/
        if (fs.lstatSync(docDir).isDirectory()) {
            const files = fs.readdirSync(docDir);
            files.forEach(file => {
                const source = path.join(docDir, file);
                const dest = path.join(projectRoot, 'docs', file);
                moveFile(source, dest);
            });
        }
    }
});

console.log('\nReorganización completada.');
console.log('\nNueva estructura del proyecto:');
console.log(`
flores-1/
├── backend/                 # Código del servidor
├── frontend/                # Código del cliente
│   ├── assets/              # Recursos estáticos
│   │   ├── css/             # Hojas de estilo
│   │   │   ├── base/        # Estilos base
│   │   │   ├── components/  # Estilos de componentes
│   │   │   ├── layouts/     # Estilos de layouts
│   │   │   ├── pages/       # Estilos específicos de páginas
│   │   │   ├── themes/      # Temas
│   │   │   └── vendors/     # Estilos de terceros
│   │   ├── images/          # Imágenes
│   │   │   ├── products/    # Imágenes de productos
│   │   │   ├── icons/       # Iconos
│   │   │   └── banners/     # Banners y gráficos
│   │   └── js/              # Scripts JavaScript
│   │       ├── core/        # Núcleo de la aplicación
│   │       ├── modules/     # Módulos específicos
│   │       ├── vendors/     # Librerías de terceros
│   │       └── main.js      # Punto de entrada principal
│   ├── components/          # Componentes web
│   │   └── backup/          # Componentes obsoletos
│   ├── pages/               # Páginas HTML
│   ├── layouts/             # Layouts base
│   └── partials/            # Fragmentos reutilizables
├── dist/                    # Archivos compilados para producción
├── docs/                    # Documentación del proyecto
├── scripts/                 # Scripts de utilidad
├── tests/                   # Pruebas
└── README.md                # Documentación principal
`);

console.log('\nSiguientes pasos recomendados:');
console.log('1. Verificar que todos los archivos se hayan movido correctamente');
console.log('2. Actualizar las referencias en los archivos HTML y JS');
console.log('3. Ejecutar npm run build para verificar que el empaquetado funciona');
console.log('4. Probar la aplicación en modo desarrollo');
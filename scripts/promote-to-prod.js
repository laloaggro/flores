const fs = require('fs');
const path = require('path');

// Directorios base
const projectRoot = path.join(__dirname, '..');
const devDir = path.join(projectRoot, 'dev');
const prodDir = path.join(projectRoot, 'prod');

console.log('Promocionando cambios de desarrollo a producción...\n');

// Verificar que existan los directorios
if (!fs.existsSync(devDir)) {
    console.error('Error: El directorio de desarrollo no existe');
    process.exit(1);
}

if (!fs.existsSync(prodDir)) {
    console.error('Error: El directorio de producción no existe');
    process.exit(1);
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
        fs.copyFileSync(source, destination);
        console.log(`Copiado: ${source} -> ${destination}`);
        return true;
    }
    return false;
}

// Función para copiar directorios recursivamente
function copyDir(source, destination) {
    if (!fs.existsSync(source)) {
        console.log(`Directorio fuente no existe: ${source}`);
        return false;
    }
    
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
            if (copyFile(sourcePath, destPath)) {
                copiedCount++;
            }
        }
    });
    
    console.log(`Directorio copiado: ${source} -> ${destination} (${copiedCount} elementos)`);
    return true;
}

// Función para eliminar un directorio y su contenido
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
    }
}

// Función para sincronizar directorios (eliminar en destino lo que ya no existe en origen)
function syncDirs(source, destination) {
    if (!fs.existsSync(source)) return;
    
    // Si el destino no existe, simplemente copiar
    if (!fs.existsSync(destination)) {
        copyDir(source, destination);
        return;
    }
    
    // Copiar contenido del source al destination
    const sourceItems = fs.readdirSync(source);
    copyDir(source, destination);
    
    // Verificar si hay elementos en destination que ya no están en source y eliminarlos
    const destItems = fs.readdirSync(destination);
    destItems.forEach(item => {
        if (!sourceItems.includes(item)) {
            const destPath = path.join(destination, item);
            if (fs.lstatSync(destPath).isDirectory()) {
                removeDir(destPath);
            } else {
                fs.unlinkSync(destPath);
                console.log(`Eliminado: ${destPath}`);
            }
        }
    });
}

// Promocionar componentes
console.log('1. Promocionando componentes...\n');
syncDirs(
    path.join(devDir, 'components'),
    path.join(prodDir, 'components')
);

// Promocionar páginas
console.log('2. Promocionando páginas...\n');
syncDirs(
    path.join(devDir, 'pages'),
    path.join(prodDir, 'pages')
);

// Promocionar assets
console.log('3. Promocionando assets...\n');
syncDirs(
    path.join(devDir, 'assets'),
    path.join(prodDir, 'assets')
);

// Actualizar configuración de producción
console.log('4. Actualizando configuración de producción...\n');
if (fs.existsSync(path.join(devDir, 'dev-config.json'))) {
    const devConfig = JSON.parse(fs.readFileSync(path.join(devDir, 'dev-config.json'), 'utf8'));
    const prodConfig = {
        environment: 'production',
        version: devConfig.version,
        components: devConfig.components,
        lastUpdate: new Date().toISOString(),
        promotedFromDev: true
    };
    
    fs.writeFileSync(
        path.join(prodDir, 'prod-config.json'),
        JSON.stringify(prodConfig, null, 2)
    );
    console.log('Configuración de producción actualizada');
}

console.log('\nPromoción completada exitosamente.');
console.log('\nResumen de cambios:');
console.log('- Componentes actualizados');
console.log('- Páginas actualizadas');
console.log('- Assets actualizados');
console.log('- Configuración de producción actualizada');

console.log('\nSiguientes pasos recomendados:');
console.log('1. Verificar que los cambios en producción sean correctos');
console.log('2. Ejecutar el proceso de empaquetado para generar la nueva versión');
console.log('3. Probar la aplicación con los nuevos cambios');
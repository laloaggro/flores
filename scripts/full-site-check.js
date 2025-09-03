const http = require('http');
const fs = require('fs');
const path = require('path');

// Directorios
const devDir = path.join(__dirname, '..', 'dev');

// Verificar existencia de directorios y archivos importantes
console.log('=== VERIFICACIÓN DE ESTRUCTURA DE ARCHIVOS ===\n');

const requiredDirs = [
  'assets',
  'assets/css',
  'assets/js',
  'assets/images',
  'pages'
];

requiredDirs.forEach(dir => {
  const fullPath = path.join(devDir, dir);
  if (fs.existsSync(fullPath)) {
    console.log(`✓ Directorio ${dir} existe`);
  } else {
    console.log(`✗ Directorio ${dir} NO existe`);
  }
});

console.log('\n=== VERIFICACIÓN DE ARCHIVOS CSS ===\n');

const cssFiles = [
  '/assets/css/styles.css',
  '/assets/css/index.css'
];

cssFiles.forEach(file => {
  const filePath = path.join(devDir, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✓ ${file} - Existe (${stats.size} bytes)`);
  } else {
    console.log(`✗ ${file} - NO existe`);
  }
});

console.log('\n=== VERIFICACIÓN DE ARCHIVOS JS ===\n');

const jsFiles = [
  '/assets/js/main.js'
];

jsFiles.forEach(file => {
  const filePath = path.join(devDir, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✓ ${file} - Existe (${stats.size} bytes)`);
  } else {
    console.log(`✗ ${file} - NO existe`);
  }
});

console.log('\n=== VERIFICACIÓN DE IMÁGENES ===\n');

const imageFiles = [
  '/assets/images/logo.png',
  '/assets/images/hero-image.jpg',
  '/assets/images/favicon.ico'
];

imageFiles.forEach(file => {
  const filePath = path.join(devDir, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✓ ${file} - Existe (${stats.size} bytes)`);
  } else {
    console.log(`✗ ${file} - NO existe`);
  }
});

console.log('\n=== VERIFICACIÓN DEL SERVIDOR ===\n');

// Verificar que el servidor responda correctamente
const checks = [
  { path: '/', name: 'Página principal' },
  { path: '/assets/css/styles.css', name: 'CSS principal' },
  { path: '/assets/css/index.css', name: 'CSS de index' },
  { path: '/assets/js/main.js', name: 'JavaScript principal' },
  { path: '/assets/images/logo.png', name: 'Logo' },
  { path: '/assets/images/hero-image.jpg', name: 'Imagen hero' }
];

let completedChecks = 0;

function performCheck(check) {
  const options = {
    hostname: 'localhost',
    port: 3004,
    path: check.path,
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    if (res.statusCode === 200) {
      console.log(`✓ ${check.name} - Código 200 OK`);
    } else {
      console.log(`✗ ${check.name} - Código ${res.statusCode}`);
    }
    
    completedChecks++;
    if (completedChecks === checks.length) {
      console.log('\n=== VERIFICACIÓN COMPLETA ===');
      console.log('Si todos los elementos tienen marca ✓, el sitio debería funcionar correctamente.');
    }
  });

  req.on('error', (e) => {
    console.log(`✗ ${check.name} - Error: ${e.message}`);
    completedChecks++;
    if (completedChecks === checks.length) {
      console.log('\n=== VERIFICACIÓN COMPLETA ===');
      console.log('Si todos los elementos tienen marca ✓, el sitio debería funcionar correctamente.');
    }
  });

  req.end();
}

// Ejecutar todas las verificaciones
checks.forEach(check => {
  setTimeout(() => performCheck(check), 100);
});
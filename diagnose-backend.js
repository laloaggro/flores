// Script para diagnosticar problemas con el backend
const fs = require('fs');
const path = require('path');

console.log('=== Diagnóstico del Backend ===\n');

// Verificar estructura de directorios
console.log('1. Verificando estructura de directorios...');
const backendDir = path.join(__dirname, 'backend');
console.log(`   Directorio backend: ${backendDir}`);
console.log(`   Existe: ${fs.existsSync(backendDir)}`);

if (fs.existsSync(backendDir)) {
  const files = fs.readdirSync(backendDir);
  console.log('   Archivos en el directorio backend:');
  files.forEach(file => {
    console.log(`     - ${file}`);
  });
}

// Verificar package.json
console.log('\n2. Verificando package.json...');
const packagePath = path.join(backendDir, 'package.json');
console.log(`   Archivo package.json: ${packagePath}`);
console.log(`   Existe: ${fs.existsSync(packagePath)}`);

if (fs.existsSync(packagePath)) {
  try {
    const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log('   Dependencias:');
    Object.keys(packageData.dependencies || {}).forEach(dep => {
      console.log(`     - ${dep}: ${packageData.dependencies[dep]}`);
    });
  } catch (error) {
    console.log(`   Error leyendo package.json: ${error.message}`);
  }
}

// Verificar archivos importantes
console.log('\n3. Verificando archivos importantes...');
const importantFiles = ['server.js', 'config/security.js', 'utils/logger.js'];
importantFiles.forEach(file => {
  const filePath = path.join(backendDir, file);
  console.log(`   ${file}: ${fs.existsSync(filePath) ? 'Encontrado' : 'No encontrado'}`);
});

// Verificar node_modules
console.log('\n4. Verificando node_modules...');
const nodeModulesPath = path.join(backendDir, 'node_modules');
console.log(`   Directorio node_modules: ${nodeModulesPath}`);
console.log(`   Existe: ${fs.existsSync(nodeModulesPath)}`);

if (fs.existsSync(nodeModulesPath)) {
  const dirs = fs.readdirSync(nodeModulesPath);
  console.log(`   Número de directorios en node_modules: ${dirs.length}`);
  
  // Verificar algunas dependencias clave
  const keyDeps = ['express', 'express-rate-limit', 'dotenv'];
  keyDeps.forEach(dep => {
    const depPath = path.join(nodeModulesPath, dep);
    console.log(`   ${dep}: ${fs.existsSync(depPath) ? 'Instalado' : 'No instalado'}`);
  });
}

console.log('\n=== Fin del diagnóstico ===');
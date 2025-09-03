#!/usr/bin/env node

// scripts/debug-build.js
// Script para diagnosticar problemas de empaquetado

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Función para ejecutar un comando y capturar su salida
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { ...options, stdio: 'pipe' });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

// Función para verificar la estructura de directorios
function checkDirectoryStructure() {
  console.log('🔍 Verificando estructura de directorios...');
  
  const dirs = [
    'frontend',
    'frontend/assets',
    'frontend/assets/js',
    'frontend/assets/js/components',
    'frontend/assets/js/components/ui',
    'frontend/assets/js/components/utils',
    'frontend/assets/js/components/product',
    'frontend/assets/js/components/cart',
    'frontend/assets/js/components/pages'
  ];
  
  dirs.forEach(dir => {
    const fullPath = path.resolve(__dirname, '../', dir);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${dir}`);
    } else {
      console.log(`❌ ${dir} (no existe)`);
    }
  });
}

// Función para verificar archivos HTML
function checkHtmlFiles() {
  console.log('\n📄 Verificando archivos HTML...');
  
  const frontendPath = path.resolve(__dirname, '../frontend');
  if (!fs.existsSync(frontendPath)) {
    console.log('❌ Directorio frontend no encontrado');
    return;
  }
  
  const htmlFiles = fs.readdirSync(frontendPath)
    .filter(file => file.endsWith('.html'));
  
  console.log(`Encontrados ${htmlFiles.length} archivos HTML:`);
  htmlFiles.forEach(file => {
    console.log(`  📄 ${file}`);
  });
}

// Función para verificar archivos de componentes
function checkComponentFiles() {
  console.log('\n🔧 Verificando archivos de componentes...');
  
  const componentDirs = [
    'frontend/assets/js/components/ui',
    'frontend/assets/js/components/utils',
    'frontend/assets/js/components/product',
    'frontend/assets/js/components/cart',
    'frontend/assets/js/components/pages'
  ];
  
  componentDirs.forEach(dir => {
    const fullPath = path.resolve(__dirname, '../', dir);
    if (fs.existsSync(fullPath)) {
      const files = fs.readdirSync(fullPath);
      console.log(`📁 ${dir} (${files.length} archivos):`);
      files.forEach(file => {
        console.log(`    📄 ${file}`);
      });
    } else {
      console.log(`❌ ${dir} (no existe)`);
    }
  });
}

// Función para ejecutar el empaquetado con diagnóstico detallado
async function runBuildWithDiagnostics() {
  console.log('\n🔨 Ejecutando empaquetado con diagnóstico...');
  
  try {
    // Ejecutar vite build con salida detallada
    const { code, stdout, stderr } = await runCommand('npx', ['vite', 'build', '--debug'], {
      cwd: path.resolve(__dirname, '..')
    });
    
    console.log(`Código de salida: ${code}`);
    if (stdout) {
      console.log('Salida estándar:');
      console.log(stdout);
    }
    
    if (stderr) {
      console.log('Salida de error:');
      console.log(stderr);
    }
    
    // Verificar si se creó el directorio dist
    const distPath = path.resolve(__dirname, '../dist');
    if (fs.existsSync(distPath)) {
      console.log('✅ Directorio dist creado exitosamente');
      const files = fs.readdirSync(distPath);
      console.log(`Archivos en dist: ${files.length}`);
      files.forEach(file => {
        console.log(`  📄 ${file}`);
      });
    } else {
      console.log('❌ Directorio dist no se creó');
    }
    
    return { code, stdout, stderr };
  } catch (error) {
    console.error('Error al ejecutar el empaquetado:', error);
    return { code: -1, stdout: '', stderr: error.message };
  }
}

// Función para verificar la configuración de Vite
function checkViteConfig() {
  console.log('\n⚙️ Verificando configuración de Vite...');
  
  const viteConfigPath = path.resolve(__dirname, '../vite.config.js');
  if (fs.existsSync(viteConfigPath)) {
    console.log('✅ Archivo vite.config.js encontrado');
    const configContent = fs.readFileSync(viteConfigPath, 'utf8');
    console.log('Contenido del archivo (primeras 20 líneas):');
    console.log(configContent.split('\n').slice(0, 20).join('\n'));
  } else {
    console.log('❌ Archivo vite.config.js no encontrado');
  }
}

// Función principal
async function main() {
  console.log('🔍 Diagnóstico de problemas de empaquetado\n');
  
  // Verificar estructura de directorios
  checkDirectoryStructure();
  
  // Verificar archivos HTML
  checkHtmlFiles();
  
  // Verificar archivos de componentes
  checkComponentFiles();
  
  // Verificar configuración de Vite
  checkViteConfig();
  
  // Ejecutar empaquetado con diagnóstico
  await runBuildWithDiagnostics();
  
  console.log('\n✅ Diagnóstico completado');
}

// Ejecutar diagnóstico
main();
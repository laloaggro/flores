#!/usr/bin/env node

/**
 * Script para iniciar los microservicios
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('Iniciando microservicios...');
console.log('========================\n');

// Directorio de microservicios
const microservicesDir = path.join(__dirname, 'microservices');

// Iniciar los microservicios con docker-compose
const microservices = spawn('docker', ['compose', 'up', '-d'], {
  cwd: microservicesDir,
  stdio: 'inherit'
});

// Manejar cierre de procesos
process.on('SIGINT', () => {
  console.log('\nDeteniendo microservicios...');
  const stopServices = spawn('docker', ['compose', 'down'], {
    cwd: microservicesDir,
    stdio: 'inherit'
  });
  
  stopServices.on('close', () => {
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\nDeteniendo microservicios...');
  const stopServices = spawn('docker', ['compose', 'down'], {
    cwd: microservicesDir,
    stdio: 'inherit'
  });
  
  stopServices.on('close', () => {
    process.exit(0);
  });
});

// Manejar errores en los procesos
microservices.on('error', (err) => {
  console.error('Error al iniciar microservicios:', err);
});

microservices.on('exit', (code) => {
  if (code === 0) {
    console.log('\nMicroservicios iniciados correctamente');
    console.log('API Gateway disponible en: http://localhost:3000');
    console.log('Para detener los microservicios, presione Ctrl+C');
  } else {
    console.log(`Microservicios finalizados con código ${code}`);
    if (code !== 0) {
      process.exit(code);
    }
  }
});
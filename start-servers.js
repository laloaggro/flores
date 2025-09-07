#!/usr/bin/env node

/**
 * Script para iniciar ambos servidores (frontend y backend) simultáneamente
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('Iniciando servidores frontend y backend...');
console.log('========================================\n');

// Iniciar el servidor backend
const backend = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  env: { ...process.env, PORT: '5000' }
});

// Iniciar el servidor frontend
const frontend = spawn('node', ['start-frontend.js'], {
  cwd: __dirname,
  stdio: 'inherit'
});

// Manejar cierre de procesos
process.on('SIGINT', () => {
  console.log('\nDeteniendo servidores...');
  backend.kill();
  frontend.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nDeteniendo servidores...');
  backend.kill();
  frontend.kill();
  process.exit(0);
});

// Manejar errores en los procesos
backend.on('error', (err) => {
  console.error('Error en el servidor backend:', err);
});

frontend.on('error', (err) => {
  console.error('Error en el servidor frontend:', err);
});

backend.on('exit', (code) => {
  console.log(`Servidor backend finalizado con código ${code}`);
  if (code !== 0) {
    process.exit(code);
  }
});

frontend.on('exit', (code) => {
  console.log(`Servidor frontend finalizado con código ${code}`);
  if (code !== 0) {
    process.exit(code);
  }
});
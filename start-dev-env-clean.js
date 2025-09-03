const { spawn } = require('child_process');
const path = require('path');

// Directorios
const projectRoot = path.join(__dirname);
const devDir = path.join(projectRoot, 'dev');
const backendDir = path.join(projectRoot, 'backend');

console.log('Iniciando entorno de desarrollo limpio...');
console.log('=====================================\n');

// Primero detenemos cualquier proceso existente
console.log('Deteniendo procesos existentes...');
const stopProcesses = spawn('node', ['stop-dev-env.js'], {
  cwd: projectRoot
});

stopProcesses.on('close', (code) => {
  console.log('Procesos anteriores detenidos.\n');
  
  // Iniciar el backend
  console.log('Iniciando servidor backend...');
  const backend = spawn('node', ['server.js'], {
    cwd: backendDir
  });

  backend.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Servidor backend corriendo')) {
      console.log(`[Backend] ${output.trim()}`);
    }
  });

  backend.stderr.on('data', (data) => {
    console.error(`[Backend Error] ${data}`);
  });

  // Esperar un momento y luego iniciar el frontend
  setTimeout(() => {
    console.log('\nIniciando servidor frontend...');
    const frontend = spawn('node', ['start-frontend.js'], {
      cwd: projectRoot
    });

    frontend.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Servidor frontend iniciado')) {
        console.log(`[Frontend] ${output.trim()}`);
        showFinalInstructions();
      }
    });

    frontend.stderr.on('data', (data) => {
      console.error(`[Frontend Error] ${data}`);
    });
  }, 2000);
});

function showFinalInstructions() {
  console.log('\n=====================================');
  console.log('✅ Entorno de desarrollo iniciado correctamente');
  console.log('=====================================');
  console.log('Accesos:');
  console.log('- Frontend: http://localhost:3006');
  console.log('- Backend API: http://localhost:5000');
  console.log('');
  console.log('APIs disponibles:');
  console.log('- Productos: http://localhost:5000/api/products');
  console.log('- Usuarios: http://localhost:5000/api/users');
  console.log('- Carrito: http://localhost:5000/api/cart');
  console.log('- Lista de deseos: http://localhost:5000/api/wishlist');
  console.log('');
  console.log('Para detener el entorno de desarrollo, presione Ctrl+C');
  console.log('o ejecute: node stop-dev-env.js');
  console.log('=====================================\n');
}
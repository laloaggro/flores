console.log('Deteniendo entorno de desarrollo...');

// Función para ejecutar un comando y mostrar su salida
const { exec } = require('child_process');

const commands = [
  'pkill -f "node.*server.js"',
  'pkill -f "node.*start-dev-env"',
  'pkill -f "node.*frontend"',
  'pkill -f "node.*3005"',
  'pkill -f "node.*3006"'
];

commands.forEach((cmd, index) => {
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.log(`Comando ejecutado: ${cmd} (puede que no haya procesos que detener)`);
    } else {
      console.log(`Comando ejecutado: ${cmd}`);
    }
    
    // Mostrar mensaje final cuando todos los comandos se hayan ejecutado
    if (index === commands.length - 1) {
      console.log('\n✅ Todos los procesos del entorno de desarrollo han sido detenidos.');
      console.log('\nPuertos liberados:');
      console.log('- Frontend: 3006');
      console.log('- Backend: 5000');
    }
  });
});
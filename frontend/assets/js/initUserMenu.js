import { initUserMenu } from './auth.js';

// Inicializar el menú de usuario cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
  console.log('Iniciando menú de usuario desde initUserMenu.js');
  try {
    initUserMenu();
    console.log('Menú de usuario inicializado correctamente');
  } catch (error) {
    console.error('Error al inicializar el menú de usuario:', error);
  }
});
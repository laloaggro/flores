import { showNotification, updateCartCount, API_BASE_URL } from './utils.js';
import { initUserMenu } from './auth.js';

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar menú de usuario
  initUserMenu();
  
  // Elementos del DOM
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const showRegisterLink = document.getElementById('showRegister');
  const showLoginLink = document.getElementById('showLogin');
  const loginContainer = document.querySelector('.login-form-container');
  const registerContainer = document.querySelector('.register-form-container');
  
  // Mostrar formulario de registro
  if (showRegisterLink) {
    showRegisterLink.addEventListener('click', function(e) {
      e.preventDefault();
      if (loginContainer) loginContainer.classList.add('hidden');
      if (registerContainer) registerContainer.classList.remove('hidden');
    });
  }
  
  // Mostrar formulario de login
  if (showLoginLink) {
    showLoginLink.addEventListener('click', function(e) {
      e.preventDefault();
      if (registerContainer) registerContainer.classList.add('hidden');
      if (loginContainer) loginContainer.classList.remove('hidden');
    });
  }
  
  // Manejar envío del formulario de login
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleLogin();
    });
  }
  
  // Manejar envío del formulario de registro
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleRegister();
    });
  }
  
  // Inicializar contador del carrito
  updateCartCount();
});

// Inicializar contador del carrito
updateCartCount();
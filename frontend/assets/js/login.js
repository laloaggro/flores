import { showNotification, updateCartCount } from './utils.js';

document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const showRegisterLink = document.getElementById('showRegister');
  const showLoginLink = document.getElementById('showLogin');
  const loginContainer = document.querySelector('.login-form-container');
  const registerContainer = document.querySelector('.register-form-container');
  
  // Mostrar formulario de registro
  showRegisterLink.addEventListener('click', function(e) {
    e.preventDefault();
    loginContainer.classList.add('hidden');
    registerContainer.classList.remove('hidden');
  });
  
  // Mostrar formulario de login
  showLoginLink.addEventListener('click', function(e) {
    e.preventDefault();
    registerContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
  });
  
  // Manejar envío de formulario de login
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Autenticar al usuario
    loginUser(email, password);
  });
  
  // Manejar envío de formulario de registro
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      showNotification('Las contraseñas no coinciden', 'error');
      return;
    }
    
    // Registrar al usuario
    registerUser(name, email, phone, password);
  });
  
  // Función para iniciar sesión
  function loginUser(email, password) {
    // Mostrar información de depuración
    console.log('Iniciando sesión con:', email, password);
    
    // Realizar solicitud al backend
    fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        showNotification(data.error, 'error');
        return;
      }
      
      // Guardar usuario en localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      
      showNotification('Inicio de sesión exitoso', 'success');
      
      // Mostrar información de depuración
      console.log('Usuario autenticado:', data.user);
      
      // Redirigir a la página principal después de 1.5 segundos
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    })
    .catch(error => {
      console.error('Error al iniciar sesión:', error);
      showNotification('Error al iniciar sesión', 'error');
    });
  }
  
  // Función para registrar usuario
  function registerUser(name, email, phone, password) {
    // Mostrar información de depuración
    console.log('Registrando usuario:', name, email, phone, password);
    
    // Realizar solicitud al backend
    fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, phone, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        showNotification(data.error, 'error');
        return;
      }
      
      showNotification('Registro exitoso. Ahora puedes iniciar sesión.', 'success');
      
      // Mostrar información de depuración
      console.log('Usuario registrado:', data);
      
      // Limpiar formulario
      registerForm.reset();
      
      // Mostrar formulario de login
      registerContainer.classList.add('hidden');
      loginContainer.classList.remove('hidden');
    })
    .catch(error => {
      console.error('Error al registrar usuario:', error);
      showNotification('Error al registrar usuario', 'error');
    });
  }
});

// Inicializar contador del carrito
updateCartCount();

import { showNotification, updateCartCount, API_BASE_URL } from './utils.js';

document.addEventListener('DOMContentLoaded', function() {
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
  
  // Manejar envío de formulario de login
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      // Validar campos
      if (!email || !password) {
        showNotification('Por favor complete todos los campos', 'error');
        return;
      }
      
      // Enviar datos al servidor
      fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      .then(response => response.json())
      .then(data => {
        if (data.user && data.token) {
          // Guardar información del usuario en localStorage
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);
          showNotification('Inicio de sesión exitoso', 'success');
          
          // Redirigir según el rol del usuario
          setTimeout(() => {
            if (data.user.role === 'admin') {
              // Redirigir al panel de administración
              window.location.href = 'pages/admin.html';
            } else {
              // Redirigir a la página de perfil para usuarios normales
              window.location.href = 'profile.html';
            }
          }, 1000);
        } else {
          showNotification(data.error || 'Error en el inicio de sesión', 'error');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        showNotification('Error en el inicio de sesión. Verifique que el servidor esté ejecutándose.', 'error');
      });
    });
  }
  
  // Manejar envío de formulario de registro
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Corregir los IDs para que coincidan con el HTML
      const firstName = document.getElementById('registerFirstName').value;
      const lastName = document.getElementById('registerLastName').value;
      const email = document.getElementById('registerEmail').value;
      const phone = document.getElementById('registerPhone').value;
      const password = document.getElementById('registerPassword').value;
      const confirmPassword = document.getElementById('registerConfirmPassword').value;
      
      // Validar campos
      if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        showNotification('Por favor complete todos los campos', 'error');
        return;
      }
      
      // Combinar nombre y apellido
      const name = firstName + ' ' + lastName;
      
      if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
      }
      
      // Enviar datos al servidor
      fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, password })
      })
      .then(response => response.json())
      .then(data => {
        if (data.message && data.message.includes('exitoso')) {
          showNotification('Registro exitoso', 'success');
          
          // Limpiar formulario
          registerForm.reset();
          
          // Cambiar a formulario de login
          if (registerContainer) registerContainer.classList.add('hidden');
          if (loginContainer) loginContainer.classList.remove('hidden');
        } else {
          showNotification(data.error || 'Error en el registro', 'error');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        showNotification('Error en el registro. Verifique que el servidor esté ejecutándose.', 'error');
      });
    });
  }
  
  // Inicializar contador del carrito
  updateCartCount();
});

// Inicializar contador del carrito
updateCartCount();
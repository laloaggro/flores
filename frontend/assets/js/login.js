// login.js - Manejo del inicio de sesión y registro de usuarios

// Importar funciones necesarias de utils.js y auth.js
import { showNotification, updateCartCount, validateEmail, validatePhone } from './utils.js';
import { initUserMenu } from './auth.js';

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
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const submitButton = loginForm.querySelector('button[type="submit"]');
      
      // Validar campos
      if (!email || !password) {
        showNotification('Por favor complete todos los campos', 'error');
        return;
      }
      
      // Validar formato de email
      if (!validateEmail(email)) {
        showNotification('Formato de email inválido', 'error');
        return;
      }
      
      // Validar longitud mínima de contraseña
      if (password.length < 6) {
        showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
      }
      
      // Deshabilitar botón durante el proceso
      submitButton.disabled = true;
      submitButton.textContent = 'Iniciando sesión...';
      
      try {
        // Enviar solicitud al servidor
        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Guardar información del usuario en localStorage
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Mostrar notificación de éxito
          showNotification(`¡Bienvenido ${data.user.name}!`, 'success');
          
          // Inicializar el menú de usuario
          initUserMenu();
          
          // Redirigir al usuario después de un breve retraso
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        } else {
          // Mostrar error
          showNotification(data.error || 'Error al iniciar sesión', 'error');
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        showNotification('Error de conexión. Por favor intente nuevamente.', 'error');
      } finally {
        // Rehabilitar botón
        submitButton.disabled = false;
        submitButton.textContent = 'Iniciar Sesión';
      }
    });
  }
  
  // Manejar envío de formulario de registro
  if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const name = document.getElementById('registerName').value;
      const email = document.getElementById('registerEmail').value;
      const phone = document.getElementById('registerPhone').value;
      const password = document.getElementById('registerPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const submitButton = registerForm.querySelector('button[type="submit"]');
      
      // Validar campos
      if (!name || !email || !phone || !password || !confirmPassword) {
        showNotification('Por favor complete todos los campos', 'error');
        return;
      }
      
      // Validar formato de email
      if (!validateEmail(email)) {
        showNotification('Formato de email inválido', 'error');
        return;
      }
      
      // Validar formato de teléfono
      if (!validatePhone(phone)) {
        showNotification('Formato de teléfono inválido', 'error');
        return;
      }
      
      // Validar longitud mínima de contraseña
      if (password.length < 6) {
        showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
      }
      
      if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
      }
      
      // Deshabilitar botón durante el proceso
      submitButton.disabled = true;
      submitButton.textContent = 'Registrando...';
      
      try {
        // Enviar solicitud al servidor
        const response = await fetch('/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Mostrar notificación de éxito
          showNotification('¡Registro exitoso! Ahora puede iniciar sesión.', 'success');
          
          // Limpiar formulario
          registerForm.reset();
          
          // Cambiar a la vista de inicio de sesión después de un breve retraso
          setTimeout(() => {
            document.getElementById('showLogin').click();
          }, 2000);
        } else {
          // Mostrar error
          showNotification(data.error || 'Error al registrarse', 'error');
        }
      } catch (error) {
        console.error('Error al registrarse:', error);
        showNotification('Error de conexión. Por favor intente nuevamente.', 'error');
      } finally {
        // Rehabilitar botón
        submitButton.disabled = false;
        submitButton.textContent = 'Registrarse';
      }
    });
  }
});

// Función para manejar el cierre de sesión
function handleLogout() {
  // Eliminar información del usuario del localStorage
  localStorage.removeItem('user');
  
  // Mostrar notificación de éxito
  showNotification('Sesión cerrada correctamente', 'success');
  
  // Recargar la página después de un breve retraso
  setTimeout(() => {
    // Si estamos en una página que requiere autenticación, redirigir al inicio
    if (window.location.pathname.includes('profile') || 
        window.location.pathname.includes('cart')) {
      window.location.href = '/';
    } else {
      // Solo recargar la página para actualizar el menú
      window.location.reload();
    }
  }, 1500);
}

// Exportar funciones que necesitamos usar en otros archivos
export { handleLogout, initUserMenu, updateCartCount };
import { showNotification, updateCartCount, API_BASE_URL } from './utils.js';
import { initUserMenu } from './auth.js';

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar menú de usuario
  initUserMenu();
  
  // Elementos del DOM
  const registerForm = document.getElementById('registerForm');
  
  // Manejar envío de formulario de registro
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Obtener valores de los campos
      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      // Validar campos
      if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        showNotification('Por favor, completa todos los campos', 'error');
        return;
      }
      
      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification('Por favor, ingresa un email válido', 'error');
        return;
      }
      
      // Validar teléfono
      const phoneRegex = /^(\+56)?[\s\-]?[9\d][\s\-]?\d{4}[\s\-]?\d{4}$/;
      if (!phoneRegex.test(phone.replace(/\s+/g, ' ').trim())) {
        showNotification('Por favor, ingresa un teléfono válido (ej: +56912345678)', 'error');
        return;
      }
      
      // Validar contraseña
      if (password.length < 6) {
        showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
      }
      
      // Verificar que las contraseñas coincidan
      if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
      }
      
      // Registrar usuario
      registerUser({ firstName, lastName, email, phone, password });
    });
  }
  
  // Inicializar contador del carrito
  updateCartCount();
});

// Función para registrar usuario
async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al registrar usuario');
    }
    
    showNotification('Usuario registrado exitosamente. Ahora puedes iniciar sesión.', 'success');
    
    // Redirigir a la página de login después de 2 segundos
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

// Inicializar contador del carrito
updateCartCount();
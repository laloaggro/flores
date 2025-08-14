import { showNotification, updateCartCount } from './utils.js';

document.addEventListener('DOMContentLoaded', function() {
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
      fetch('http://localhost:5000/api/users/register', {
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
          
          // Redirigir a la página de login después de 2 segundos
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 2000);
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
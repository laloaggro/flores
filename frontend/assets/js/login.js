// Mostrar notificaciones
function showNotification(message, type) {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Agregar notificación al cuerpo
  document.body.appendChild(notification);
  
  // Eliminar notificación después de 3 segundos
  setTimeout(() => {
    notification.remove();
  }, 3000);
  
  // Mostrar información de depuración
  console.log('Notificación mostrada:', message, 'Tipo:', type);
}

// Actualizar contador del carrito
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCountElements = document.querySelectorAll('.cart-count');
  
  cartCountElements.forEach(element => {
    element.textContent = totalCount;
  });
  
  // Mostrar información de depuración
  console.log('Carrito actualizado. Total de productos:', totalCount);
}

// Exportar funciones si está disponible el objeto module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { showNotification, updateCartCount };
}
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
      
      showNotification('Registro exitoso', 'success');
      
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
  
// Importar utilidades compartidas
import { showNotification, updateCartCount } from './utils.js';

// Inicializar contador del carrito
updateCartCount();

// Resto del código permanece igual
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
    
    // Validaciones de seguridad
    if (!validateEmail(email)) {
      showNotification('Por favor, ingrese un correo electrónico válido', 'error');
      return;
    }
    
    if (password.length < 6) {
      showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }
    
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
    
    // Validaciones de seguridad
    if (!validateEmail(email)) {
      showNotification('Por favor, ingrese un correo electrónico válido', 'error');
      return;
    }
    
    if (password.length < 6) {
      showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      showNotification('Las contraseñas no coinciden', 'error');
      return;
    }
    
    if (name.trim() === '') {
      showNotification('Por favor, ingrese su nombre completo', 'error');
      return;
    }
    
    if (phone.trim() === '') {
      showNotification('Por favor, ingrese su número de teléfono', 'error');
      return;
    }
    
    // Registrar al usuario
    registerUser(name, email, phone, password);
  });
  
  // Función para validar correo electrónico
  function validateEmail(email) {
    // Expresión regular para validar correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Función para iniciar sesión
  function loginUser(email, password) {
    // Mostrar información de depuración
    console.log('Iniciando sesión con:', email);
    
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
      
      // Actualizar contador del carrito
      updateCartCount();
      
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
    console.log('Registrando usuario:', name, email, phone);
    
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
      
      showNotification('Registro exitoso', 'success');
      
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
  
  // Inicializar contador del carrito
  updateCartCount();
});
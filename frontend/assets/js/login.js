import { showNotification, updateCartCount, API_BASE_URL, checkBackendConnectivity } from './utils.js';
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

// Función para manejar el inicio de sesión
async function handleLogin() {
  try {
    // Verificar conectividad con el backend antes de intentar iniciar sesión
    const isBackendAvailable = await checkBackendConnectivity();
    if (!isBackendAvailable) {
      showNotification('No se puede conectar con el servidor. Por favor, verifica que el servidor backend esté funcionando en ' + API_BASE_URL, 'error');
      return;
    }
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Validar campos
    if (!email || !password) {
      showNotification('Por favor, completa todos los campos', 'error');
      return;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('Por favor, ingresa un email válido', 'error');
      return;
    }
    
    // Realizar solicitud de inicio de sesión
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    // Verificar si la respuesta es JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Error de conexión con el servidor. Por favor, verifica que el servidor esté funcionando.');
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }
    
    // Guardar token y datos del usuario en localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    showNotification('Inicio de sesión exitoso', 'success');
    
    // Redirigir a la página principal después de 1 segundo
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    // Manejar errores de red o de parseo de JSON
    if (error instanceof SyntaxError) {
      showNotification('Error al procesar la respuesta del servidor. Por favor, inténtalo nuevamente.', 'error');
    } else {
      showNotification(error.message, 'error');
    }
  }
}

// Función para manejar el registro
async function handleRegister() {
  try {
    // Verificar conectividad con el backend antes de intentar registrar
    const isBackendAvailable = await checkBackendConnectivity();
    if (!isBackendAvailable) {
      showNotification('No se puede conectar con el servidor. Por favor, verifica que el servidor backend esté funcionando en ' + API_BASE_URL, 'error');
      return;
    }
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('registerPassword').value;
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
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ firstName, lastName, email, phone, password })
    });
    
    // Verificar si la respuesta es JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Error de conexión con el servidor. Por favor, verifica que el servidor esté funcionando.');
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al registrar usuario');
    }
    
    showNotification('Usuario registrado exitosamente. Ahora puedes iniciar sesión.', 'success');
    
    // Redirigir a la página de login después de 2 segundos
    setTimeout(() => {
      // Cambiar a la pestaña de inicio de sesión
      const loginContainer = document.querySelector('.login-form-container');
      const registerContainer = document.querySelector('.register-form-container');
      
      if (registerContainer) registerContainer.classList.add('hidden');
      if (loginContainer) loginContainer.classList.remove('hidden');
    }, 2000);
  } catch (error) {
    // Manejar errores de red o de parseo de JSON
    if (error instanceof SyntaxError) {
      showNotification('Error al procesar la respuesta del servidor. Por favor, inténtalo nuevamente.', 'error');
    } else {
      showNotification(error.message, 'error');
    }
  }
}

// Inicializar contador del carrito
updateCartCount();
import { showNotification, updateCartCount, API_BASE_URL, checkBackendConnectivity } from './utils.js';
import { initUserMenu } from './auth.js';
import { initGoogleSignIn } from './googleAuth.js';

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM cargado en login.js');
  console.log('Iniciando inicialización del login');
  
  // Inicializar menú de usuario
  initUserMenu();
  
  // Elementos del DOM
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const showRegisterLink = document.getElementById('showRegister');
  const showLoginLink = document.getElementById('showLogin');
  const loginContainer = document.querySelector('.login-form-container');
  const registerContainer = document.querySelector('.register-form-container');
  
  // Inicializar Google Sign-In si el botón existe
  const googleButton = document.getElementById('googleSignInButton');
  if (googleButton) {
    console.log('Elemento googleSignInButton encontrado:', !!googleButton);
    console.log('Inicializando Google Sign-In');
    
    // Usar el Client ID de Google real
    const googleClientId = '888681528450-havivkoibjv0ht3vu4q46hc8k0i3f8iu.apps.googleusercontent.com';
    initGoogleSignIn(googleClientId, handleGoogleLoginResponse);
  }
  
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
  
  console.log('Inicialización del login completada');
});

// Función para manejar el inicio de sesión
async function handleLogin() {
  console.log('Manejando evento de inicio de sesión');
  
  try {
    console.log('Iniciando proceso de login');
    console.log('API_BASE_URL:', API_BASE_URL);
    
    // Verificar conectividad con el backend antes de intentar iniciar sesión
    console.log('Verificando conectividad con el backend...');
    const isBackendAvailable = await checkBackendConnectivity();
    console.log('Backend disponible:', isBackendAvailable);
    
    if (!isBackendAvailable) {
      const errorMsg = 'No se puede conectar con el servidor. Por favor, verifica que el servidor backend esté funcionando en ' + API_BASE_URL;
      console.error(errorMsg);
      showNotification(errorMsg, 'error');
      return;
    }
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    console.log('Datos de login:', { email, password: '****' });
    
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
    console.log('Realizando solicitud de inicio de sesión...');
    console.log('URL de la solicitud:', `${API_BASE_URL}/api/users/login`);
    
    let response;
    try {
      response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
    } catch (fetchError) {
      console.error('Error al realizar la solicitud:', fetchError);
      throw new Error(`No se pudo conectar con el servidor. Error: ${fetchError.message}`);
    }
    
    console.log('Respuesta del servidor:', response);
    console.log('Estado de la respuesta:', response.status);
    
    // Verificar si la respuesta es JSON
    const contentType = response.headers.get('content-type');
    console.log('Tipo de contenido:', contentType);
    
    if (!contentType || !contentType.includes('application/json')) {
      // Si la respuesta no es JSON, mostrar el contenido para diagnóstico
      const responseText = await response.text();
      console.error('Respuesta no JSON recibida:', responseText);
      
      // Si es un error 404, probablemente la ruta no existe
      if (response.status === 404) {
        throw new Error('Endpoint no encontrado. Verifica que la ruta /api/auth/login exista en el backend.');
      }
      
      // Si es un error de CORS, mostrar un mensaje específico
      if (response.status === 0) {
        throw new Error('Error de conexión. Puede ser un problema de CORS o el servidor no está respondiendo.');
      }
      
      const errorMsg = 'Error de conexión con el servidor. Por favor, verifica que el servidor esté funcionando correctamente.';
      throw new Error(errorMsg);
    }
    
    const data = await response.json();
    console.log('Datos recibidos:', data);
    
    let response;
    try {
      response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
    } catch (fetchError) {
      console.error('Error al realizar la solicitud:', fetchError);
      throw new Error(`No se pudo conectar con el servidor. Error: ${fetchError.message}`);
    }
    
    console.log('Respuesta del servidor:', response);
    console.log('Estado de la respuesta:', response.status);
    
    // Verificar si la respuesta es JSON
    const contentType = response.headers.get('content-type');
    console.log('Tipo de contenido:', contentType);
    
    if (!contentType || !contentType.includes('application/json')) {
      // Si la respuesta no es JSON, mostrar el contenido para diagnóstico
      const responseText = await response.text();
      console.error('Respuesta no JSON recibida:', responseText);
      
      // Si es un error 404, probablemente la ruta no existe
      if (response.status === 404) {
        throw new Error('Endpoint no encontrado. Verifica que la ruta /api/auth/login exista en el backend.');
      }
      
      // Si es un error de CORS, mostrar un mensaje específico
      if (response.status === 0) {
        throw new Error('Error de conexión. Puede ser un problema de CORS o el servidor no está respondiendo.');
      }
      
      const errorMsg = 'Error de conexión con el servidor. Por favor, verifica que el servidor esté funcionando correctamente.';
      throw new Error(errorMsg);
    }
    
    const data = await response.json();
    console.log('Datos recibidos:', data);
    
    if (!response.ok) {
      const errorMsg = data.message || 'Error al iniciar sesión';
      console.error(errorMsg);
      throw new Error(errorMsg);
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
    console.error('Error en handleLogin:', error);
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

// Función para manejar la respuesta de inicio de sesión con Google
function handleGoogleLoginResponse(error, result) {
  console.log('Manejando respuesta de inicio de sesión con Google', { error, result });
  
  if (error) {
    console.error('Error en inicio de sesión con Google:', error);
    showNotification('Error al iniciar sesión con Google: ' + error.message, 'error');
    return;
  }
  
  if (result.success) {
    showNotification('Inicio de sesión exitoso. Bienvenido ' + result.user.name, 'success');
    
    // Redirigir al usuario después de un breve retraso
    setTimeout(() => {
      // Si el usuario es administrador, redirigir al panel de administración
      if (result.user.role === 'admin') {
        window.location.href = 'pages/admin.html';
      } else {
        // Para usuarios normales, redirigir a la página principal
        window.location.href = 'index.html';
      }
    }, 1500);
  } else {
    showNotification(result.message || 'Error al iniciar sesión con Google', 'error');
  }
}

// Inicializar contador del carrito
updateCartCount();
// utils.js - Funciones de utilidad compartidas

// Determinar la URL base del API según el entorno
const getApiBaseUrl = () => {
  // En producción, usar la URL del backend en Render
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // URL real del backend en Render
    return 'https://arreglos-victoria-backend.onrender.com';
  }
  
  // Detectar si se está usando Live Server (puerto 5500)
  if (typeof window !== 'undefined' && window.location.port === '5500') {
    // Cuando se usa Live Server, el backend está en localhost:5000
    return 'http://localhost:5000';
  }
  
  // En desarrollo normal, usar localhost con puerto 5000
  return 'http://localhost:5000';
};

const API_BASE_URL = getApiBaseUrl();

// Función para verificar la conectividad con el backend
const checkBackendConnectivity = async () => {
  try {
    // Probar primero con un endpoint que probablemente exista
    const endpointsToTry = [
      '/api/users/login',  // Endpoint de login
      '/api/products',  // Endpoint que debería existir
      '/api/users/profile',  // Endpoint para verificar sesión
      '/',  // Página principal como último recurso
    ];
    
    for (const endpoint of endpointsToTry) {
      try {
        console.log(`Intentando conectar a: ${API_BASE_URL}${endpoint}`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, { 
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json'
          }
        }).catch(error => {
          // Capturar errores de red o abort
          clearTimeout(timeoutId);
          throw error;
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log(`Conectividad exitosa con el backend en: ${API_BASE_URL}${endpoint}`);
          return true;
        }
      } catch (innerError) {
        console.log(`Fallo al conectar con ${API_BASE_URL}${endpoint}:`, innerError.message);
        continue; // Intentar con el siguiente endpoint
      }
    }
    
    console.error('No se pudo establecer conexión con ningún endpoint del backend');
    return false;
  } catch (error) {
    console.error('Error general al verificar conectividad con el backend:', error);
    return false;
  }
};

// Función para obtener el token JWT del almacenamiento local
const getAuthToken = () => {
  try {
    // Primero intentar obtener el token con el nombre 'token' (como lo guarda login.js)
    let token = localStorage.getItem('token');
    
    // Si no existe, intentar con 'authToken' (nombre anterior)
    if (!token) {
      token = localStorage.getItem('authToken');
    }
    
    return token;
  } catch (error) {
    console.error('Error al obtener el token de autenticación:', error);
    return null;
  }
};

// Función para guardar el token JWT en el almacenamiento local
const setAuthToken = (token) => {
  try {
    // Guardar con ambos nombres para compatibilidad
    localStorage.setItem('token', token);
    localStorage.setItem('authToken', token);
    console.log('Token de autenticación guardado');
  } catch (error) {
    console.error('Error al guardar el token de autenticación:', error);
  }
};

// Función para eliminar el token JWT del almacenamiento local
const removeAuthToken = () => {
  try {
    // Eliminar ambos posibles nombres de token
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    console.log('Token de autenticación eliminado');
  } catch (error) {
    console.error('Error al eliminar el token de autenticación:', error);
  }
};

// Función para cerrar sesión
const logout = () => {
  try {
    // Eliminar token de autenticación
    removeAuthToken();
    
    // Eliminar cualquier otro dato de usuario almacenado
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('savedForLater');
    
    console.log('Sesión cerrada correctamente');
    showNotification('Sesión cerrada correctamente', 'success');
    
    // Redirigir a la página principal después de un breve retraso
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    showNotification('Error al cerrar sesión', 'error');
  }
};

// Función para verificar si el usuario está autenticado
const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) {
    console.log('No se encontró token de autenticación');
    return false;
  }
  
  // Verificar si el token ha expirado
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp < currentTime) {
      console.log('Token de autenticación expirado');
      removeAuthToken(); // Eliminar token expirado
      return false;
    }
    
    console.log('Usuario autenticado correctamente');
    return true;
  } catch (error) {
    console.error('Error al verificar el token de autenticación:', error);
    removeAuthToken(); // Eliminar token inválido
    return false;
  }
};

// Función para verificar si el usuario es administrador
const isAdmin = () => {
  const token = getAuthToken();
  if (!token) {
    return false;
  }
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'admin';
  } catch (error) {
    console.error('Error al verificar rol de administrador:', error);
    return false;
  }
};

// Función para obtener la información del usuario del token
const getUserInfoFromToken = () => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Información del usuario obtenida del token:', payload);
    return {
      id: payload.userId,
      name: payload.name,
      email: payload.email,
      role: payload.role
    };
  } catch (error) {
    console.error('Error al obtener información del usuario del token:', error);
    return null;
  }
};

// Función para mostrar notificaciones al usuario
const showNotification = (message, type = 'info') => {
  // Crear contenedor de notificaciones si no existe
  let notificationContainer = document.getElementById('notification-container');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    notificationContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      width: 300px;
    `;
    document.body.appendChild(notificationContainer);
  }
  
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.style.cssText = `
    margin-bottom: 10px;
    padding: 15px;
    border-radius: 4px;
    color: white;
    font-weight: 500;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    ${
      type === 'success' ? 'background-color: #48bb78;' :
      type === 'error' ? 'background-color: #e53e3e;' :
      type === 'warning' ? 'background-color: #dd6b20;' :
      'background-color: #3182ce;'
    }
  `;
  
  notification.textContent = message;
  
  // Añadir notificación al contenedor
  notificationContainer.appendChild(notification);
  
  // Animar entrada
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Eliminar notificación después de 5 segundos
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
};

// Función para formatear precios en formato chileno
const formatPrice = (price) => {
  // Convertir a número si es string
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Verificar si es un número válido
  if (isNaN(numericPrice)) {
    return '$0';
  }
  
  // Formatear como moneda chilena sin decimales
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericPrice);
};

// Función para validar formato de email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Función para validar que una contraseña sea segura
const isStrongPassword = (password) => {
  // Al menos 8 caracteres, una mayúscula, una minúscula y un número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Función para actualizar el contador del carrito
const updateCartCount = () => {
  // Importar dinámicamente cartUtils para acceder a la función updateCartCount
  import('./cartUtils.js').then((module) => {
    const cartUtils = module.default || module;
    if (cartUtils && typeof cartUtils.updateCartCount === 'function') {
      cartUtils.updateCartCount();
    }
  }).catch((error) => {
    console.error('Error al importar cartUtils:', error);
  });
};

// Función para generar un token CSRF simple (en producción, esto debería venir del servidor)
function generateCSRFToken() {
    // En una implementación real, este token debería ser generado por el servidor
    // y almacenado de forma segura
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Función para añadir token CSRF a formularios
function addCSRFTokenToForms() {
    const forms = document.querySelectorAll('form');
    const csrfToken = generateCSRFToken();
    
    forms.forEach(form => {
        // Verificar si el formulario ya tiene un token CSRF
        const existingToken = form.querySelector('input[name="_csrf"]');
        if (!existingToken) {
            const tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = '_csrf';
            tokenInput.value = csrfToken;
            form.appendChild(tokenInput);
        }
    });
}

// Función para validar entradas de usuario
function validateInput(input) {
    // Eliminar caracteres peligrosos
    const sanitized = input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return sanitized;
}

// Función para validar formularios
function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    inputs.forEach(input => {
        // Validar campos requeridos
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
        
        // Validar emails
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        }
        
        // Sanitizar entradas
        if (input.type !== 'password') {
            input.value = validateInput(input.value);
        }
    });
    
    return isValid;
}

// Función para manejar el envío de formularios con validación
function handleFormSubmission(form, submitHandler) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar formulario
        if (!validateForm(this)) {
            console.warn('Formulario inválido');
            return;
        }
        
        // Ejecutar manejador de envío
        submitHandler(new FormData(this));
    });
}

// Exportar funciones
export {
  API_BASE_URL,
  checkBackendConnectivity,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  logout,
  isAuthenticated,
  isAdmin,
  getUserInfoFromToken,
  showNotification,
  formatPrice,
  isValidEmail,
  isStrongPassword,
  updateCartCount
};
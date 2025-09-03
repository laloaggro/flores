/**
 * utils.js - Funciones de utilidad compartidas
 * Contiene funciones auxiliares utilizadas en múltiples partes de la aplicación
 */

/**
 * Determinar la URL base del API según el entorno
 * Devuelve la URL correcta dependiendo de si se está en desarrollo o producción
 * @returns {string} URL base del API
 */
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

/**
 * Función para verificar la conectividad con el backend
 * Realiza una serie de intentos para conectar con diferentes endpoints del backend
 * @returns {Promise<boolean>} True si se puede conectar, false en caso contrario
 */
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
      const response = await fetch(API_BASE_URL + endpoint, { method: 'HEAD' });
      if (response.ok) {
        console.log(`Conectividad verificada con: ${API_BASE_URL}${endpoint}`);
        return true;
      }
    }
    
    throw new Error('No se pudo establecer conexión con ninguno de los endpoints');
  } catch (error) {
    console.error('Error al verificar conectividad con el backend:', error);
    return false;
  }
};

/**
 * Función para mostrar notificaciones al usuario
 * Crea y muestra notificaciones temporales en la esquina superior derecha
 * @param {string} message - Mensaje a mostrar en la notificación
 * @param {string} type - Tipo de notificación (info, success, warning, error)
 */
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
      z-index: 9999999999;
      width: 300px;
    `;
    document.body.appendChild(notificationContainer);
  }

  // Crear notificación
  const notification = document.createElement('div');
  notification.style.cssText = `
    background-color: ${type === 'error' ? '#f8d7da' : type === 'success' ? '#d4edda' : '#d1ecf1'};
    border: 1px solid ${type === 'error' ? '#f5c6cb' : type === 'success' ? '#c3e6cb' : '#bee5eb'};
    color: ${type === 'error' ? '#721c24' : type === 'success' ? '#155724' : '#0c5460'};
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15);
    position: relative;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
  `;

  notification.innerHTML = `
    ${message}
    <button style="
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: inherit;
    ">&times;</button>
  `;

  // Añadir botón de cierre
  const closeBtn = notification.querySelector('button');
  closeBtn.addEventListener('click', () => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  });

  notificationContainer.appendChild(notification);

  // Animar entrada
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 10);

  // Auto cerrar después de 5 segundos
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

/**
 * Formatear precio en formato de moneda chilena
 * @param {number} price - Precio a formatear
 * @returns {string} Precio formateado
 */
const formatPrice = (price) => {
  if (typeof price !== 'number') {
    price = parseFloat(price);
  }
  
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(price);
};

/**
 * Verificar si el usuario está autenticado
 * @returns {boolean} True si el usuario está autenticado, false en caso contrario
 */
const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch (e) {
    return false;
  }
};

/**
 * Cerrar sesión del usuario
 */
const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = '/login.html';
};

/**
 * Obtener el token de autenticación
 * @returns {string|null} Token de autenticación o null si no existe
 */
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Guardar datos del usuario
 * @param {Object} user - Datos del usuario
 */
const saveUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Obtener datos del usuario
 * @returns {Object|null} Datos del usuario o null si no existen
 */
const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Validar formato de correo electrónico
 * @param {string} email - Correo electrónico a validar
 * @returns {boolean} True si el correo es válido, false en caso contrario
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar contraseña
 * @param {string} password - Contraseña a validar
 * @returns {boolean} True si la contraseña es válida, false en caso contrario
 */
const validatePassword = (password) => {
  // Al menos 8 caracteres, una mayúscula, una minúscula y un número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validar nombre
 * @param {string} name - Nombre a validar
 * @returns {boolean} True si el nombre es válido, false en caso contrario
 */
const validateName = (name) => {
  // Al menos 2 caracteres y solo letras y espacios
  return name.length >= 2 && /^[a-zA-ZÀ-ÿ\s]+$/.test(name);
};

// Exportar todas las funciones
export {
  API_BASE_URL,
  checkBackendConnectivity,
  showNotification,
  formatPrice,
  isAuthenticated,
  logout,
  getAuthToken,
  saveUser,
  getUser,
  validateEmail,
  validatePassword,
  validateName
};
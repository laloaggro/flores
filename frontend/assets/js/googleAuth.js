import { API_BASE_URL, showNotification } from './utils.js';

// Cargar la biblioteca de Google Identity Services
export function loadGoogleAuth(clientId) {
  return new Promise((resolve, reject) => {
    console.log('Cargando biblioteca de Google Identity Services');
    
    // Verificar si ya está cargada
    if (typeof window.google !== 'undefined' && window.google.accounts) {
      console.log('Biblioteca de Google ya cargada');
      resolve(window.google);
      return;
    }

    // Crear el script de Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Biblioteca de Google cargada exitosamente');
      resolve(window.google);
    };
    script.onerror = () => {
      console.error('Error al cargar la biblioteca de Google');
      reject(new Error('Error al cargar la biblioteca de Google'));
    };
    document.head.appendChild(script);
  });
}

// Inicializar el botón de Google Sign-In
export function initGoogleSignIn(clientId, callback) {
  console.log('Inicializando Google Sign-In con clientId:', clientId);
  
  loadGoogleAuth(clientId)
    .then(google => {
      console.log('Inicializando Google Sign-In');
      
      google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            console.log('Respuesta de Google recibida:', response);
            
            // Decodificar el token JWT
            const payload = parseJwt(response.credential);
            console.log('Usuario de Google:', payload);
            
            // Enviar datos al backend para iniciar sesión/registro
            const result = await loginWithGoogle({
              googleId: payload.sub,
              email: payload.email,
              name: payload.name,
              imageUrl: payload.picture
            });
            
            console.log('Resultado del inicio de sesión con Google:', result);
            
            if (result.success) {
              callback(null, result);
            } else {
              callback(new Error(result.message || 'Error al iniciar sesión con Google'));
            }
          } catch (error) {
            console.error('Error al procesar la respuesta de Google:', error);
            callback(error);
          }
        }
      });

      // Renderizar el botón de Google Sign-In
      const googleButton = document.getElementById('googleSignInButton');
      if (googleButton) {
        console.log('Renderizando botón de Google Sign-In');
        
        google.accounts.id.renderButton(
          googleButton,
          { 
            theme: 'outline', 
            size: 'large',
            width: googleButton.offsetWidth || 200,
            text: 'signin_with'
          }
        );
        
        // Mostrar el botón
        googleButton.style.display = 'block';
        console.log('Botón de Google Sign-In mostrado');
      } else {
        console.warn('No se encontró el elemento con ID googleSignInButton');
      }
    })
    .catch(error => {
      console.error('Error al cargar Google Auth:', error);
      showNotification('Error al cargar la autenticación de Google', 'error');
    });
}

// Función para parsear el token JWT de Google
function parseJwt(token) {
  try {
    console.log('Parseando token JWT de Google');
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error al parsear el token JWT:', error);
    return null;
  }
}

// Función para iniciar sesión con Google en el backend
export async function loginWithGoogle(userData) {
  console.log('Iniciando sesión con Google en el backend', userData);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/google-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    console.log('Respuesta del backend:', data);

    if (response.ok) {
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Inicio de sesión con Google exitoso');
      return { success: true, user: data.user, token: data.token };
    } else {
      console.error('Error en la autenticación con Google:', data.error);
      return { success: false, message: data.error || 'Error en la autenticación' };
    }
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error);
    return { success: false, message: 'Error de conexión con el servidor' };
  }
}
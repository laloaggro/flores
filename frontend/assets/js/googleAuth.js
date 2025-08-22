import { API_BASE_URL, showNotification } from './utils.js';

// Cargar la biblioteca de Google Identity Services
export function loadGoogleAuth(clientId) {
  return new Promise((resolve, reject) => {
    // Verificar si ya está cargada
    if (typeof window.google !== 'undefined' && window.google.accounts) {
      resolve(window.google);
      return;
    }

    // Crear el script de Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      resolve(window.google);
    };
    script.onerror = () => {
      reject(new Error('Error al cargar la biblioteca de Google'));
    };
    document.head.appendChild(script);
  });
}

// Inicializar el botón de Google Sign-In
export function initGoogleSignIn(clientId, callback) {
  loadGoogleAuth(clientId)
    .then(google => {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
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
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/google-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (response.ok) {
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, user: data.user, token: data.token };
    } else {
      return { success: false, message: data.error || 'Error en la autenticación' };
    }
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error);
    return { success: false, message: 'Error de conexión con el servidor' };
  }
}
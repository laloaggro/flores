import { API_BASE_URL, showNotification } from './utils.js';

let googleClientInitialized = false;

// Inicializar Google Sign-In
export async function initializeGoogleSignIn() {
    console.log('Inicializando Google Sign-In con clientId: 888681528450-havivkoibjv0ht3vu4q46hc8k0i3f8iu.apps.googleusercontent.com');
    
    // Cargar la biblioteca de Google Identity Services
    if (!document.getElementById('google-jssdk')) {
        console.log('Cargando biblioteca de Google Identity Services');
        const script = document.createElement('script');
        script.id = 'google-jssdk';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
            console.log('Biblioteca de Google cargada exitosamente');
            // Añadir un pequeño retraso para asegurar que la biblioteca esté completamente lista
            setTimeout(() => {
                initializeGoogleClient();
            }, 100);
        };
        script.onerror = () => {
            console.error('Error al cargar la biblioteca de Google');
            showNotification('Error al cargar la autenticación con Google', 'error');
        };
        document.head.appendChild(script);
    } else {
        console.log('Biblioteca de Google ya está cargada');
        // Añadir un pequeño retraso para asegurar que la biblioteca esté completamente lista
        setTimeout(() => {
            initializeGoogleClient();
        }, 100);
    }
}

// Inicializar el cliente de Google
function initializeGoogleClient() {
    console.log('Inicializando Google Sign-In');
    
    if (typeof google !== 'undefined' && google.accounts) {
        try {
            // Inicializar Google Sign-In con configuración para FedCM
            google.accounts.id.initialize({
                client_id: "888681528450-havivkoibjv0ht3vu4q46hc8k0i3f8iu.apps.googleusercontent.com",
                callback: handleGoogleResponse,
                cancel_on_tap_outside: false,
                // Configuración para FedCM (Federated Credential Management)
                use_fedcm_for_prompt: true
            });
            
            // Renderizar el botón de Google Sign-In
            console.log('Renderizando botón de Google Sign-In');
            google.accounts.id.renderButton(
                document.getElementById("googleSignInButton"),
                { 
                    theme: "outline", 
                    size: "large",
                    width: 200,
                    text: "signin_with",
                    logo_alignment: "center"
                }
            );
            
            // Configurar el prompt de Google One Tap con manejo adecuado de FedCM
            google.accounts.id.prompt((notification) => {
                console.log('Google Sign-In prompt notification:', notification);
                
                // Manejar todas las notificaciones de FedCM para evitar advertencias
                if (notification.isNotDisplayed()) {
                    console.log('Google One Tap no se muestra');
                } else if (notification.isSkippedMoment()) {
                    console.log('Usuario omitió el prompt de Google One Tap');
                } else if (notification.isDismissedMoment()) {
                    console.log('Usuario cerró el prompt de Google One Tap');
                } else if (notification.isDisplayed()) {
                    console.log('Google One Tap se muestra correctamente');
                }
            });
            
            console.log('Botón de Google Sign-In mostrado');
            googleClientInitialized = true;
        } catch (error) {
            console.error('Error al inicializar Google Sign-In:', error);
            showNotification('Error al inicializar la autenticación con Google', 'error');
        }
    } else {
        console.warn('Google Identity Services no disponible aún, reintentando en 1 segundo...');
        setTimeout(initializeGoogleClient, 1000);
    }
}

// Manejar la respuesta de Google
function handleGoogleResponse(response) {
    console.log('Respuesta de Google recibida:', response);
    
    if (response.credential) {
        const user = parseJwt(response.credential);
        console.log('Usuario de Google:', user);
        
        // Verificar si estamos en la página de registro o login
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('register')) {
            // En registro, mostrar formulario con datos de Google
            document.getElementById('name').value = user.name || '';
            document.getElementById('email').value = user.email || '';
            
            // Guardar datos de Google en localStorage temporalmente
            localStorage.setItem('googleUser', JSON.stringify(user));
            
            showNotification('Datos de Google cargados. Completa el registro.', 'info');
        } else {
            // En login, iniciar sesión automáticamente
            handleGoogleLogin(user);
        }
    } else {
        console.error('No se recibió credencial válida de Google');
        showNotification('Error al iniciar sesión con Google', 'error');
    }
}

// Manejar login con Google
async function handleGoogleLogin(user) {
    try {
        console.log('Iniciando sesión con Google:', user);
        
        // Enviar datos al backend para verificar/crear usuario
        const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                googleId: user.sub,
                email: user.email,
                name: user.name,
                picture: user.picture
            })
        });
        
        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        
        if (response.ok && data.token) {
            // Guardar token y datos del usuario
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                picture: data.user.picture
            }));
            
            // Mostrar notificación de éxito
            showNotification(`¡Bienvenido ${data.user.name}!`, 'success');
            
            // Redirigir al usuario a la página principal después de un breve retraso
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            // Mostrar mensaje de error
            showNotification(data.message || 'Error al iniciar sesión con Google', 'error');
        }
    } catch (error) {
        console.error('Error en login con Google:', error);
        showNotification('Error de conexión. Por favor intenta nuevamente.', 'error');
    }
}

// Parsear JWT
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error al parsear JWT:', error);
        return null;
    }
}

// Exportar funciones necesarias
export { initializeGoogleClient, handleGoogleResponse };
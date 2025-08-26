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
            google.accounts.id.initialize({
                client_id: "888681528450-havivkoibjv0ht3vu4q46hc8k0i3f8iu.apps.googleusercontent.com",
                callback: handleGoogleResponse,
                cancel_on_tap_outside: false, // Prevenir cancelación accidental
                // Configuración para FedCM (Federated Credential Management)
                use_fedcm_for_prompt: true
            });
            
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
            
            // Solicitar también el perfil del usuario para registro
            google.accounts.id.prompt((notification) => {
                console.log('Google Sign-In prompt notification:', notification);
                
                // Manejar las notificaciones de FedCM
                if (notification.isDisplayMoment()) {
                    console.log('Se muestra el prompt de Google One Tap');
                } else if (notification.isSkippedMoment()) {
                    console.log('Usuario omitió el prompt de Google One Tap');
                } else if (notification.isDismissedMoment()) {
                    console.log('Usuario cerró el prompt de Google One Tap');
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
            // Registro con Google
            registerWithGoogle(response.credential, user);
        } else {
            // Inicio de sesión con Google
            loginWithGoogle(response.credential, user);
        }
    } else {
        console.error('No se recibió credencial de Google');
        showNotification('Error en la autenticación con Google', 'error');
    }
}

// Registrar con Google
async function registerWithGoogle(credential, userData) {
    console.log('Registrando con Google en el backend', credential, userData);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/google-register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                token: credential,
                name: userData.name,
                email: userData.email,
                googleId: userData.sub
            }),
        });
        
        const data = await response.json();
        console.log('Respuesta del backend para registro:', data);
        
        if (response.ok) {
            // Guardar token
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            showNotification('¡Registro con Google exitoso!', 'success');
            
            // Redirigir al usuario al perfil
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1500);
        } else {
            // Si el usuario ya existe, iniciar sesión
            if (data.message && data.message.includes('ya existe')) {
                loginWithGoogle(credential, userData);
            } else {
                console.error('Error en el registro con Google:', data.message);
                showNotification(`Error al registrarse con Google: ${data.message}`, 'error');
            }
        }
    } catch (error) {
        console.error('Error en el registro con Google:', error);
        showNotification(`Error al registrarse con Google: ${error.message}`, 'error');
    }
}

// Iniciar sesión con Google en el backend
async function loginWithGoogle(credential, userData) {
    console.log('Iniciando sesión con Google en el backend', credential);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/google-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                token: credential,
                email: userData.email,
                name: userData.name,
                googleId: userData.sub
            }),
        });
        
        const data = await response.json();
        console.log('Respuesta del backend:', data);
        
        if (response.ok) {
            // Guardar token
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            showNotification('¡Inicio de sesión con Google exitoso!', 'success');
            
            // Redirigir al usuario
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            console.error('Error en la autenticación con Google:', data.message);
            showNotification(`Error al iniciar sesión con Google: ${data.message}`, 'error');
        }
    } catch (error) {
        console.error('Error en la autenticación con Google:', error);
        showNotification(`Error al iniciar sesión con Google: ${error.message}`, 'error');
    }
}

// Parsear JWT
function parseJwt(token) {
    console.log('Parseando token JWT de Google');
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

// Manejar respuesta de inicio de sesión con Google
export function handleGoogleLoginResponse(response) {
    console.log('Manejando respuesta de inicio de sesión con Google', response);
    
    if (response.error) {
        console.error('Error en inicio de sesión con Google:', response.error);
        showNotification(`Error en inicio de sesión con Google: ${response.error}`, 'error');
        return { success: false, error: response.error };
    }
    
    if (response.token) {
        // Guardar token y usuario
        localStorage.setItem('token', response.token);
        if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
        }
        
        showNotification('¡Inicio de sesión con Google exitoso!', 'success');
        return { success: true, token: response.token, user: response.user };
    }
    
    console.error('Respuesta inválida de Google Sign-In');
    showNotification('Error en la autenticación con Google', 'error');
    return { success: false, error: 'Respuesta inválida' };
}
import { API_BASE_URL, showNotification } from './utils.js';

let googleClientInitialized = false;
let googleScriptLoadAttempts = 0;
const MAX_SCRIPT_LOAD_ATTEMPTS = 3;

// Inicializar Google Sign-In
async function initializeGoogleSignIn() {
    console.log('Inicializando Google Sign-In con clientId: 888681528450-havivkoibjv0ht3vu4q46hc8k0i3f8iu.apps.googleusercontent.com');
    
    // Verificar si ya existe un script de Google cargado o en proceso de carga
    const existingScript = document.getElementById('google-jssdk');
    const loadingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    
    if (!existingScript && !loadingScript) {
        console.log('Cargando biblioteca de Google Identity Services');
        const script = document.createElement('script');
        script.id = 'google-jssdk';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        
        // Contador de intentos de carga
        googleScriptLoadAttempts = 0;
        
        script.onload = () => {
            console.log('Biblioteca de Google cargada exitosamente');
            // Reiniciar el contador de intentos en caso de éxito
            googleScriptLoadAttempts = 0;
            // Añadir un pequeño retraso para asegurar que la biblioteca esté completamente lista
            setTimeout(() => {
                initializeGoogleClient();
            }, 100);
        };
        
        script.onerror = () => {
            console.error('Error al cargar la biblioteca de Google');
            googleScriptLoadAttempts++;
            
            if (googleScriptLoadAttempts < MAX_SCRIPT_LOAD_ATTEMPTS) {
                console.log(`Reintentando cargar la biblioteca de Google (intento ${googleScriptLoadAttempts + 1}/${MAX_SCRIPT_LOAD_ATTEMPTS})`);
                setTimeout(() => {
                    document.head.removeChild(script); // Eliminar el script fallido
                    initializeGoogleSignIn(); // Reintentar la inicialización
                }, 2000); // Esperar 2 segundos antes de reintentar
            } else {
                showNotification('Error al cargar la autenticación con Google. Verifica tu conexión a internet o intenta más tarde.', 'error');
                // Deshabilitar el botón de inicio de sesión con Google si existe
                const googleButton = document.getElementById('googleSignInButton');
                if (googleButton) {
                    googleButton.style.display = 'none';
                }
            }
        };
        
        script.onloadstart = () => {
            console.log('Inicio de carga de la biblioteca de Google');
            showNotification('Cargando biblioteca de autenticación de Google...', 'info');
        };
        
        script.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                console.log(`Cargando biblioteca de Google: ${percentComplete}%`);
                // Actualizar notificación con el progreso
                if (percentComplete > 0 && percentComplete < 100) {
                    showNotification(`Cargando biblioteca de Google: ${percentComplete}% completado`, 'info');
                }
            }
        };
        
        document.head.appendChild(script);
    } else {
        console.log('Biblioteca de Google ya está cargada o en proceso de carga');
        // Añadir un pequeño retraso para asegurar que la biblioteca esté completamente lista
        setTimeout(() => {
            if (typeof google !== 'undefined' && google.accounts) {
                initializeGoogleClient();
            } else {
                // Si la biblioteca no se ha cargado completamente después del retraso
                console.warn('Biblioteca de Google parece estar cargada pero no completamente funcional');
                // Verificar si hay que reinicializar el cliente
                if (!googleClientInitialized) {
                    initializeGoogleClient();
                }
            }
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
                use_fedcm_for_prompt: true,
                // Configuración adicional para evitar advertencias de FedCM
                auto_select: false,
                prompt_parent_id: 'googleSignInButton'
            });
            
            // Renderizar el botón de Google Sign-In
            console.log('Renderizando botón de Google Sign-In');
            const buttonContainer = document.getElementById("googleSignInButton");
            
            if (buttonContainer) {
                // Limpiar contenedor primero si ya tiene contenido
                buttonContainer.innerHTML = '';
                
                google.accounts.id.renderButton(
                    buttonContainer,
                    { 
                        theme: "outline", 
                        size: "large",
                        width: 200,
                        text: "signin_with",
                        logo_alignment: "center"
                    }
                );
                
                console.log('Botón de Google Sign-In renderizado exitosamente');
                // Añadir un listener para manejar errores de renderizado del botón
                buttonContainer.addEventListener('error', (event) => {
                    console.error('Error al renderizar el botón de Google Sign-In:', event);
                    showNotification('Error al mostrar el botón de inicio de sesión con Google', 'error');
                });
            } else {
                console.error('No se encontró el contenedor para el botón de Google Sign-In');
                showNotification('Error al mostrar el botón de inicio de sesión con Google. Elemento no encontrado.', 'error');
            }
            
            console.log('Botón de Google Sign-In mostrado');
            googleClientInitialized = true;
        } catch (error) {
            console.error('Error al inicializar Google Sign-In:', error);
            showNotification('Error al inicializar la autenticación con Google. Por favor recarga la página e inténtalo nuevamente.', 'error');
            
            // Deshabilitar el botón de Google en caso de error crítico
            const googleButton = document.getElementById('googleSignInButton');
            if (googleButton) {
                googleButton.style.display = 'none';
            }
        }
    } else {
        console.warn('Google Identity Services no disponible aún, reintentando en 1 segundo...');
        // Limitar los reintentos para evitar bucles infinitos
        let retryCount = 0;
        const maxRetries = 5;
        
        const retryInterval = setInterval(() => {
            if (typeof google !== 'undefined' && google.accounts) {
                clearInterval(retryInterval);
                initializeGoogleClient();
            } else if (retryCount >= maxRetries) {
                clearInterval(retryInterval);
                console.error('No se pudo cargar Google Identity Services después de varios intentos');
                showNotification('Error al cargar el servicio de autenticación con Google. Por favor recarga la página.', 'error');
                
                // Deshabilitar el botón de Google después de fallar los reintentos
                const googleButton = document.getElementById('googleSignInButton');
                if (googleButton) {
                    googleButton.style.display = 'none';
                }
            } else {
                retryCount++;
                console.log(`Reintentando inicialización de Google Sign-In (intento ${retryCount}/${maxRetries})`);
            }
        }, 1000);
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
        const response = await fetch(`${API_BASE_URL}/api/users/google-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                googleId: user.sub,
                email: user.email,
                name: user.name,
                imageUrl: user.picture
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
                picture: data.user.imageUrl
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
export { initializeGoogleSignIn, initializeGoogleClient, handleGoogleResponse };
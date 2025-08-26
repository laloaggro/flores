import { API_BASE_URL, showNotification } from './utils.js';
import { initializeGoogleSignIn } from './googleAuth.js';

document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM cargado en login.js');
    console.log('Iniciando inicialización del login');
    
    const loginForm = document.getElementById('loginForm');
    const googleSignInButton = document.getElementById('googleSignInButton');
    
    console.log('Elemento googleSignInButton encontrado:', !!googleSignInButton);
    
    if (googleSignInButton) {
        console.log('Inicializando Google Sign-In');
        try {
            await initializeGoogleSignIn();
            console.log('Google Sign-In inicializado correctamente');
        } catch (error) {
            console.error('Error al inicializar Google Sign-In:', error);
            showNotification('Error al cargar la autenticación con Google', 'error');
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Formulario de login enviado');
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const loginButton = document.getElementById('loginButton');
            
            // Validar campos
            if (!email || !password) {
                showNotification('Por favor completa todos los campos', 'error');
                return;
            }
            
            // Deshabilitar botón durante el proceso
            const originalText = loginButton.innerHTML;
            loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
            loginButton.disabled = true;
            
            try {
                const response = await fetch(`${API_BASE_URL}/api/users/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });
                
                const data = await response.json();
                console.log('Respuesta del servidor:', data);
                
                if (response.ok) {
                    // Guardar token
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    showNotification('¡Inicio de sesión exitoso!', 'success');
                    
                    // Redirigir al usuario
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    showNotification(data.message || 'Error al iniciar sesión', 'error');
                }
            } catch (error) {
                console.error('Error al iniciar sesión:', error);
                showNotification('Error de conexión. Por favor intenta nuevamente.', 'error');
            } finally {
                // Restaurar botón
                loginButton.innerHTML = originalText;
                loginButton.disabled = false;
            }
        });
    }
    
    // Mostrar/ocultar contraseña
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }
    
    console.log('Inicialización del login completada');
});
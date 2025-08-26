import { API_BASE_URL, showNotification } from './utils.js';
import { initializeGoogleSignIn, handleGoogleLoginResponse } from './googleAuth.js';

document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM cargado en register.js');
    console.log('Iniciando inicialización del registro');
    
    const registerForm = document.getElementById('registerForm');
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
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Formulario de registro enviado');
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const registerButton = document.getElementById('registerButton');
            
            // Validar campos
            if (!name || !email || !password || !confirmPassword) {
                showNotification('Por favor completa todos los campos obligatorios', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Las contraseñas no coinciden', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
                return;
            }
            
            // Deshabilitar botón durante el proceso
            const originalText = registerButton.innerHTML;
            registerButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
            registerButton.disabled = true;
            
            try {
                const response = await fetch(`${API_BASE_URL}/api/users/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, phone, password }),
                });
                
                const data = await response.json();
                console.log('Respuesta del servidor:', data);
                
                if (response.ok) {
                    showNotification('¡Registro exitoso! Ahora puedes iniciar sesión.', 'success');
                    
                    // Redirigir al login después de 2 segundos
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    showNotification(data.message || 'Error al registrarse', 'error');
                }
            } catch (error) {
                console.error('Error al registrarse:', error);
                showNotification('Error de conexión. Por favor intenta nuevamente.', 'error');
            } finally {
                // Restaurar botón
                registerButton.innerHTML = originalText;
                registerButton.disabled = false;
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
    
    // Mostrar/ocultar confirmar contraseña
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (toggleConfirmPassword && confirmPasswordInput) {
        toggleConfirmPassword.addEventListener('click', function() {
            const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }
    
    console.log('Inicialización del registro completada');
});
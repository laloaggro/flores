import { updateCartCount, getUserInfoFromToken as getUser, isAuthenticated, logout, isAdmin, API_BASE_URL } from './utils.js';

// Función para inicializar el menú de usuario
export function initUserMenu() {
    // Forzar limpieza adicional
    if (!isAuthenticated()) {
        localStorage.removeItem('user');
    }
    
    const user = getUser();
    const userMenu = document.getElementById('userMenu');
    const loginLink = document.getElementById('loginLink');
    const userNameElement = document.getElementById('userNameDisplay');
    const logoutLink = document.getElementById('logoutLink');
    const userDropdown = document.querySelector('.user-dropdown');
    const userMenuButton = document.querySelector('.user-info');
    
    // Ocultar el enlace de login en la página de login
    if (window.location.pathname.includes('login.html')) {
        if (loginLink) {
            loginLink.style.display = 'none';
        }
    } else {
        // Mostrar/ocultar elementos según el estado de autenticación
        if (isAuthenticated() && user) {
            // Usuario autenticado
            if (loginLink) loginLink.style.display = 'none';
            if (userMenu) userMenu.style.display = 'block';
            if (userNameElement) userNameElement.textContent = user.name;
            
            console.log('Usuario autenticado:', user);
        } else {
            // Usuario no autenticado
            if (loginLink) loginLink.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'none';
            
            console.log('Usuario no autenticado');
        }
    }
    
    // Configurar evento de cierre de sesión
    if (logoutLink) {
        // Eliminar event listeners previos para evitar duplicados
        const newLogoutLink = logoutLink.cloneNode(true);
        if (logoutLink.parentNode) {
            logoutLink.parentNode.replaceChild(newLogoutLink, logoutLink);
        }
        
        newLogoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Cerrando sesión...');
            logout();
        });
    }
    
    // Configurar menú desplegable del usuario
    if (userMenuButton && userDropdown) {
        // Eliminar event listeners previos para evitar duplicados
        const newUserMenuButton = userMenuButton.cloneNode(true);
        if (userMenuButton.parentNode) {
            userMenuButton.parentNode.replaceChild(newUserMenuButton, userMenuButton);
        }
        
        newUserMenuButton.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Click en menú de usuario...');
            
            // Cerrar todos los dropdowns primero
            document.querySelectorAll('.user-dropdown').forEach(dropdown => {
                if (dropdown !== userDropdown) {
                    dropdown.style.display = 'none';
                }
            });
            
            // Actualizar todos los botones (excepto el actual)
            document.querySelectorAll('.user-info').forEach(button => {
                if (button !== newUserMenuButton) {
                    button.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Alternar estado del menú actual
            const isExpanded = newUserMenuButton.getAttribute('aria-expanded') === 'true';
            newUserMenuButton.setAttribute('aria-expanded', !isExpanded);
            userDropdown.style.display = isExpanded ? 'none' : 'block';
            
            console.log('Menú de usuario', isExpanded ? 'oculto' : 'mostrado');
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!newUserMenuButton.contains(e.target) && !userDropdown.contains(e.target)) {
                newUserMenuButton.setAttribute('aria-expanded', 'false');
                userDropdown.style.display = 'none';
            }
        });
    }
}

// Función para mostrar/ocultar contraseña
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    
    if (passwordInput && togglePassword) {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    }
}

// Función para validar el formulario de login/registro
function validateForm(formType) {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Validar email
    if (!email) {
        showNotification('Por favor ingresa tu email', 'error');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Por favor ingresa un email válido', 'error');
        return false;
    }
    
    // Validar contraseña
    if (!password) {
        showNotification('Por favor ingresa tu contraseña', 'error');
        return false;
    }
    
    if (formType === 'register') {
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (password !== confirmPassword) {
            showNotification('Las contraseñas no coinciden', 'error');
            return false;
        }
        
        if (!isStrongPassword(password)) {
            showNotification('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número', 'error');
            return false;
        }
    }
    
    return true;
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para validar contraseña segura
function isStrongPassword(password) {
    // Al menos 8 caracteres, una mayúscula, una minúscula y un número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Eliminar notificaciones existentes
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Añadir al body
    document.body.appendChild(notification);
    
    // Añadir evento para cerrar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
    
    // Eliminar automáticamente después de 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Función para manejar el login
async function handleLogin(event) {
    event.preventDefault();
    
    if (!validateForm('login')) {
        return;
    }
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe')?.checked || false;
    
    // Mostrar indicador de carga
    const loginButton = document.querySelector('.btn-login');
    const originalText = loginButton.innerHTML;
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
    loginButton.disabled = true;
    
    try {
        console.log('Intentando iniciar sesión con:', { email });
        
        const response = await fetch(`${API_BASE_URL}/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        
        if (response.ok && data.token) {
            // Guardar token
            setAuthToken(data.token);
            
            // Guardar datos del usuario si se solicitó recordar
            if (rememberMe) {
                localStorage.setItem('user', JSON.stringify({
                    name: data.name,
                    email: data.email
                }));
            }
            
            showNotification('¡Inicio de sesión exitoso!', 'success');
            
            // Redirigir después de un breve retraso
            setTimeout(() => {
                // Si venía de una página de producto, redirigir allí
                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect');
                if (redirect) {
                    window.location.href = redirect;
                } else {
                    window.location.href = 'index.html';
                }
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
}

// Función para manejar el registro
async function handleRegister(event) {
    event.preventDefault();
    
    if (!validateForm('register')) {
        return;
    }
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Mostrar indicador de carga
    const registerButton = document.querySelector('.btn-register');
    const originalText = registerButton.innerHTML;
    registerButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
    registerButton.disabled = true;
    
    try {
        console.log('Intentando registrar usuario:', { name, email });
        
        const response = await fetch(`${API_BASE_URL}/api/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        
        if (response.ok && data.token) {
            // Guardar token
            setAuthToken(data.token);
            
            showNotification('¡Registro exitoso! Bienvenido a Arreglos Victoria', 'success');
            
            // Redirigir después de un breve retraso
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
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
}


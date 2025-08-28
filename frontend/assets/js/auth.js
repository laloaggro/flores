import { updateCartCount, getUserInfoFromToken as getUser, isAuthenticated, logout, isAdmin, API_BASE_URL, showNotification } from './utils.js';

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
    const adminMenuItem = document.getElementById('adminMenuItem');
    const sitemapMenuItem = document.getElementById('sitemapMenuItem');
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
            
            // Mostrar elementos de administración y sitemap si el usuario es admin
            if (adminMenuItem) {
                adminMenuItem.style.display = user.role === 'admin' ? 'block' : 'none';
            }
            if (sitemapMenuItem) {
                sitemapMenuItem.style.display = user.role === 'admin' ? 'block' : 'none';
            }
        } else {
            // Usuario no autenticado
            if (loginLink) loginLink.style.display = 'block';
            if (userMenu) userMenu.style.display = 'none';
            // Asegurar que los elementos de administración y sitemap estén ocultos para usuarios no autenticados
            if (adminMenuItem) adminMenuItem.style.display = 'none';
            if (sitemapMenuItem) sitemapMenuItem.style.display = 'none';
        }
    }
    
    // Configurar evento de logout
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    // Configurar menú desplegable del usuario
    if (userMenuButton && userDropdown) {
        userMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!userMenuButton.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }
}

// Función para manejar el inicio de sesión
export async function handleLogin(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Guardar token y usuario en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role
            }));
            
            // Mostrar notificación de éxito
            showNotification('Inicio de sesión exitoso', 'success');
            
            // Redirigir a la página principal después de un breve retraso
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            // Mostrar error
            showNotification(data.error || 'Error al iniciar sesión', 'error');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        showNotification('Error de conexión. Por favor, inténtelo de nuevo.', 'error');
    }
}

// Función para manejar el registro
export async function handleRegister(name, email, password, phone) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, phone })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Mostrar notificación de éxito
            showNotification('Registro exitoso. Por favor, inicie sesión.', 'success');
            
            // Redirigir a la página de login después de un breve retraso
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            // Mostrar error
            showNotification(data.error || 'Error al registrarse', 'error');
        }
    } catch (error) {
        console.error('Error al registrarse:', error);
        showNotification('Error de conexión. Por favor, inténtelo de nuevo.', 'error');
    }
}

// Función para obtener el perfil del usuario
export async function getUserProfile() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }
        
        const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener el perfil del usuario');
        }
        
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        showNotification('Error al obtener el perfil del usuario', 'error');
        throw error;
    }
}

// Función para actualizar el perfil del usuario
export async function updateUserProfile(userData) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }
        
        const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Actualizar datos del usuario en localStorage
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...currentUser, ...userData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            showNotification('Perfil actualizado correctamente', 'success');
            return data;
        } else {
            showNotification(data.error || 'Error al actualizar el perfil', 'error');
            throw new Error(data.error || 'Error al actualizar el perfil');
        }
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        showNotification('Error de conexión. Por favor, inténtelo de nuevo.', 'error');
        throw error;
    }
}

// Función para cambiar la contraseña del usuario
export async function changePassword(currentPassword, newPassword) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }
        
        const response = await fetch(`${API_BASE_URL}/api/users/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Contraseña cambiada correctamente', 'success');
            return data;
        } else {
            showNotification(data.error || 'Error al cambiar la contraseña', 'error');
            throw new Error(data.error || 'Error al cambiar la contraseña');
        }
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        showNotification('Error de conexión. Por favor, inténtelo de nuevo.', 'error');
        throw error;
    }
}

// Función para inicializar la funcionalidad de autenticación
export function initAuth() {
    // Inicializar menú de usuario
    initUserMenu();
    
    // Configurar formularios de login y registro
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Validar campos
            if (!email || !password) {
                showNotification('Por favor, complete todos los campos', 'error');
                return;
            }
            
            // Deshabilitar botón durante el proceso
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
            
            try {
                await handleLogin(email, password);
            } finally {
                // Rehabilitar botón
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const phone = document.getElementById('phone').value;
            
            // Validar campos
            if (!name || !email || !password || !phone) {
                showNotification('Por favor, complete todos los campos', 'error');
                return;
            }
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Por favor, ingrese un email válido', 'error');
                return;
            }
            
            // Validar contraseña
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                showNotification('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número', 'error');
                return;
            }
            
            // Validar teléfono
            const phoneRegex = /^(\+569|9)\d{8}$/;
            if (!phoneRegex.test(phone)) {
                showNotification('Por favor, ingrese un teléfono válido (ej: +56912345678)', 'error');
                return;
            }
            
            // Deshabilitar botón durante el proceso
            const submitButton = registerForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
            
            try {
                await handleRegister(name, email, password, phone);
            } finally {
                // Rehabilitar botón
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }
        });
    }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
});


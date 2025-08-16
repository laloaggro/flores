// profile.js - Manejo de la página de perfil de usuario

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está logueado
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !user) {
        // Si no hay token o usuario, redirigir al login
        window.location.href = 'login.html';
        return;
    }
    
    // Verificar si el usuario es administrador
    // Ya no redirigimos automáticamente al panel de administración
    // Los administradores pueden acceder a su perfil personal
    
    // Mostrar información del usuario
    displayUserInfo(user);
    
    // Configurar event listeners
    setupEventListeners();
    
    // Cargar datos adicionales del usuario
    loadUserStats();
});

// Mostrar información del usuario
function displayUserInfo(user) {
    // Actualizar elementos del DOM con la información del usuario
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    const profileNameElement = document.getElementById('profileName');
    const profileEmailElement = document.getElementById('profileEmail');
    const profilePhoneElement = document.getElementById('profilePhone');
    
    if (userNameElement) userNameElement.textContent = user.name || 'Usuario';
    if (userEmailElement) userEmailElement.textContent = user.email || '';
    if (profileNameElement) profileNameElement.textContent = user.name || 'Usuario';
    if (profileEmailElement) profileEmailElement.textContent = user.email || '';
    if (profilePhoneElement) profilePhoneElement.textContent = user.phone || '';
}

// Configurar event listeners
function setupEventListeners() {
    // Botón de cerrar sesión
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            // Eliminar datos de sesión
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Redirigir a la página principal
            window.location.href = 'index.html';
        });
    }
    
    // Enlace de cerrar sesión en el menú
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Eliminar datos de sesión
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Redirigir a la página principal
            window.location.href = 'index.html';
        });
    }
    
    // Formulario de perfil
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateProfile();
        });
    }
    
    // Botón de cambiar avatar
    const changeAvatarButton = document.getElementById('changeAvatarButton');
    if (changeAvatarButton) {
        changeAvatarButton.addEventListener('click', function() {
            changeAvatar();
        });
    }
    
    // Menú de perfil
    const profileMenuItems = document.querySelectorAll('.profile-menu a');
    profileMenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase active de todos los items
            document.querySelectorAll('.profile-menu li').forEach(li => {
                li.classList.remove('active');
            });
            
            // Agregar clase active al item seleccionado
            this.parentElement.classList.add('active');
            
            // Aquí se cargaría el contenido correspondiente
            const section = this.getAttribute('href').substring(1);
            loadProfileSection(section);
        });
    });
}

// Actualizar perfil
function updateProfile() {
    const profileForm = document.getElementById('profileForm');
    if (!profileForm) return;
    
    const formData = new FormData(profileForm);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address')
    };
    
    // Actualizar datos en localStorage
    const user = JSON.parse(localStorage.getItem('user')) || {};
    Object.assign(user, userData);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Actualizar UI
    displayUserInfo(user);
    
    // Mostrar mensaje de éxito
    alert('Perfil actualizado correctamente');
}

// Cargar sección del perfil
function loadProfileSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.profile-content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    }
}

// Cargar estadísticas del usuario
function loadUserStats() {
    // Simular carga de estadísticas
    const orderCountElement = document.getElementById('orderCount');
    const productCountElement = document.getElementById('productCount');
    const totalSpentElement = document.getElementById('totalSpent');
    
    if (orderCountElement) orderCountElement.textContent = '5';
    if (productCountElement) productCountElement.textContent = '12';
    if (totalSpentElement) totalSpentElement.textContent = '$125.000';
}

// Cambiar avatar
function changeAvatar() {
    // Simular cambio de avatar
    alert('Funcionalidad de cambio de avatar no implementada aún');
}

// Exportar funciones para uso global
window.loadProfileSection = loadProfileSection;
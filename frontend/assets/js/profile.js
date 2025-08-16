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
    
    // Mostrar información del usuario
    displayUserInfo(user);
    
    // Configurar event listeners
    setupEventListeners();
    
    // Cargar datos adicionales del usuario
    loadUserStats();
    
    // Configurar navegación del perfil
    setupProfileNavigation();
});

// Mostrar información del usuario
function displayUserInfo(user) {
    // Actualizar elementos del DOM con la información del usuario
    const userNameElement = document.getElementById('userName');
    const profileNameElement = document.getElementById('profileName');
    const userEmailElement = document.getElementById('userEmail');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    
    if (userNameElement) userNameElement.textContent = user.name || 'Usuario';
    if (profileNameElement) profileNameElement.textContent = user.name || 'Usuario';
    if (userEmailElement) userEmailElement.textContent = user.email || '';
    
    // Rellenar el formulario con los datos del usuario
    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
    if (phoneInput) phoneInput.value = user.phone || '';
    if (addressInput) addressInput.value = user.address || '';
}

// Configurar event listeners
function setupEventListeners() {
    // Botón de cerrar sesión
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
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
    
    // Botón de cambiar contraseña
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            showChangePasswordModal();
        });
    }
    
    // Botón de cambiar avatar
    const changeAvatarButton = document.getElementById('changeAvatarButton');
    if (changeAvatarButton) {
        changeAvatarButton.addEventListener('click', function() {
            showChangeAvatarModal();
        });
    }
}

// Actualizar perfil
function updateProfile() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    
    // Validación básica
    if (!name || !email) {
        alert('Por favor complete los campos obligatorios (Nombre y Email)');
        return;
    }
    
    // Obtener usuario actual
    const user = JSON.parse(localStorage.getItem('user')) || {};
    
    // Actualizar datos del usuario
    user.name = name;
    user.email = email;
    user.phone = phone;
    user.address = address;
    
    // Guardar en localStorage
    localStorage.setItem('user', JSON.stringify(user));
    
    // Actualizar UI
    displayUserInfo(user);
    
    // Mostrar mensaje de éxito
    alert('Perfil actualizado correctamente');
}

// Configurar navegación del perfil
function setupProfileNavigation() {
    const menuLinks = document.querySelectorAll('.profile-menu a');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showProfileSection(sectionId);
        });
    });
}

// Mostrar sección del perfil
function showProfileSection(sectionId) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.profile-content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Actualizar enlaces activos
    const menuItems = document.querySelectorAll('.profile-menu li');
    menuItems.forEach(item => {
        item.classList.remove('active');
        const link = item.querySelector('a');
        if (link && link.getAttribute('data-section') === sectionId) {
            item.classList.add('active');
        }
    });
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

// Manejar cierre de sesión
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Mostrar modal para cambiar contraseña
function showChangePasswordModal() {
    alert('Funcionalidad de cambio de contraseña no implementada en esta demo');
}

// Mostrar modal para cambiar avatar
function showChangeAvatarModal() {
    alert('Funcionalidad de cambio de avatar no implementada en esta demo');
}

// Cargar estadísticas del usuario
function loadUserStats() {
    // Simular carga de estadísticas
    document.getElementById('orderCount').textContent = '5';
    document.getElementById('productCount').textContent = '12';
    document.getElementById('totalSpent').textContent = '$125.990';
}
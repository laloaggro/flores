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
    const userEmailElement = document.getElementById('userEmail');
    const profileFirstName = document.getElementById('profileFirstName');
    const profileLastName = document.getElementById('profileLastName');
    const profileEmail = document.getElementById('profileEmail');
    const profilePhone = document.getElementById('profilePhone');
    const profileAddress = document.getElementById('profileAddress');
    
    if (userNameElement) userNameElement.textContent = user.name || 'Usuario';
    if (userEmailElement) userEmailElement.textContent = user.email || '';
    
    // Rellenar el formulario con los datos del usuario
    if (profileFirstName) profileFirstName.value = user.name ? user.name.split(' ')[0] : '';
    if (profileLastName) {
        const nameParts = user.name ? user.name.split(' ') : [];
        profileLastName.value = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    }
    if (profileEmail) profileEmail.value = user.email || '';
    if (profilePhone) profilePhone.value = user.phone || '';
    if (profileAddress) profileAddress.value = user.address || '';
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
    
    // Formulario de cambio de contraseña
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            changePassword();
        });
    }
    
    // Formulario de configuración
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateSettings();
        });
    }
}

// Actualizar perfil
function updateProfile() {
    const profileFirstName = document.getElementById('profileFirstName').value;
    const profileLastName = document.getElementById('profileLastName').value;
    const profilePhone = document.getElementById('profilePhone').value;
    const profileAddress = document.getElementById('profileAddress').value;
    
    // Validación básica
    if (!profileFirstName || !profileLastName) {
        alert('Por favor complete los campos obligatorios (Nombre y Apellido)');
        return;
    }
    
    // Obtener usuario actual
    const user = JSON.parse(localStorage.getItem('user')) || {};
    
    // Actualizar datos del usuario
    user.name = `${profileFirstName} ${profileLastName}`;
    user.phone = profilePhone;
    user.address = profileAddress;
    
    // Guardar en localStorage
    localStorage.setItem('user', JSON.stringify(user));
    
    // Actualizar UI
    displayUserInfo(user);
    
    // Mostrar mensaje de éxito
    alert('Perfil actualizado correctamente');
}

// Configurar navegación del perfil
function setupProfileNavigation() {
    // La navegación se maneja ahora con el script en línea en profile.html
}

// Cargar estadísticas del usuario
function loadUserStats() {
    // En una implementación real, aquí se haría una llamada al servidor
    // para obtener estadísticas del usuario
}

// Cambiar contraseña
function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    // Validación básica
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        alert('Por favor complete todos los campos');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        alert('Las contraseñas nuevas no coinciden');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('La nueva contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    // En una implementación real, aquí se haría una llamada al servidor
    // para cambiar la contraseña
    
    // Mostrar mensaje de éxito
    alert('Contraseña actualizada correctamente');
    
    // Limpiar el formulario
    document.getElementById('changePasswordForm').reset();
}

// Actualizar configuración
function updateSettings() {
    const notifications = document.getElementById('notifications').checked;
    const newsletter = document.getElementById('newsletter').checked;
    
    // En una implementación real, aquí se haría una llamada al servidor
    // para guardar la configuración
    
    // Mostrar mensaje de éxito
    alert('Configuración guardada correctamente');
}

// Manejar cierre de sesión
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}
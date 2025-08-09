// profile.js - Manejo de la página de perfil de usuario

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está logueado
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !user) {
        // Si no hay token o usuario, redirigir al login
        window.location.href = '/login.html';
        return;
    }
    
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
    if (profileNameElement) profileNameElement.value = user.name || '';
    if (profileEmailElement) profileEmailElement.value = user.email || '';
    if (profilePhoneElement) profilePhoneElement.value = user.phone || '';
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
            window.location.href = '/index.html';
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
        birthdate: formData.get('birthdate'),
        bio: formData.get('bio')
    };
    
    // Mostrar mensaje de guardado
    alert('Perfil actualizado correctamente');
    
    // Actualizar datos en localStorage
    const user = JSON.parse(localStorage.getItem('user')) || {};
    Object.assign(user, userData);
    localStorage.setItem('user', JSON.stringify(user));
}

// Cambiar avatar
function changeAvatar() {
    // En una implementación real, aquí se abriría un diálogo para seleccionar una imagen
    alert('Funcionalidad de cambio de avatar no implementada en esta demo');
}

// Cargar estadísticas del usuario
function loadUserStats() {
    // En una implementación real, aquí se cargarían datos reales del servidor
    const orderCountElement = document.getElementById('orderCount');
    const favoriteCountElement = document.getElementById('favoriteCount');
    
    if (orderCountElement) orderCountElement.textContent = '5'; // Ejemplo
    if (favoriteCountElement) favoriteCountElement.textContent = '3'; // Ejemplo
}

// Cargar sección del perfil
function loadProfileSection(section) {
    const contentElement = document.getElementById('profileContent');
    if (!contentElement) return;
    
    // En una implementación real, aquí se cargaría contenido dinámico según la sección
    switch (section) {
        case 'orders':
            contentElement.innerHTML = `
                <h2><i class="fas fa-shopping-bag"></i> Mis Pedidos</h2>
                <p>Aquí se mostrarían los pedidos del usuario.</p>
            `;
            break;
        case 'favorites':
            contentElement.innerHTML = `
                <h2><i class="fas fa-heart"></i> Favoritos</h2>
                <p>Aquí se mostrarían los productos favoritos del usuario.</p>
            `;
            break;
        case 'addresses':
            contentElement.innerHTML = `
                <h2><i class="fas fa-map-marker-alt"></i> Direcciones</h2>
                <p>Aquí se mostrarían las direcciones del usuario.</p>
            `;
            break;
        case 'settings':
            contentElement.innerHTML = `
                <h2><i class="fas fa-cog"></i> Configuración</h2>
                <p>Aquí se mostrarían las opciones de configuración del usuario.</p>
            `;
            break;
        default:
            // Recargar el formulario de perfil
            contentElement.innerHTML = `
                <h2><i class="fas fa-user"></i> Información Personal</h2>
                <form id="profileForm" class="profile-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="profileName">Nombre Completo</label>
                            <input type="text" id="profileName" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="profileEmail">Email</label>
                            <input type="email" id="profileEmail" name="email" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="profilePhone">Teléfono</label>
                            <input type="tel" id="profilePhone" name="phone">
                        </div>
                        <div class="form-group">
                            <label for="profileBirthdate">Fecha de Nacimiento</label>
                            <input type="date" id="profileBirthdate" name="birthdate">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="profileBio">Biografía</label>
                        <textarea id="profileBio" name="bio" rows="4" placeholder="Cuéntanos un poco sobre ti..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                </form>
            `;
            
            // Reasignar event listener al formulario
            const newProfileForm = document.getElementById('profileForm');
            if (newProfileForm) {
                newProfileForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    updateProfile();
                });
            }
            break;
    }
}
// theme.js - Manejo del tema claro/oscuro

// Función para actualizar el ícono del botón de tema
function updateThemeIcon() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const currentTheme = document.body.getAttribute('data-theme');
        const icon = themeToggle.querySelector('i');
        if (icon) {
            if (currentTheme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                themeToggle.setAttribute('aria-label', 'Cambiar a modo claro');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                themeToggle.setAttribute('aria-label', 'Cambiar a modo oscuro');
            }
        }
    }
}

// Función para cambiar el tema
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Aplicar el nuevo tema
    document.body.setAttribute('data-theme', newTheme);
    
    // Guardar la preferencia en localStorage
    localStorage.setItem('theme', newTheme);
    
    // Actualizar el ícono del botón de tema
    updateThemeIcon();
}

// Inicializar el tema cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si hay una preferencia de tema guardada
    let savedTheme = localStorage.getItem('theme');
    
    // Si no hay preferencia guardada, usar el modo claro por defecto
    if (!savedTheme) {
        savedTheme = 'light';
        localStorage.setItem('theme', savedTheme);
    }
    
    // Aplicar el tema
    document.body.setAttribute('data-theme', savedTheme);
    
    // Actualizar el ícono del botón de tema si existe
    updateThemeIcon();
    
    // Agregar evento de clic al botón de cambio de tema
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
});
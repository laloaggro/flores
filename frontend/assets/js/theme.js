// theme.js - Manejo del modo claro/oscuro

document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando funcionalidad de tema');
    
    // Verificar si hay una preferencia de tema guardada
    const savedTheme = localStorage.getItem('theme');
    console.log('Tema guardado:', savedTheme);
    
    // Aplicar el tema guardado o el modo claro por defecto
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        console.log('Modo oscuro activado desde localStorage');
    } else {
        // Siempre usar modo claro por defecto, ignorando la preferencia del sistema
        document.body.removeAttribute('data-theme');
        console.log('Modo claro activado por defecto');
    }
    
    // Crear botón de cambio de tema si no existe
    createThemeToggle();
    
    console.log('Funcionalidad de tema inicializada');
});

// Función para crear el botón de cambio de tema
function createThemeToggle() {
    console.log('Creando botón de cambio de tema');
    
    // Verificar si ya existe el botón
    const existingToggle = document.getElementById('theme-toggle');
    if (existingToggle) {
        console.log('Botón de cambio de tema ya existe, actualizando icono y evento');
        // Asegurarse de que el botón tenga el evento de clic
        existingToggle.removeEventListener('click', handleThemeToggle);
        existingToggle.addEventListener('click', handleThemeToggle);
        updateThemeIcon();
        return;
    }
    
    // Crear el botón
    const themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Cambiar modo de tema');
    
    // Añadir estilos al botón
    themeToggle.style.cssText = `
        background: var(--light);
        border: 1px solid var(--gray);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-left: 1rem;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    
    // Añadir estilos para modo oscuro del botón
    const style = document.createElement('style');
    style.textContent = `
        body[data-theme="dark"] .theme-toggle {
            background: #3a3a3a;
            border-color: var(--dark-border);
            color: var(--dark-text);
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
        
        .theme-toggle:hover {
            background: var(--gray);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        
        body[data-theme="dark"] .theme-toggle:hover {
            background: #4a4a4a;
            box-shadow: 0 4px 8px rgba(0,0,0,0.4);
        }
        
        /* Estilos para transición suave entre modos */
        body {
            transition: background-color 0.3s ease, color 0.3s ease;
        }
        
        body * {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Añadir funcionalidad al botón
    themeToggle.addEventListener('click', handleThemeToggle);
    
    // Añadir el botón al header
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.appendChild(themeToggle);
        console.log('Botón de cambio de tema añadido al header');
    } else {
        console.warn('No se encontró el elemento .navbar para añadir el botón de tema');
    }
    
    // Actualizar icono inicial
    updateThemeIcon();
}

// Función para actualizar el icono del tema
function updateThemeIcon() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const isDarkMode = document.body.getAttribute('data-theme') === 'dark';
        themeToggle.innerHTML = isDarkMode 
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
    }
}

// Función para cambiar entre modo claro y oscuro
function toggleTheme() {
    console.log('toggleTheme() llamado');
    
    const isDarkMode = document.body.getAttribute('data-theme') === 'dark';
    
    if (isDarkMode) {
        // Cambiar a modo claro
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        console.log('Modo claro activado');
    } else {
        // Cambiar a modo oscuro
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        console.log('Modo oscuro activado');
    }
    
    // Actualizar icono
    updateThemeIcon();
}

// Función para manejar el clic en el botón de cambio de tema
function handleThemeToggle() {
    console.log('Cambiando tema');
    toggleTheme();
}

// Exportar funciones
export { toggleTheme, createThemeToggle };